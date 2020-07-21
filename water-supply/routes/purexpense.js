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
                    "from purexpense_master em "+
                    "LEFT OUTER JOIN vendor_master vm on em.em_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and em.pem_id=$1 ";
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
      var singleInsert = 'INSERT INTO purexpense_master(em_vm_id, em_date, em_received_by, em_comment, em_payment_mode, em_amount, em_cheque_no, em_cheque_date, em_com_id, em_bkm_id, em_transaction_no, em_transaction_date, em_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,0) RETURNING *',
          params = [req.body.em_vm_id.vm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_com_id,req.body.em_bkm_id.bkm_id,req.body.em_transaction_no,req.body.em_transaction_date]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows


          const strqry =  "SELECT * "+
                          "FROM purchase_master prm "+
                          "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                          "where prm.prm_status = 0 "+
                          "and prm.prm_balance_amount > 0 "+
                          "and vm.vm_id =$1 "+
                          "order by prm_id asc";
          const query = client.query(strqry,[expenseSingleData.em_vm_id.vm_id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
              if(deamount >= product.prm_balance_amount){
                client.query('update purchase_master set prm_balance_amount=0 where prm_id=$1',[product.prm_id]);
                deamount = deamount - product.prm_balance_amount;
                client.query('insert into expense_purchase_master (epm_pem_id, epm_prm_id, epm_amount) values ($1,$2,$3)',[result.rows[0].pem_id,product.prm_id,product.prm_balance_amount]);
              }
              else{
                client.query('update purchase_master set prm_balance_amount=prm_balance_amount-$1 where prm_id=$2',[deamount,product.prm_id]);
                deamount=0; 
                client.query('insert into expense_purchase_master (epm_pem_id, epm_prm_id, epm_amount) values ($1,$2,$3)',[result.rows[0].pem_id,product.prm_id,deamount]);
              }
            });
            client.query('COMMIT;');
            done();
            return res.json(results);
          });
      });
    }
    else{
      
      var singleInsert = 'INSERT INTO purexpense_master(em_vm_id, em_date, em_received_by, em_comment, em_payment_mode, em_amount, em_cheque_no, em_cheque_date, em_com_id, em_transaction_no, em_transaction_date, em_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0) RETURNING *',
          params = [req.body.em_vm_id.vm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_com_id,req.body.em_transaction_no,req.body.em_transaction_date]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

          const strqry =  "SELECT * "+
                          "FROM purchase_master prm "+
                          "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                          "where prm.prm_status = 0 "+
                          "and prm.prm_balance_amount > 0 "+
                          "and vm.vm_id =$1 "+
                          "order by prm_id asc";
          const query = client.query(strqry,[expenseSingleData.em_vm_id.vm_id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
              if(deamount >= product.prm_balance_amount){
                client.query('update purchase_master set prm_balance_amount=0 where prm_id=$1',[product.prm_id]);
                deamount = deamount - product.prm_balance_amount;
                client.query('insert into expense_purchase_master (epm_pem_id, epm_prm_id, epm_amount) values ($1,$2,$3)',[result.rows[0].pem_id,product.prm_id,product.prm_balance_amount]);
              }
              else{
                client.query('update purchase_master set prm_balance_amount=prm_balance_amount-$1 where prm_id=$2',[deamount,product.prm_id]);
                deamount=0;
                client.query('insert into expense_purchase_master (epm_pem_id, epm_prm_id, epm_amount) values ($1,$2,$3)',[result.rows[0].pem_id,product.prm_id,deamount]);
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
      var singleInsert = 'update purexpense_master set em_vm_id=$1, em_date=$2, em_received_by=$3, em_comment=$4, em_payment_mode=$5, em_amount=$6, em_cheque_no=$7, em_cheque_date=$8, em_bkm_id=$9, em_transaction_no=$10, em_transaction_date=$11, em_updated_at=now() where pem_id=$12  RETURNING *',
          params = [req.body.em_vm.vm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_bkm.bkm_id,req.body.em_transaction_no,req.body.em_transaction_date,id]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

        

          const strqry =  "SELECT * "+
                          "FROM expense_purchase_master epm "+
                          "INNER JOIN purexpense_master em on epm.epm_pem_id = em.pem_id "+
                          "INNER JOIN purchase_master prm on epm.epm_prm_id = prm.prm_id "+
                          "and em.pem_id =$1 "+
                          "order by epm_id asc";
          const query = client.query(strqry,[id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
                client.query('update purchase_master set prm_balance_amount=prm_balance_amount +$1 where prm_id=$2',[product.epm_amount,product.prm_id]);
                client.query('delete from expense_purchase_master where epm_id = $1',[product.epm_id]);
            });

            const strqry1 = "SELECT * "+
                          "FROM purchase_master prm "+
                          "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                          "where prm.prm_status = 0 "+
                          "and prm.prm_balance_amount > 0 "+
                          "and vm.vm_id =$1 "+
                          "order by prm_id asc";
            const query1 = client.query(strqry1,[expenseSingleData.em_vm.vm_id]);
            query1.on('row', (row) => {
              records1.push(row);
            });
            query1.on('end', () => {

              records1.forEach(function(product, index) {
                if(deamount >= product.prm_balance_amount){
                  client.query('update purchase_master set prm_balance_amount=0 where prm_id=$1',[product.prm_id]);
                  deamount = deamount - product.prm_balance_amount;
                  client.query('insert into expense_purchase_master (epm_pem_id, epm_prm_id, epm_amount) values ($1,$2,$3)',[id,product.prm_id,product.prm_balance_amount]);
                }
                else{
                  client.query('update purchase_master set prm_balance_amount=prm_balance_amount-$1 where prm_id=$2',[deamount,product.prm_id]);
                  deamount = 0;
                  client.query('insert into expense_purchase_master (epm_pem_id, epm_prm_id, epm_amount) values ($1,$2,$3)',[id,product.prm_id,deamount]);
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
      
      var singleInsert = 'update purexpense_master set em_vm_id=$1, em_date=$2, em_received_by=$3, em_comment=$4, em_payment_mode=$5, em_amount=$6, em_cheque_no=$7, em_cheque_date=$8, em_transaction_no=$9, em_transaction_date=$10, em_updated_at=now() where pem_id=$11  RETURNING *',
          params = [req.body.em_vm.vm_id,req.body.em_date,req.body.em_received_by,req.body.em_comment,req.body.em_payment_mode,req.body.em_amount,req.body.em_cheque_no,req.body.em_cheque_date,req.body.em_transaction_no,req.body.em_transaction_date,id]
     client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

          const strqry =  "SELECT * "+
                          "FROM expense_purchase_master epm "+
                          "INNER JOIN purexpense_master em on epm.epm_pem_id = em.pem_id "+
                          "INNER JOIN purchase_master prm on epm.epm_prm_id = prm.prm_id "+
                          "and em.pem_id =$1 "+
                          "order by epm_id asc";
          const query = client.query(strqry,[id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
                client.query('update purchase_master set prm_balance_amount=prm_balance_amount +$1 where prm_id=$2',[product.epm_amount,product.prm_id]);
                client.query('delete from expense_purchase_master where epm_id = $1',[product.epm_id]);
            });

            const strqry1 = "SELECT * "+
                          "FROM purchase_master prm "+
                          "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                          "where prm.prm_status = 0 "+
                          "and prm.prm_balance_amount > 0 "+
                          "and vm.vm_id =$1 "+
                          "order by prm_id asc";
            const query1 = client.query(strqry1,[expenseSingleData.em_vm.vm_id]);
            query1.on('row', (row) => {
              records1.push(row);
            });
            query1.on('end', () => {

              records1.forEach(function(product, index) {
                if(deamount >= product.prm_balance_amount){
                  client.query('update purchase_master set prm_balance_amount=0 where prm_id=$1',[product.prm_id]);
                  deamount = deamount - product.prm_balance_amount;
                  client.query('insert into expense_purchase_master (epm_pem_id, epm_prm_id, epm_amount) values ($1,$2,$3)',[id,product.prm_id,product.prm_balance_amount]);
                }
                else{
                  client.query('update purchase_master set prm_balance_amount=prm_balance_amount-$1 where prm_id=$2',[deamount,product.prm_id]);
                  deamount = 0;
                  client.query('insert into expense_purchase_master (epm_pem_id, epm_prm_id, epm_amount) values ($1,$2,$3)',[id,product.prm_id,deamount]);
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
      var singleInsert = 'update purexpense_master set em_status=1, em_updated_at=now() where pem_id=$1 RETURNING *',
          params = [id]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows


          const strqry =  "SELECT * "+
                          "FROM expense_purchase_master epm "+
                          "INNER JOIN purexpense_master em on epm.epm_pem_id = em.pem_id "+
                          "INNER JOIN purchase_master prm on epm.epm_prm_id = prm.prm_id "+
                          "and em.pem_id =$1 "+
                          "order by epm_id asc";
          const query = client.query(strqry,[id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
              
                client.query('update purchase_master set prm_balance_amount=prm_balance_amount+$1 where prm_id=$2',[product.epm_amount,product.prm_id]);
                client.query('delete from expense_purchase_master where epm_id=$1',[product.epm_id]);
              
            });
            client.query('COMMIT;');
            done();
            return res.json(results);
          });
      });
    }
    else{
      
      var singleInsert = 'update purexpense_master set em_status=1, em_updated_at=now() where pem_id=$1 RETURNING *',
          params = [id]
      client.query(singleInsert, params, function (error, result) {
          results.push(result.rows[0]); // Will contain your inserted rows

          const strqry =  "SELECT * "+
                          "FROM expense_purchase_master epm "+
                          "INNER JOIN purexpense_master em on epm.epm_pem_id = em.pem_id "+
                          "INNER JOIN purchase_master prm on epm.epm_prm_id = prm.prm_id "+
                          "and em.pem_id =$1 "+
                          "order by epm_id asc";
          const query = client.query(strqry,[id]);
          query.on('row', (row) => {
            records.push(row);
          });
          query.on('end', () => {

            records.forEach(function(product, index) {
                client.query('update purchase_master set prm_balance_amount=prm_balance_amount+$1 where prm_id=$2',[product.epm_amount,product.prm_id]);
                client.query('delete from expense_purchase_master where epm_id=$1',[product.epm_id]);
              
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



router.post('/purexpense/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";
                    

    const strqry =  "SELECT count(pem_id) as total "+
                    "from purexpense_master em "+
                    "LEFT OUTER JOIN vendor_master vm on em.em_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) "+
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

router.post('/purexpense/limit', oauth.authorise(), (req, res, next) => {
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
                    "from purexpense_master em "+
                    "LEFT OUTER JOIN vendor_master vm on em.em_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 "+
                    "order by em.pem_id desc LIMIT $5 OFFSET $6";

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
                    
