var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:etmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.etmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const strqry =  "SELECT * "+
                    "FROM EXPENSE_TYPE_MASTER etm "+
                    "LEFT OUTER JOIN company_master com on etm.etm_com_id = com.com_id "+
                    "where etm.etm_status = 0 "+
                    "and com.com_status=0 "+
                    "and etm.etm_id=$1";

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
  const id = req.params.etmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const strqry =  "SELECT * "+
                    "FROM EXPENSE_TYPE_MASTER etm "+
                    "LEFT OUTER JOIN company_master com on etm.etm_com_id = com.com_id "+
                    "where etm.etm_status = 0 "+
                    "and com.com_status=0 "+
                    "and etm.etm_com_id=$1"+
                    "and LOWER(etm.etm_type) like LOWER($2)";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.etm_com_id,req.body.etm_type]);
    
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

    var singleInsert = 'INSERT INTO expense_type_master(etm_type, etm_com_id, etm_status) values($1,$2,0) RETURNING *',
        params = [req.body.etm_type,req.body.etm_com_id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/edit/:etmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.etmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    var singleInsert = 'UPDATE expense_type_master SET etm_type=$1, etm_updated_at=now() where etm_id=$2 RETURNING *',
        params = [req.body.etm_type,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/delete/:etmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.etmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    var singleInsert = 'UPDATE expense_type_master SET etm_status=1, etm_updated_at=now() where etm_id=$1 RETURNING *',
        params = [id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        return res.json(results);
    });
    
    done(err);
  });
});

router.post('/expensetype/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(etm.etm_id) as total "+
                    "FROM EXPENSE_TYPE_MASTER etm "+
                    "LEFT OUTER JOIN company_master com on etm.etm_com_id = com.com_id "+
                    "where etm.etm_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(etm_type ) LIKE LOWER($2);";

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

router.post('/expensetype/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM EXPENSE_TYPE_MASTER etm "+
                    "LEFT OUTER JOIN company_master com on etm.etm_com_id = com.com_id "+
                    "where etm.etm_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(etm_type ) LIKE LOWER($2) "+
                    "order by etm.etm_id desc LIMIT $3 OFFSET $4";

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
                    "FROM EXPENSE_TYPE_MASTER etm "+
                    "LEFT OUTER JOIN company_master com on etm.etm_com_id = com.com_id "+
                    "where etm.etm_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(etm_type ) LIKE LOWER($2) "+
                    "order by etm.etm_id desc LIMIT 16";

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
