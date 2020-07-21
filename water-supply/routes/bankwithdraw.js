var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:bankwithdrawId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.bankwithdrawId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM bankwithdraw_master bwm "+
                    "LEFT OUTER JOIN bank_master bkm on bwm.bwm_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on bwm.bwm_com_id = com.com_id "+
                    "where bwm.bwm_status=0 "+
                    "and com.com_status=0 "+
                    "and bwm.bwm_id=$1";

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

    var singleInsert = 'INSERT INTO bankwithdraw_master(bwm_amount, bwm_bkm_id, bwm_com_id, bwm_date, bwm_status) values($1,$2,$3,$4,0) RETURNING *',
        params = [req.body.bwm_amount,req.body.bwm_bkm_id.bkm_id,req.body.bwm_com_id,req.body.bwm_date]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows

        client.query('COMMIT;');
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/edit/:bankwithdrawId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.bankwithdrawId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var singleInsert = 'UPDATE bankwithdraw_master SET bwm_amount=$1, bwm_bkm_id=$2, bwm_date=$3, bwm_updated_at=now() where bwm_id=$4 RETURNING *',
        params = [req.body.bwm_amount,req.body.bwm_bkm.bkm_id,req.body.bwm_date,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows

        client.query('COMMIT;');
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/delete/:bankwithdrawId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.bankwithdrawId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'update bankwithdraw_master set bwm_status=1, bwm_updated_at=now() where bwm_id=$1 RETURNING *',
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

router.post('/bankwithdraw/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(bwm.bwm_id) as total "+
                    "FROM bankwithdraw_master bwm "+
                    "LEFT OUTER JOIN bank_master bkm on bwm.bwm_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on bwm.bwm_com_id = com.com_id "+
                    "where bwm.bwm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(bkm_name ) LIKE LOWER($2) "+
                    "and bwm.bwm_date between $3 and $4 ";

    const query = client.query(strqry,[req.body.com_id, str, req.body.from, req.body.to]);
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

router.post('/bankwithdraw/limit', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM bankwithdraw_master bwm "+
                    "LEFT OUTER JOIN bank_master bkm on bwm.bwm_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on bwm.bwm_com_id = com.com_id "+
                    "where bwm.bwm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(bkm_name ) LIKE LOWER($2) "+
                    "and bwm.bwm_date between $3 and $4 "+
                    "order by bwm.bwm_id desc LIMIT $5 OFFSET $6";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.com_id, str, req.body.from, req.body.to, req.body.number, req.body.begin]);
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
