var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:emId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.emId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, bkm_name||'-'||bkm_account_no as bkm_search "+
                    "FROM dailyexpense_master em "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN expense_type_master etm on em.em_etm_id = etm.etm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status = 0 "+
                    "and com.com_status=0 "+
                    "and em.dem_id=$1";

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
  const expenseSingleData = req.body;
  // const expenseSingleData = req.body.expense;
  // const expenseMultipleData = req.body.expenseMultipleData;
  // const expenseMultipleDataSale = req.body.expenseMultipleDataSale;

  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    if(req.body.em_payment_mode != "Cash"){
      var singleInsert = 'INSERT INTO dailyexpense_master(em_etm_id, em_date, em_received_by, em_comment, em_payment_mode, em_amount, em_cheque_no, em_cheque_date, em_com_id, em_bkm_id, em_transaction_no, em_transaction_date, em_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,0) RETURNING *',
          params = [req.body.em_etm_id.etm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_com_id,req.body.em_bkm_id.bkm_id,req.body.em_transaction_no,req.body.em_transaction_date]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

            client.query('COMMIT;');
            done();
            return res.json(results);
      });
    }
    else{
      
      var singleInsert = 'INSERT INTO dailyexpense_master(em_etm_id, em_date, em_received_by, em_comment, em_payment_mode, em_amount, em_cheque_no, em_cheque_date, em_com_id, em_transaction_no, em_transaction_date, em_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0) RETURNING *',
          params = [req.body.em_etm_id.etm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_com_id,req.body.em_transaction_no,req.body.em_transaction_date]
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

router.post('/edit/:emId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.emId;
  const expenseSingleData = req.body;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    if(req.body.em_payment_mode != "Cash"){
      var singleInsert = 'update dailyexpense_master set em_etm_id=$1, em_date=$2, em_comment=$3, em_payment_mode=$4, em_amount=$5, em_cheque_no=$6, em_cheque_date=$7, em_bkm_id=$8, em_transaction_no=$9, em_transaction_date=$10, em_updated_at=now() where dem_id=$11 RETURNING *',
          params = [req.body.em_etm.etm_id,req.body.em_date,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_bkm.bkm_id,req.body.em_transaction_no,req.body.em_transaction_date,id]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

            client.query('COMMIT;');
            done();
            return res.json(results);
      });
    }
    else{
      
      var singleInsert = 'update dailyexpense_master set em_etm_id=$1, em_date=$2, em_comment=$3, em_payment_mode=$4, em_amount=$5, em_cheque_no=$6, em_cheque_date=$7, em_transaction_no=$8, em_transaction_date=$9, em_updated_at=now() where dem_id=$10 RETURNING *',
          params = [req.body.em_etm.etm_id,req.body.em_date,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_transaction_no,req.body.em_transaction_date,id]
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

router.post('/delete/:emId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.emId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    if(req.body.em_payment_mode != "Cash"){
      var singleInsert = 'update dailyexpense_master set em_status=1, em_updated_at=now() where dem_id=$1 RETURNING *',
          params = [id]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

            client.query('COMMIT;');
            done();
            return res.json(results);
      });
    }
    else{
      
      var singleInsert = 'update dailyexpense_master set em_status=1, em_updated_at=now() where dem_id=$1 RETURNING *',
          params = [id]
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

router.post('/dailyexpense/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(em.dem_id) as total "+
                    "FROM dailyexpense_master em "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN expense_type_master etm on em.em_etm_id = etm.etm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(em_payment_mode ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 ";

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

router.post('/dailyexpense/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM dailyexpense_master em "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN expense_type_master etm on em.em_etm_id = etm.etm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(em_payment_mode ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 "+
                    "order by em.dem_id desc LIMIT $5 OFFSET $6";

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
