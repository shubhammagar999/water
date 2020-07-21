var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:cashtransferId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.cashtransferId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM cashtransfer_master ctm "+
                    "LEFT OUTER JOIN bank_master bkm on ctm.ctm_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on ctm.ctm_com_id = com.com_id "+
                    "where ctm.ctm_status=0 "+
                    "and com.com_status=0 "+
                    "and ctm.ctm_id=$1";

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

    var singleInsert = 'INSERT INTO cashtransfer_master(ctm_amount, ctm_bkm_id, ctm_date, ctm_com_id, ctm_status) values($1,$2,$3,$4,0) RETURNING *',
        params = [req.body.ctm_amount,req.body.ctm_bkm_id.bkm_id,req.body.ctm_date,req.body.ctm_com_id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows

        client.query('COMMIT;');
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/edit/:cashtransferId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.cashtransferId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var singleInsert = 'UPDATE cashtransfer_master SET ctm_amount=$1, ctm_bkm_id=$2, ctm_date=$3, ctm_updated_at=now() where ctm_id=$4 RETURNING *',
        params = [req.body.ctm_amount,req.body.ctm_bkm.bkm_id,req.body.ctm_date,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        
        
        client.query('COMMIT;');
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/delete/:cashtransferId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.cashtransferId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'update cashtransfer_master set ctm_status=1, ctm_updated_at=now() where ctm_id=$1 RETURNING *',
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

router.post('/cashtransfer/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(ctm.ctm_id) as total "+
                    "FROM cashtransfer_master ctm "+
                    "LEFT OUTER JOIN bank_master bkm on ctm.ctm_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on ctm.ctm_com_id = com.com_id "+
                    "where ctm.ctm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(bkm_name ) LIKE LOWER($2) "+
                    "and ctm.ctm_date between $3 and $4 ";

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

router.post('/cashtransfer/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM cashtransfer_master ctm "+
                    "LEFT OUTER JOIN bank_master bkm on ctm.ctm_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on ctm.ctm_com_id = com.com_id "+
                    "where ctm.ctm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(bkm_name ) LIKE LOWER($2) "+
                    "and ctm.ctm_date between $3 and $4 "+
                    "order by ctm.ctm_id desc LIMIT $5 OFFSET $6";

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
