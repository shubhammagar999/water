var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:purchasereturnId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.purchasereturnId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * "+
                "FROM purchasereturn_master prrm "+
                "LEFT OUTER JOIN purchase_master prm on prrm.prrm_prm_id=prm.prm_id "+
                "LEFT OUTER JOIN vendor_master vm on prrm.prrm_vm_id = vm.vm_id "+
                "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                "where com.com_status=0 "+
                "and prrm.prrm_id=$1";

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

router.get('/details/:purchasereturnId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.purchasereturnId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query("SELECT *, pm_name || ' ('|| um_name ||')' as pm_search "+
                               "FROM purchasereturn_product_master prpm "+
                               "LEFT OUTER JOIN purchasereturn_master prrm on prpm.prpm_prrm_id = prrm.prrm_id "+
                               "LEFT OUTER JOIN purchase_product_master ppm on prpm.prpm_ppm_id= ppm.ppm_id "+
                               "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id= pm.pm_id "+
                               "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id where prpm.prpm_prrm_id=$1",[id]);
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
  const purchaseSingleData = req.body.purchaseSingleData;
  const purchaseMultipleData = req.body.purchaseMultipleData;
  
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');
     
    
    var singleInsert = 'INSERT INTO purchasereturn_master(prrm_serial_no, prrm_date, prrm_vm_id, prrm_amount, prrm_prm_id, prrm_comment, prrm_cgst, prrm_sgst, prrm_igst, prrm_discount, prrm_com_id, prrm_net_amount, prrm_status) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 0) RETURNING *',
            params = [purchaseSingleData.prrm_serial_no,purchaseSingleData.prrm_date,purchaseSingleData.prm_invoice_no.vm_id,purchaseSingleData.prrm_amount, purchaseSingleData.prm_invoice_no.prm_id,purchaseSingleData.prrm_comment,purchaseSingleData.cgst,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.discount,purchaseSingleData.prrm_com_id,purchaseSingleData.amount]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows

        purchaseMultipleData.forEach(function(product, index) {

          const va = client.query('INSERT INTO public.purchasereturn_product_master(prpm_prrm_id, prpm_ppm_id, prpm_quantity, prpm_rate, prpm_discount, prpm_cgst, prpm_sgst, prpm_igst, prpm_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[result.rows[0].prrm_id,product.ppm_id,product.ppm_quantity,product.ppm_purchase_rate,product.ppm_discount,product.ppm_cgst,product.ppm_sgst,product.ppm_igst,product.netamt]);
          
        });

        client.query('COMMIT;');
        done();
        return res.json(results);
    });

    done(err);
  });

});

router.post('/edit/:purchasereturnId', oauth.authorise(), (req, res, next) => {
  const id = req.params.purchasereturnId;
  const results = [];
  const purchaseSingleData = req.body.purchaseSingleData;
  const purchaseMultipleData = req.body.purchaseMultipleData;
  const purchaseadd = req.body.purchaseadd;
  const purchaseremove = req.body.purchaseremove;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');
    

    var singleInsert = 'update purchasereturn_master set prrm_date=$1, prrm_amount=$2, prrm_comment=$3, prrm_cgst=$4, prrm_sgst=$5, prrm_igst=$6, prrm_discount=$7, prrm_net_amount=$8, prrm_updated_at=now() where prrm_id=$9 RETURNING *',
            params = [purchaseSingleData.prrm_date,purchaseSingleData.prrm_amount,purchaseSingleData.prrm_comment,purchaseSingleData.cgst,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.discount,purchaseSingleData.amount,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows



        purchaseremove.forEach(function(product, index) {

          client.query('delete from public.purchasereturn_product_master where prpm_id=$1',[product.prpm_id]);

        });

        purchaseMultipleData.forEach(function(product, index) {
          const va = client.query('update public.purchasereturn_product_master set prpm_quantity=$1 where prpm_id=$2 ',[product.prpm_quantity,product.prpm_id]);
        });

        client.query('COMMIT;');
        done();
        return res.json(results);
    });

    done(err);
  });

});

router.post('/delete/:purchasereturnId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.purchasereturnId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    
    var singleInsert = 'update purchasereturn_master set prrm_status=1, prrm_updated_at=now() where prrm_id=$1 RETURNING *',
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

router.post('/invoice/no', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    
    const query = client.query("SELECT * from purchasereturn_master where prrm_serial_no LIKE ($1) and prrm_com_id=$2 order by prrm_id desc limit 1;",[req.body.fin_year,req.body.com_id]);
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

router.post('/purchasereturn/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(prrm.prrm_id) as total "+
                    "FROM purchasereturn_master prrm "+
                    "LEFT OUTER JOIN purchase_master prm on prrm.prrm_prm_id=prm.prm_id "+
                    "LEFT OUTER JOIN vendor_master vm on prrm.prrm_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(prrm_serial_no||''||prm_invoice_no||''||vm_firm_name ) LIKE LOWER($2) "+
                    "and prrm.prrm_date between $3 and $4 ";

    const query = client.query(strqry,[req.body.com_id,str, req.body.from, req.body.to]);
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

router.post('/purchasereturn/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM purchasereturn_master prrm "+
                    "LEFT OUTER JOIN purchase_master prm on prrm.prrm_prm_id=prm.prm_id "+
                    "LEFT OUTER JOIN vendor_master vm on prrm.prrm_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(prrm_serial_no||''||prm_invoice_no||''||vm_firm_name ) LIKE LOWER($2) "+
                    "and prrm.prrm_date between $3 and $4 "+
                    "order by prrm.prrm_id desc LIMIT $5 OFFSET $6";

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
