var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:cashId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.cashId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * "+
                    "from cash_master chm "+
                    "LEFT OUTER JOIN company_master com on chm.chm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and chm.chm_id=$1";

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
                    "from cash_master chm "+
                    "LEFT OUTER JOIN company_master com on chm.chm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and chm.chm_com_id=$1 ";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.chm_com_id]);
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

    var singleInsert = 'INSERT INTO cash_master(chm_amount, chm_opening_amount, chm_com_id) values($1,$2, $3) RETURNING *',
        params = [req.body.chm_amount,req.body.chm_amount,req.body.chm_com_id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/edit/:cashId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.cashId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var cash = req.body.chm_opening_amount - req.body.old_chm_opening_amount;

    var singleInsert = 'UPDATE cash_master SET chm_amount=chm_amount + $1, chm_opening_amount = $2, chm_updated_at = now() where chm_id=$3 RETURNING *',
        params = [cash,req.body.chm_opening_amount,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        client.query('COMMIT;');
        return res.json(results);
    });

    done(err);
  });
});

router.post('/cash/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    console.log(req.body.com_id);
    const strqry =  "SELECT count(com_id) as total "+
                    "from cash_in_hand "+
                    "where com_id=$1 ";

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

router.post('/cash/limit', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT * "+
                    "from cash_in_hand "+
                    "where com_id=$1 "+
                    "order by com_id desc LIMIT $2 OFFSET $3";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.com_id, req.body.number, req.body.begin]);
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
