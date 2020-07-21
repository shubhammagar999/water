var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:bankId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.bankId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM bank_master bkm "+
                    "LEFT OUTER JOIN company_master com on bkm.bkm_com_id = com.com_id "+
                    "where bkm.bkm_status=0 "+
                    "and com.com_status=0 "+
                    "and bkm.bkm_id=$1";
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
    // SQL Query > Select Data
    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM bank_master bkm "+
                    "LEFT OUTER JOIN company_master com on bkm.bkm_com_id = com.com_id "+
                    "where bkm.bkm_status=0 "+
                    "and com.com_status=0 "+
                    "and bkm.bkm_com_id=$1"+
                    "and LOWER(bkm.bkm_name) like LOWER($2)"+
                    "and LOWER(bkm.bkm_account_no) like LOWER($3)";
    const query = client.query(strqry,[req.body.bkm_com_id, req.body.bkm_name, req.body.bkm_account_no]);
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

router.post('/getbankdetails', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM bank_master bkm "+
                    "LEFT OUTER JOIN company_master com on bkm.bkm_com_id = com.com_id "+
                    "where bkm.bkm_status=0 "+
                    "and bkm.bkm_default=true "+
                    "and com.com_status=0 "+
                    "and bkm.bkm_com_id=$1";
    const query = client.query(strqry,[req.body.com_id]);
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

    client.query('BEGIN;');
    if(req.body.bkm_default == true)
    {
      const strqry =  "SELECT bkm.bkm_id, bkm_default "+
                    "FROM bank_master bkm "+
                    "LEFT OUTER JOIN company_master com on bkm.bkm_com_id = com.com_id "+
                    "where bkm.bkm_status=0 "+
                    "and bkm.bkm_default=true "+
                    "and com.com_status=0 "+
                    "and bkm.bkm_com_id=$1";
      const query = client.query(strqry,[req.body.bkm_com_id]);
      query.on('row', (row) => {
        var singleInsert = 'UPDATE bank_master SET bkm_default=false where bkm_id=$1 RETURNING *',
            params = [row.bkm_id]
        client.query(singleInsert, params, function (error, result) {
        });
      });
      query.on('end', () => {
        var singleInsert = 'INSERT INTO bank_master(bkm_name, bkm_contact, bkm_email, bkm_address, bkm_state, bkm_city, bkm_pin, bkm_branch, bkm_account_no, bkm_opening_balance, bkm_balance, bkm_com_id, bkm_default, bkm_ifsc, bkm_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,0) RETURNING *',
          params = [req.body.bkm_name,req.body.bkm_contact,req.body.bkm_email,req.body.bkm_address,req.body.bkm_state,req.body.bkm_city,req.body.bkm_pin,req.body.bkm_branch,req.body.bkm_account_no,req.body.bkm_opening_balance,req.body.bkm_opening_balance,req.body.bkm_com_id,req.body.bkm_default,req.body.bkm_ifsc]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows
            client.query('COMMIT;');
            done();
            return res.json(results);
        });
      });
    }
    else
    {

      var singleInsert = 'INSERT INTO bank_master(bkm_name, bkm_contact, bkm_email, bkm_address, bkm_state, bkm_city, bkm_pin, bkm_branch, bkm_account_no, bkm_opening_balance, bkm_balance, bkm_com_id, bkm_default, bkm_ifsc, bkm_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,0) RETURNING *',
          params = [req.body.bkm_name,req.body.bkm_contact,req.body.bkm_email,req.body.bkm_address,req.body.bkm_state,req.body.bkm_city,req.body.bkm_pin,req.body.bkm_branch,req.body.bkm_account_no,req.body.bkm_opening_balance,req.body.bkm_opening_balance,req.body.bkm_com_id,req.body.bkm_default,req.body.bkm_ifsc]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows
          client.query('COMMIT;');
          done();
          return res.json(results);
      });
    }

    done(err);
  });
});

router.post('/edit/:bankId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.bankId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    const credit = req.body.bkm_opening_balance - req.body.old_opening_balance;

    if(req.body.bkm_default == true)
    {
      const strqry =  "SELECT bkm.bkm_id, bkm_default "+
                    "FROM bank_master bkm "+
                    "LEFT OUTER JOIN company_master com on bkm.bkm_com_id = com.com_id "+
                    "where bkm.bkm_status=0 "+
                    "and bkm.bkm_default=true "+
                    "and com.com_status=0 "+
                    "and bkm.bkm_com_id=$1";
      const query = client.query(strqry,[req.body.com_id]);
      query.on('row', (row) => {
        var singleInsert = 'UPDATE bank_master SET bkm_default=false where bkm_id=$1 RETURNING *',
            params = [row.bkm_id]
        client.query(singleInsert, params, function (error, result) {
        });
      });
      query.on('end', () => {
        var singleInsert = 'UPDATE bank_master SET bkm_name=$1, bkm_contact=$2, bkm_email=$3, bkm_address=$4, bkm_balance=bkm_balance+$5, bkm_opening_balance=$6, bkm_state=$7, bkm_city=$8, bkm_pin=$9, bkm_branch=$10, bkm_account_no=$11, bkm_default=$12, bkm_ifsc=$13, bkm_updated_at=now() where bkm_id=$14 RETURNING *',
            params = [req.body.bkm_name,req.body.bkm_contact,req.body.bkm_email,req.body.bkm_address,credit,req.body.bkm_opening_balance,req.body.bkm_state,req.body.bkm_city,req.body.bkm_pin,req.body.bkm_branch,req.body.bkm_account_no,req.body.bkm_default,req.body.bkm_ifsc,id]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows
            client.query('COMMIT;');
            done();
            return res.json(results);
        });
      });
    }
    else
    {

        var singleInsert = 'UPDATE bank_master SET bkm_name=$1, bkm_contact=$2, bkm_email=$3, bkm_address=$4, bkm_balance=bkm_balance+$5, bkm_opening_balance=$6, bkm_state=$7, bkm_city=$8, bkm_pin=$9, bkm_branch=$10, bkm_account_no=$11, bkm_default=$12, bkm_ifsc=$13, bkm_updated_at=now() where bkm_id=$14 RETURNING *',
        params = [req.body.bkm_name,req.body.bkm_contact,req.body.bkm_email,req.body.bkm_address,credit,req.body.bkm_opening_balance,req.body.bkm_state,req.body.bkm_city,req.body.bkm_pin,req.body.bkm_branch,req.body.bkm_account_no,req.body.bkm_default,req.body.bkm_ifsc,id]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows
            client.query('COMMIT;');
            done();
            return res.json(results);
        });
    }
    done(err);
  });
});

router.post('/delete/:bankId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.bankId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'update bank_master set bkm_status=1, bkm_default=false, bkm_updated_at=now() where bkm_id=$1 RETURNING *',
        params = [id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        client.query('COMMIT;');
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/details/:vmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.vmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

const querystr =  "select * from (select abc.com_id, 0 as idd, null as date, 'opening' as type,  "+
"CASE "+
"    WHEN sum(bal) >= 0 THEN sum(bal) "+
"    else 0 "+
"END AS deposit, "+
"CASE "+
"    WHEN sum(bal) < 0 THEN sum(bal) * '-1' "+
"    else 0 "+
"END AS withdraw, "+
" abc.bkm_id from (select com_id, bkm_id, sum(bal) as bal from bank_opening_fin_year_mv where bkm_id = $1 and fin_year < $2 group by com_id, bkm_id "+
"union "+
"select foo.com_id, foo.bkm_id, sum(foo.deposit - foo.withdraw) as bal  "+
"from (SELECT com.com_id, sum(ctm.ctm_amount) AS deposit, (0) AS withdraw, bkm.bkm_id "+
"   FROM cashtransfer_master ctm "+
"     LEFT JOIN bank_master bkm ON ctm.ctm_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON ctm.ctm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND ctm.ctm_status = 0 AND bkm.bkm_status = 0  "+
"  and ctm_date  "+
"  between "+
"  to_date(case WHEN to_char(to_date($3,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($4,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($5,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($6,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and bkm_id = $7 "+
"  group by com.com_id,bkm.bkm_id  "+
"  union "+
" SELECT com.com_id, (0) AS deposit, sum(bwm.bwm_amount) AS withdraw, bkm.bkm_id "+
"   FROM bankwithdraw_master bwm "+
"     LEFT JOIN bank_master bkm ON bwm.bwm_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON bwm.bwm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND bwm.bwm_status = 0 AND bkm.bkm_status = 0 "+
"  and bwm_date  "+
"  between "+
"  to_date(case WHEN to_char(to_date($8,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($9,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($10,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($11,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and bkm_id = $12 "+
"  group by com.com_id,bkm.bkm_id  "+
"  union "+
" SELECT com.com_id, sum(em.em_amount) AS deposit, (0) AS withdraw, bkm.bkm_id "+
"   FROM expense_master em "+
"     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 "+
"  and em_date   "+
"  between "+
"  to_date(case WHEN to_char(to_date($13,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($14,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($15,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($16,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and bkm_id = $17 "+
"  group by com.com_id,bkm.bkm_id   "+
"  union "+
" SELECT com.com_id, (0) AS deposit, sum(em.em_amount) AS withdraw, bkm.bkm_id "+
"   FROM purexpense_master em "+
"     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 "+
"  and em_date   "+
"  between "+
"  to_date(case WHEN to_char(to_date($18,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($19,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($20,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($21,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and bkm_id = $22 "+
"  group by com.com_id,bkm.bkm_id    "+
"  union "+
" SELECT com.com_id, (0) AS deposit, sum(em.em_amount) AS withdraw, bkm.bkm_id "+
"   FROM dailyexpense_master em "+
"     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 "+
"  and em_date   "+
"  between "+
"  to_date(case WHEN to_char(to_date($23,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($24,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($25,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($26,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and bkm_id = $27 "+
"  group by com.com_id,bkm.bkm_id ) as foo  "+
"  group by foo.com_id, foo.bkm_id) as abc "+
"  group by abc.com_id, abc.bkm_id "+
" "+
"  union "+
"   "+
"SELECT com.com_id, ctm_id as idd, ctm_date as date, 'Cashtransfer' as type, (ctm.ctm_amount) AS deposit, (0) AS withdraw, bkm.bkm_id "+
"   FROM cashtransfer_master ctm "+
"     LEFT JOIN bank_master bkm ON ctm.ctm_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON ctm.ctm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND ctm.ctm_status = 0 AND bkm.bkm_status = 0  "+
"  and ctm_date in (select date_actual from time_dimension where date_actual between $28 and $29)  and bkm_id = $30 "+
"  union "+
" SELECT com.com_id, bwm_id as idd, bwm_date as date,'bankwithdraw' as type, (0) AS deposit, (bwm.bwm_amount) AS withdraw, bkm.bkm_id "+
"   FROM bankwithdraw_master bwm "+
"     LEFT JOIN bank_master bkm ON bwm.bwm_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON bwm.bwm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND bwm.bwm_status = 0 AND bkm.bkm_status = 0 "+
"  and bwm_date in (select date_actual from time_dimension where date_actual between $31 and $32)  and bkm_id = $33 "+
"  union "+
" SELECT com.com_id, em_id as idd, em_date as date, 'DebtorsCashbook' as type, (em.em_amount) AS deposit, (0) AS withdraw, bkm.bkm_id "+
"   FROM expense_master em "+
"     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 "+
"  and em_date in (select date_actual from time_dimension where date_actual between $34 and $35) and bkm_id = $36 "+
"  union "+
" SELECT com.com_id, pem_id as idd, em_date as date, 'CreditorsCashbook' as type, (0) AS deposit, (em.em_amount) AS withdraw, bkm.bkm_id "+
"   FROM purexpense_master em "+
"     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 "+
"  and em_date in (select date_actual from time_dimension where date_actual between $37 and $38) and bkm_id = $39 "+
"  union "+
" SELECT com.com_id, dem_id as idd, em_date as date, 'DailyCashbook' as type, (0) AS deposit, (em.em_amount) AS withdraw, bkm.bkm_id "+
"   FROM dailyexpense_master em "+
"     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id "+
"     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 "+
"  and em_date in (select date_actual from time_dimension where date_actual between $40 and $41) and bkm_id = $42) as deb "+
"  order by deb.date desc"; 

    const query = client.query(querystr,[id,req.body.fin_prev_year,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id]);
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

router.post('/bank/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(bkm.bkm_id) as total "+
                    "FROM bank_master bkm "+
                    "LEFT OUTER JOIN company_master com on bkm.bkm_com_id = com.com_id "+
                    "where bkm.bkm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(bkm_name||''||bkm_account_no) LIKE LOWER($2);";

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

router.post('/bank/limit', oauth.authorise(), (req, res, next) => {
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

    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM bank_master bkm "+
                    "LEFT OUTER JOIN company_master com on bkm.bkm_com_id = com.com_id "+
                    "where bkm.bkm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(bkm_name||''||bkm_account_no ) LIKE LOWER($2) "+
                    "order by bkm.bkm_id desc LIMIT $3 OFFSET $4";

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

    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM bank_master bkm "+
                    "LEFT OUTER JOIN company_master com on bkm.bkm_com_id = com.com_id "+
                    "where bkm.bkm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(bkm_name||''||bkm_account_no ) LIKE LOWER($2) "+
                    "order by bkm.bkm_id desc LIMIT 16";

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
