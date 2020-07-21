var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');
var encryption = require('../commons/encryption.js');

var pool = new pg.Pool(config);

router.get('/:employeeId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.employeeId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, "+
                      "(select username from users as um where emp.emp_id = um.user_emp_id )  "+
                    // "from employee_master emp "+
                    "from employee_master emp "+
                    "LEFT OUTER JOIN company_master com on emp.emp_com_id = com.com_id "+
                    "where emp.emp_status=0 "+
                    "and com.com_status=0 "+
                    "and emp.emp_id=$1";

    // SQL Query > Select Data
    const query = client.query(strqry,[id]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.post('/checkname', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * "+
                    "from employee_master emp "+
                    "LEFT OUTER JOIN company_master com on emp.emp_com_id = com.com_id "+
                    "where emp.emp_status=0 "+
                    "and com.com_status=0 "+
                    "and emp.emp_com_id=$1"+
                    "and LOWER(emp.emp_name) like LOWER($2)"+
                    "and LOWER(emp.emp_mobile) like LOWER($3)";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.emp_com_id,req.body.emp_name,req.body.emp_mobile]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.post('/add', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }  

    var singleInsert = 'INSERT INTO employee_master(emp_name, emp_mobile, emp_address, emp_id_card, emp_email, emp_com_id, emp_status) values($1,$2,$3,$4,$5,$6,0) RETURNING *',
        params = [req.body.emp_name,req.body.emp_mobile,req.body.emp_address,req.body.emp_id_card,req.body.emp_email,req.body.emp_com_id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
 
    client.query('INSERT INTO users(username, password, first_name, user_type, email, user_emp_id)VALUES ($1, $2, $3, $4, $5, $6)',
        [req.body.emp_username,encryption.encrypt(req.body.emp_password),req.body.emp_name,req.body.emp_type,req.body.emp_email,result.rows[0].emp_id]);
          
        return res.json(results);
        done();
    });

    done(err);
  });
});

router.post('/edit/:employeeId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.employeeId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var singleInsert = 'UPDATE employee_master SET emp_name=$1, emp_mobile=$2, emp_address=$3, emp_id_card=$4, emp_email=$5, emp_updated_at=now() where emp_id=$6 RETURNING *',
        params = [req.body.emp_name,req.body.emp_mobile,req.body.emp_address,req.body.emp_id_card,req.body.emp_email,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        client.query('COMMIT;');
        return res.json(results);
    });

    done(err);
  });
});

router.post('/delete/:employeeId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.employeeId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var singleInsert = 'update employee_master set emp_status=1, emp_updated_at=now() where emp_id=$1 RETURNING *',
        params = [id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        client.query('COMMIT;');
        return res.json(results);
    });

    done(err);
  });
});

router.get('/details/:employeeId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.employeeId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query("select sm.sm_invoice_no as sm_invoice, vm.cm_name, vm.cm_address, sm.sm_date, sm.sm_amount, sm.sm_balance_amount, sm.sm_status from sale_master sm LEFT OUTER JOIN customer_master vm on sm.sm_cm_id=vm.cm_id LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id where emp.emp_id = $1 order by sm_date desc",[id]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.post('/employee/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  console.log(req.body);
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT count(emp.emp_id) as total "+
                    "from employee_master emp "+
                    "LEFT OUTER JOIN company_master com on emp.emp_com_id = com.com_id "+
                     
                      // "where cdm_cm_id in (select tcr_camp_id from telecaller_campaign_relation where tcr_emp_id=$1) "+

                    "where emp.emp_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(emp_name||''||emp_mobile ) LIKE LOWER($2);";

    const query = client.query(strqry,[req.body.com_id,str]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.post('/employee/limit', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";
    // SQL Query > Select Data

    const strqry =  "SELECT *, "+
                      "(select username from users as um where emp.emp_id = um.user_emp_id )  "+
                    "from employee_master emp "+
                    "LEFT OUTER JOIN company_master com on emp.emp_com_id = com.com_id "+
                    "where emp.emp_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(emp_name||''||emp_mobile ) LIKE LOWER($2) "+
                    "order by emp.emp_id desc LIMIT $3 OFFSET $4";

    const query = client.query(strqry,[req.body.com_id, str, req.body.number, req.body.begin]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.post('/typeahead/search', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";
    // SQL Query > Select Data

    const strqry =  "SELECT * "+
                    "from employee_master emp "+
                    "LEFT OUTER JOIN company_master com on emp.emp_com_id = com.com_id "+
                    "where emp.emp_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(emp_name ) LIKE LOWER($2) "+
                    "order by emp.emp_id desc LIMIT 16";

    const query = client.query(strqry,[req.body.com_id, str]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

module.exports = router;
