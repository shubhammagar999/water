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
    // SQL Query > Select Data

    const strqry =  "SELECT * "+
                    "from EXPENSE_MASTER em "+
                    "LEFT OUTER JOIN customer_master cm on em.em_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and em.em_id=$1 ";
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
  const records = [];
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
    client.query('BEGIN;');

    var deamount = expenseSingleData.em_amount;
    if(req.body.em_payment_mode != "Cash"){
      var singleInsert = 'INSERT INTO expense_master(em_cm_id, em_date, em_received_by, em_comment, em_payment_mode, em_amount, em_cheque_no, em_cheque_date, em_com_id, em_bkm_id, em_transaction_no, em_transaction_date, em_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,0) RETURNING *',
          params = [req.body.em_cm_id.cm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_com_id,req.body.em_bkm_id.bkm_id,req.body.em_transaction_no,req.body.em_transaction_date]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

          const strqry =  "SELECT * "+
                          "FROM sale_master sm "+
                          "where sm.sm_status = 0 "+
                          "and sm.sm_balance_amt > 0 "+
                          "and sm.sm_cm_id =$1 "+
                          "order by sm_id asc";
          const query = client.query(strqry,[expenseSingleData.em_cm_id.cm_id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
              if(deamount >= product.sm_balance_amt){
                client.query('update sale_master set sm_balance_amt=0 where sm_id=$1',[product.sm_id]);
                deamount = deamount - product.sm_balance_amt;
                client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[result.rows[0].em_id,product.sm_id,product.sm_balance_amt]);
              }
              else{
                client.query('update sale_master set sm_balance_amt=sm_balance_amt-$1 where sm_id=$2',[deamount,product.sm_id]);
                client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[result.rows[0].em_id,product.sm_id,deamount]);
               deamount = 0;
               
              }
            });
            client.query('COMMIT;');
            done();
            return res.json(results);
          });
      });
    }
    else{
      
      var singleInsert = 'INSERT INTO expense_master(em_cm_id, em_date, em_received_by, em_comment, em_payment_mode, em_amount, em_cheque_no, em_cheque_date, em_com_id, em_transaction_no, em_transaction_date, em_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0) RETURNING *',
          params = [req.body.em_cm_id.cm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_com_id,req.body.em_transaction_no,req.body.em_transaction_date]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

          const strqry =  "SELECT * "+
                          "FROM sale_master sm "+
                          "where sm.sm_status = 0 "+
                          "and sm.sm_balance_amt > 0 "+
                          "and sm.sm_cm_id =$1 "+
                          "order by sm_id asc";
          const query = client.query(strqry,[expenseSingleData.em_cm_id.cm_id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {
            records.forEach(function(product, index) {
              if(deamount >= product.sm_balance_amt){
                client.query('update sale_master set sm_balance_amt=0 where sm_id=$1',[product.sm_id]);
                deamount = deamount - product.sm_balance_amt;
                client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[result.rows[0].em_id,product.sm_id,product.sm_balance_amt]);
              }
              else{
                client.query('update sale_master set sm_balance_amt=sm_balance_amt-$1 where sm_id=$2',[deamount,product.sm_id]);
                 client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[result.rows[0].em_id,product.sm_id,deamount]);
                 deamount = 0;
               
              }
            });
            client.query('COMMIT;');
            done();
            return res.json(results);
          });
      });
    }

    done(err);
  });
});


router.post('/edit/:emId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const records = [];
  const records1 = [];
  const id = req.params.emId;
  const expenseSingleData = req.body;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var deamount = expenseSingleData.em_amount;

    if(req.body.em_payment_mode != "Cash"){
      var singleInsert = 'update expense_master set em_cm_id=$1, em_date=$2, em_received_by=$3, em_comment=$4, em_payment_mode=$5, em_amount=$6, em_cheque_no=$7, em_cheque_date=$8, em_bkm_id=$9, em_transaction_no=$10, em_transaction_date=$11, em_updated_at=now() where em_id=$12  RETURNING *',
          params = [req.body.em_cm.cm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_bkm.bkm_id,req.body.em_transaction_no,req.body.em_transaction_date,id]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

          const strqry =  "SELECT * "+
                          "FROM expense_sale_master esm "+
                          "INNER JOIN expense_master em on esm.esm_em_id = em.em_id "+
                          "INNER JOIN sale_master sm on esm.esm_sm_id = sm.sm_id "+
                          "and em.em_id =$1 "+
                          "order by esm_id asc";
          const query = client.query(strqry,[id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
                client.query('update sale_master set sm_balance_amt=sm_balance_amt +$1 where sm_id=$2',[product.esm_amount,product.sm_id]);
                client.query('delete from expense_sale_master where esm_id = $1',[product.esm_id]);
            });

            const strqry1 =  "SELECT * "+
                            "FROM sale_master sm "+
                            "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                            "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id = emp.emp_id "+
                            "where sm.sm_status = 0 "+
                            "and sm.sm_balance_amt > 0 "+
                            "and cm.cm_id =$1 "+
                            "order by sm_id asc";
            const query1 = client.query(strqry1,[expenseSingleData.em_cm.cm_id]);
            query1.on('row', (row) => {
              records1.push(row);
            });
            query1.on('end', () => {

              records1.forEach(function(product, index) {
                if(deamount >= product.sm_balance_amt){
                  client.query('update sale_master set sm_balance_amt=0 where sm_id=$1',[product.sm_id]);
                  deamount = deamount - product.sm_balance_amt;
                  client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[id,product.sm_id,product.sm_balance_amt]);
                }
                else{
                  client.query('update sale_master set sm_balance_amt=sm_balance_amt-$1 where sm_id=$2',[deamount,product.sm_id]);
                  client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[id,product.sm_id,deamount]);
                  deamount = 0;
                }
              });
              client.query('COMMIT;');
              done();
              return res.json(results);
            });

          });

          
      });
    }
    else{
      
      var singleInsert = 'update expense_master set em_cm_id=$1, em_date=$2, em_comment=$3, em_payment_mode=$4, em_amount=$5, em_cheque_no=$6, em_cheque_date=$7, em_transaction_no=$8, em_transaction_date=$9, em_updated_at=now() where em_id=$10  RETURNING *',
          params = [req.body.em_cm.cm_id,req.body.em_date,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_transaction_no,req.body.em_transaction_date,id]
     client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

          const strqry =  "SELECT * "+
                          "FROM expense_sale_master esm "+
                          "INNER JOIN expense_master em on esm.esm_em_id = em.em_id "+
                          "INNER JOIN sale_master sm on esm.esm_sm_id = sm.sm_id "+
                          "and em.em_id =$1 "+
                          "order by esm_id asc";
          const query = client.query(strqry,[id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
                client.query('update sale_master set sm_balance_amt=sm_balance_amt +$1 where sm_id=$2',[product.esm_amount,product.sm_id]);
                client.query('delete from expense_sale_master where esm_id = $1',[product.esm_id]);
            });

            const strqry1 =  "SELECT * "+
                            "FROM sale_master sm "+
                            "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                            "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id = emp.emp_id "+
                            "where sm.sm_status = 0 "+
                            "and sm.sm_balance_amt > 0 "+
                            "and cm.cm_id =$1 "+
                            "order by sm_id asc";
            const query1 = client.query(strqry1,[expenseSingleData.em_cm.cm_id]);
            query1.on('row', (row) => {
              records1.push(row);
            });
            query1.on('end', () => {

              records1.forEach(function(product, index) {
                if(deamount >= product.sm_balance_amt){
                  client.query('update sale_master set sm_balance_amt=0 where sm_id=$1',[product.sm_id]);
                  deamount = deamount - product.sm_balance_amt;
                  client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[id,product.sm_id,product.sm_balance_amt]);
                }
                else{
                  client.query('update sale_master set sm_balance_amt=sm_balance_amt-$1 where sm_id=$2',[deamount,product.sm_id]);
                  client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[id,product.sm_id,deamount]);
                  deamount = 0;
                }
              });
              client.query('COMMIT;');
              done();
              return res.json(results);
            });

          });

          
      });
    }

    done(err);
  });
});

router.post('/delete/:emId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const records = [];
  const id = req.params.emId;
  const expenseSingleData = req.body;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    if(req.body.em_payment_mode != "Cash"){
      var singleInsert = 'update expense_master set em_status=1, em_updated_at=now() where em_id=$1 RETURNING *',
          params = [id]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows


           const strqry =  "SELECT * "+
                          "FROM expense_sale_master esm "+
                          "INNER JOIN expense_master em on esm.esm_em_id = em.em_id "+
                          "INNER JOIN sale_master sm on esm.esm_sm_id = sm.sm_id "+
                          "and em.em_id =$1 "+
                          "order by esm_id asc";
          const query = client.query(strqry,[id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
                client.query('update sale_master set sm_balance_amt = sm_balance_amt + $1 where sm_id=$2',[product.esm_amount,product.esm_sm_id]);
                client.query('delete from expense_sale_master where esm_id = $1',[product.esm_id]);
            });

            client.query('COMMIT;');
            done();
            return res.json(results);
          });
      });
    }
    else{
      
      var singleInsert = 'update expense_master set em_status=1, em_updated_at=now() where em_id=$1 RETURNING *',
          params = [id]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

           const strqry =  "SELECT * "+
                          "FROM expense_sale_master esm "+
                          "INNER JOIN expense_master em on esm.esm_em_id = em.em_id "+
                          "INNER JOIN sale_master sm on esm.esm_sm_id = sm.sm_id "+
                          "and em.em_id =$1 "+
                          "order by esm_id asc";
          const query = client.query(strqry,[id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {


            records.forEach(function(product, index) {
                client.query('update sale_master set sm_balance_amt=sm_balance_amt +$1 where sm_id=$2',[product.esm_amount,product.esm_sm_id]);
                client.query('delete from expense_sale_master where esm_id = $1',[product.esm_id]);
            });
            client.query('COMMIT;');
            done();
            return res.json(results);
          });
      });
    }
    
    done(err);
  });
});



router.post('/expense/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";
                    

    const strqry =  "SELECT count(em_id) as total "+
                    "from EXPENSE_MASTER em "+
                    "LEFT OUTER JOIN customer_master cm on em.em_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(cm_name||''||cm_address||''||cm_mobile ) LIKE LOWER($2) "+
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

router.post('/expense/limit', oauth.authorise(), (req, res, next) => {
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

    const strqry =  "SELECT * "+
                    "from EXPENSE_MASTER em "+
                    "LEFT OUTER JOIN customer_master cm on em.em_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(cm_name||''||cm_address||''||cm_mobile ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 "+
                    "order by em.em_id desc LIMIT $5 OFFSET $6";

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
                    
