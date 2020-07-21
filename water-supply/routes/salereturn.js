var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:srmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.srmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * "+
                    "FROM salereturn_master srm "+
                    "LEFT OUTER JOIN sale_master sm on srm.srm_sm_id = sm.sm_id "+
                    "LEFT OUTER JOIN customer_master cm on srm.srm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on srm.srm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and srm.srm_id=$1";

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

router.get('/details/:srmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.srmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    
    const strqry =  "SELECT *, pm_name || ' ('|| ppm_color_code ||')' as pm_search "+
                    "FROM salereturn_product_master spm "+
                    "LEFT OUTER JOIN salereturn_master srm on spm.srpm_srm_id = srm.srm_id "+
                    "inner JOIN purchase_product_master ppm on spm.srpm_ppm_id = ppm.ppm_id "+
                    "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "where spm.srpm_srm_id=$1";

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

// add this rote for unsorted list
router.get('/details/unsorted/:smId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.smId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, srpum_name || ' ('|| srpum_color_code ||')' as pm_search "+
                    "FROM salereturn_product_unsorted_master spm "+
                    "LEFT OUTER JOIN salereturn_master srm on spm.srpum_srm_id = srm.srm_id "+
                    "LEFT OUTER JOIN unit_master um on spm.srpum_um_id = um.um_id "+
                    "where spm.srpum_srm_id=$1";
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

router.get('/returndetails/:vmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.vmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query("SELECT * FROM salereturn_master srm LEFT OUTER JOIN sale_master sm on srm.srm_sm_id=sm.sm_id LEFT OUTER JOIN customer_master cm on srm.srm_cm_id = cm.cm_id LEFT OUTER JOIN employee_master emp on sm.sm_emp_id = emp.emp_id where srm.srm_status=0 and cm.cm_id=$1 order by srm.srm_id asc",[id]);
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
  const purchaseUnsortMultipleData = req.body.purchaseUnsortMultipleData;
  
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');
    

    var singleInsert = 'INSERT INTO public.salereturn_master( srm_invoice_no, srm_date, srm_cm_id, srm_amount, srm_sm_id, srm_comment, srm_cgst, srm_sgst, srm_igst, srm_discount, srm_emp_id, srm_com_id, srm_net_amount, srm_disc_per, srm_status)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 0) RETURNING *',
              params = [purchaseSingleData.srm_invoice_no,purchaseSingleData.srm_date,purchaseSingleData.srm_sm_id.cm_id,purchaseSingleData.srm_amount, purchaseSingleData.srm_sm_id.sm_id,purchaseSingleData.srm_comment,purchaseSingleData.cgst,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.discount,purchaseSingleData.srm_sm_id.emp_id,purchaseSingleData.srm_com_id,purchaseSingleData.amount,purchaseSingleData.disper]
      client.query(singleInsert, params, function (error, result) {
      results.push(result.rows[0]); // Will contain your inserted rows

      purchaseMultipleData.forEach(function(product, index) {

        client.query('INSERT INTO public.salereturn_product_master(srpm_srm_id, srpm_ppm_id, srpm_quantity, srpm_rate, srpm_cgst, srpm_sgst, srpm_igst, srpm_discount,srpm_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[result.rows[0].srm_id,product.ppm_id,product.spm_quantity,product.spm_rate,product.spm_cgst,product.spm_sgst,product.spm_igst,purchaseSingleData.disper,product.netamt]);
        
      });
      // purchaseUnsortMultipleData.forEach(function(product, index) {
      //       client.query('INSERT INTO public.salereturn_product_unsorted_master(srpum_srm_id, srpum_pm_id, srpum_quantity, srpum_rate, srpum_cgst, srpum_sgst, srpum_igst, srpum_discount,srpum_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[result.rows[0].srm_id,product.pm_id,product.btpm_product_quantity,product.ppm_product_mrp,product.pm_product_cgst,product.pm_product_sgst,product.pm_product_igst,purchaseSingleData.disper,product.netamt]);
      //     });
      purchaseUnsortMultipleData.forEach(function(product, index) {
            client.query('INSERT INTO public.salereturn_product_unsorted_master(srpum_srm_id, srpum_quantity, srpum_rate, srpum_cgst, srpum_sgst, srpum_igst, srpum_name, srpum_color_code, srpum_size, srpum_hsn, srpum_um_id, srpum_discount, srpum_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',[result.rows[0].srm_id,product.btpm_product_quantity,product.ppm_product_mrp,product.pm_product_cgst,product.pm_product_sgst,product.pm_product_igst,product.pm_product_name,product.pm_product_color_code,product.pm_product_size,product.pm_product_hsn,product.um_id,purchaseSingleData.disper,product.netamt]);
            
          });

      client.query('COMMIT;');
      done();
      return res.json(results);
    });
    done(err);
  });

});

router.post('/edit/:srmId', oauth.authorise(), (req, res, next) => {
  const id = req.params.srmId;
  const results = [];
  const purchaseSingleData = req.body.purchaseSingleData;
  const purchaseMultipleData = req.body.purchaseMultipleData;
  const purchaseadd = req.body.purchaseadd;
  const purchaseremove = req.body.purchaseremove;
  const newpurchaseremove = req.body.newpurchaseremove;

  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    if(purchaseSingleData.sm_payment_mode == 'credit')
    {
      client.query('update sale_master set sm_balance_amount=sm_balance_amount+$1 where sm_id=$2',[purchaseSingleData.old_srm_amount,purchaseSingleData.sm_id]);
      client.query('update sale_master set sm_balance_amount=sm_balance_amount-$1 where sm_id=$2',[purchaseSingleData.srm_amount,purchaseSingleData.sm_id]);
    }

    var singleInsert = 'UPDATE public.salereturn_master set srm_date=$1, srm_amount=$2, srm_comment=$3, srm_cgst=$4, srm_sgst=$5, srm_igst=$6, srm_discount=$7, srm_net_amount=$8, srm_disc_per=$9, srm_updated_at=now() where srm_id=$10 RETURNING *',
              params = [purchaseSingleData.srm_date,purchaseSingleData.srm_amount,purchaseSingleData.srm_comment,purchaseSingleData.cgst,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.discount,purchaseSingleData.amount,purchaseSingleData.disper,id]
      client.query(singleInsert, params, function (error, result) {
      results.push(result.rows[0]); // Will contain your inserted rows



      purchaseremove.forEach(function(product, index) {
        client.query('delete from public.salereturn_product_master where srpm_id=$1',[product.srpm_id]);
      });
      newpurchaseremove.forEach(function(product, index) {
        client.query('delete from public.salereturn_product_unsorted_master where srpum_id=$1',[product.srpum_id]);
      });

      purchaseMultipleData.forEach(function(product, index) {
        const va = client.query('update public.salereturn_product_master set srpm_quantity=$1, srpm_netamt=$2 where srpm_id=$3 ',[product.srpm_quantity,product.netamt,product.srpm_id]);
      });

      client.query('COMMIT;');
      done();
      return res.json(results);
    });
  });

});

router.post('/delete/:srmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.srmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');


    if(req.body.sm_payment_mode == 'credit')
    {
      client.query('update sale_master set sm_balance_amount=sm_balance_amount+$1 where sm_id=$2',[req.body.srm_amount,req.body.sm_id]);
    }

    var singleInsert = 'UPDATE salereturn_master SET srm_status=1, srm_updated_at=now() WHERE srm_id=($1) RETURNING *',
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

router.post('/serial/no', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query("SELECT * from salereturn_master where srm_invoice_no LIKE ($1) and srm_com_id=$2 order by srm_id desc limit 1;",[req.body.fin_year,req.body.com_id]);
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

router.post('/salereturn/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(srm.srm_id) as total "+
                    "FROM salereturn_master srm "+
                    "LEFT OUTER JOIN sale_master sm on srm.srm_sm_id = sm.sm_id "+
                    "LEFT OUTER JOIN customer_master cm on srm.srm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on srm.srm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on srm.srm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(srm_invoice_no||''||sm_invoice_no||''||cm_name ) LIKE LOWER($2)"+
                    "and srm.srm_date between $3 and $4 ";

    const query = client.query(strqry,[req.body.com_id,str,req.body.from, req.body.to,]);
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

router.post('/salereturn/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM salereturn_master srm "+
                    "LEFT OUTER JOIN sale_master sm on srm.srm_sm_id = sm.sm_id "+
                    "LEFT OUTER JOIN customer_master cm on srm.srm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on srm.srm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on srm.srm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(srm_invoice_no||''||sm_invoice_no||''||cm_name ) LIKE LOWER($2)"+
                    "and srm.srm_date between $3 and $4 "+
                    "order by srm.srm_id desc LIMIT $5 OFFSET $6";

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
