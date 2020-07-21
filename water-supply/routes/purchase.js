var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:purchaseId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.purchaseId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * "+
                    "FROM purchase_master prm "+
                    "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and prm.prm_id=$1";

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

router.get('/details/:purchaseId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.purchaseId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, ppm_code  as ppm_search "+
                    "FROM purchase_product_master ppm "+
                    "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "LEFT OUTER JOIN purchase_master prm on ppm.ppm_prm_id = prm.prm_id "+
                    "where ppm.ppm_prm_id=$1";
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
  const purchaseSingleData = req.body.purchaseSingleData;
  const purchaseMultipleData = req.body.purchaseMultipleData;
console.log(req.body.purchaseMultipleData);
  
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');
    
      if(purchaseSingleData.prm_credit == "credit")
      {

        var singleInsert = 'INSERT INTO purchase_master(prm_invoice_no, prm_date, prm_vm_id, prm_amount, prm_credit, prm_payment_date, prm_inward_no, prm_cgst, prm_comment, prm_sgst, prm_igst, prm_discount, prm_com_id, prm_balance_amount, prm_net_amount, prm_status) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 0) RETURNING *',
            params = [purchaseSingleData.prm_invoice_no,purchaseSingleData.prm_date,purchaseSingleData.prm_vm_id.vm_id,purchaseSingleData.prm_amount,purchaseSingleData.prm_credit,purchaseSingleData.prm_payment_date,purchaseSingleData.prm_inward_no,purchaseSingleData.prm_cgst,purchaseSingleData.prm_comment,purchaseSingleData.prm_sgst,purchaseSingleData.prm_igst,purchaseSingleData.prm_discount,purchaseSingleData.prm_com_id,purchaseSingleData.prm_amount,purchaseSingleData.prm_discounted]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows

            purchaseMultipleData.forEach(function(product, index) {

            //   const va = client.query('INSERT INTO public.purchase_product_master(ppm_prm_id, ppm_quantity, ppm_purchase_rate, ppm_cgst, ppm_hrn, ppm_sgst, ppm_igst, ppm_netamt, ppm_discount, ppm_selling_price, ppm_code)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',[result.rows[0].prm_id,product.pm_id,product.ppm_quantity,product.btpm_price,product.pm_cgst,product.pm_hsn,product.pm_sgst,product.pm_igst,product.netamt,product.pm_discount,product.btpm_sell_price]);
            //   // client.query('UPDATE product_master set pm_price = $1, pm_sale_price=$2 where pm_id = $3',[product.btpm_price,product.btpm_sell_price,product.pm_id]);
            // });
            const va = client.query('INSERT INTO purchase_product_master(ppm_prm_id, ppm_pm_id, ppm_quantity, ppm_purchase_rate, ppm_selling_price, ppm_cgst, ppm_sgst, ppm_igst, ppm_discount, ppm_code, ppm_color_code, ppm_netamt, ppm_size, ppm_color) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',[result.rows[0].prm_id,product.pm_id,product.ppm_quantity,product.ppm_purchase_rate,product.ppm_mrp,product.ppm_cgst,product.ppm_sgst,product.ppm_igst,purchaseSingleData.discountper,product.ppm_code,product.ppm_color_code,product.netamt,product.ppm_size,product.ppm_color]);
            });

            client.query('COMMIT;');
            done();
            return res.json(results);
        });

    }
    else
    {

        var singleInsert = 'INSERT INTO purchase_master(prm_invoice_no, prm_date, prm_vm_id, prm_amount, prm_credit, prm_inward_no, prm_cgst, prm_comment, prm_sgst, prm_igst, prm_discount, prm_com_id, prm_net_amount, prm_status, prm_balance_amount) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0, 0) RETURNING *',
            params = [purchaseSingleData.prm_invoice_no,purchaseSingleData.prm_date,purchaseSingleData.prm_vm_id.vm_id,purchaseSingleData.prm_amount,purchaseSingleData.prm_credit,purchaseSingleData.prm_inward_no,purchaseSingleData.prm_cgst,purchaseSingleData.prm_comment,purchaseSingleData.prm_sgst,purchaseSingleData.prm_igst,purchaseSingleData.prm_discount,purchaseSingleData.prm_com_id,purchaseSingleData.prm_discounted]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows

            purchaseMultipleData.forEach(function(product, index) {

            //   const va = client.query('INSERT INTO public.purchase_product_master(ppm_prm_id, ppm_quantity, ppm_purchase_rate, ppm_cgst, ppm_hrn, ppm_sgst, ppm_igst, ppm_netamt, ppm_discount, ppm_selling_price, ppm_code)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',[result.rows[0].prm_id,product.pm_id,product.ppm_quantity,product.btpm_price,product.pm_cgst,product.pm_hsn,product.pm_sgst,product.pm_igst,product.netamt,product.pm_discount,product.btpm_sell_price]);
            //   // client.query('UPDATE product_master set pm_price = $1, pm_sale_price=$2 where pm_id = $3',[product.btpm_price,product.btpm_sell_price,product.pm_id]);
            // });
            const va = client.query('INSERT INTO purchase_product_master(ppm_prm_id, ppm_pm_id, ppm_quantity, ppm_purchase_rate, ppm_selling_price, ppm_cgst, ppm_sgst, ppm_igst, ppm_discount, ppm_code, ppm_color_code, ppm_netamt, ppm_size, ppm_color) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',[result.rows[0].prm_id,product.pm_id,product.ppm_quantity,product.ppm_purchase_rate,product.ppm_mrp,product.ppm_cgst,product.ppm_sgst,product.ppm_igst,purchaseSingleData.discountper,product.ppm_code,product.ppm_color_code,product.netamt,product.ppm_size,product.ppm_color]);
            });


            client.query('COMMIT;');
            done();
            return res.json(results);
        });

    }

    done(err);
  });

});

router.post('/edit/:purchaseId', oauth.authorise(), (req, res, next) => {
  const id = req.params.purchaseId;
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

    
      if(purchaseSingleData.prm_credit == "credit")
      {

        var diffrence = purchaseSingleData.prm_amount - purchaseSingleData.old_prm_amount;
        var singleInsert = 'UPDATE purchase_master set prm_date=$1, prm_vm_id=$2, prm_amount=$3, prm_credit=$4, prm_payment_date=$5, prm_inward_no=$6, prm_cgst=$7, prm_comment=$8, prm_sgst=$9, prm_igst=$10, prm_discount=$11, prm_balance_amount=prm_balance_amount + $12, prm_net_amount=$13, prm_updated_at=now() where prm_id=$14 RETURNING *',
            params = [purchaseSingleData.prm_date,purchaseSingleData.prm_vm.vm_id,purchaseSingleData.prm_amount,purchaseSingleData.prm_credit,purchaseSingleData.prm_payment_date,purchaseSingleData.prm_inward_no,purchaseSingleData.prm_cgst,purchaseSingleData.prm_comment,purchaseSingleData.prm_sgst,purchaseSingleData.prm_igst,purchaseSingleData.prm_discount,diffrence,purchaseSingleData.prm_discounted,id]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows

            purchaseremove.forEach(function(product, index) {
              // console.log(product);
              client.query('delete from public.purchase_product_master where ppm_id=$1',[product.ppm_id]);
            });

            purchaseMultipleData.forEach(function(product, index) {
              const va = client.query('update public.purchase_product_master set ppm_quantity=$1, ppm_purchase_rate=$2, ppm_netamt=$3 where ppm_id=$4 ',[product.ppm_quantity,product.ppm_purchase_rate,product.netamt,product.ppm_id]);
            
            });

            purchaseadd.forEach(function(product, index) {
              
              const va = client.query('INSERT INTO purchase_product_master(ppm_prm_id, ppm_pm_id, ppm_quantity, ppm_purchase_rate, ppm_selling_price, ppm_cgst, ppm_sgst, ppm_igst, ppm_discount, ppm_code, ppm_color_code, ppm_netamt, ppm_size, ppm_color) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',[id,product.pm_id,product.ppm_quantity,product.ppm_purchase_rate,product.ppm_mrp,product.ppm_cgst,product.ppm_sgst,product.ppm_igst,purchaseSingleData.discountper,product.ppm_code,product.ppm_color_code,product.netamt,product.ppm_size,product.ppm_color]);
            
            });

            client.query('COMMIT;');
            done();
            return res.json(results);
        });

    }
    else
    {

        var singleInsert = 'UPDATE purchase_master set prm_date=$1, prm_vm_id=$2, prm_amount=$3, prm_credit=$4, prm_inward_no=$5, prm_cgst=$6, prm_comment=$7, prm_sgst=$8, prm_igst=$9, prm_discount=$10, prm_balance_amount=0, prm_net_amount=$11, prm_updated_at=now() where prm_id=$12 RETURNING *',
            params = [purchaseSingleData.prm_date,purchaseSingleData.prm_vm.vm_id,purchaseSingleData.prm_amount,purchaseSingleData.prm_credit,purchaseSingleData.prm_inward_no,purchaseSingleData.prm_cgst,purchaseSingleData.prm_comment,purchaseSingleData.prm_sgst,purchaseSingleData.prm_igst,purchaseSingleData.prm_discount,purchaseSingleData.prm_discounted,id]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows

            purchaseremove.forEach(function(product, index) {
              
              client.query('delete from public.purchase_product_master where ppm_id=$1',[product.ppm_id]);
            });

            purchaseMultipleData.forEach(function(product, index) {
              
              const va = client.query('update public.purchase_product_master set ppm_quantity=$1, ppm_purchase_rate=$2, ppm_netamt=$3 where ppm_id=$4 ',[product.ppm_quantity,product.ppm_purchase_rate,product.netamt,product.ppm_id]);
            
            });

            purchaseadd.forEach(function(product, index) {
              
             const va = client.query('INSERT INTO purchase_product_master(ppm_prm_id, ppm_pm_id, ppm_quantity, ppm_purchase_rate, ppm_selling_price, ppm_cgst, ppm_sgst, ppm_igst, ppm_discount, ppm_code, ppm_color_code, ppm_netamt, ppm_size, ppm_color) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',[result.rows[0].prm_id,product.pm_id,product.ppm_quantity,product.ppm_purchase_rate,product.ppm_mrp,product.ppm_cgst,product.ppm_sgst,product.ppm_igst,purchaseSingleData.discountper,product.ppm_code,product.ppm_color_code,product.netamt,product.ppm_size,product.ppm_color]);
            
            });

          client.query('COMMIT;');
          done();
          return res.json(results);
      });

    }

    done(err);
  });

});

router.post('/delete/:purchaseId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.purchaseId;
  const purchaseSingleData = req.body;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');
    
    var singleInsert = 'UPDATE purchase_master SET prm_status=1, prm_updated_at=now() WHERE prm_id=$1 RETURNING *',
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
    
    const query = client.query("SELECT * from purchase_master where prm_invoice_no LIKE ($1) and prm_com_id=$2 order by prm_id desc limit 1;",[req.body.fin_year,req.body.com_id]);
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


router.post('/product/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(ppm.ppm_id) as total "+
                    "FROM purchase_product_master ppm "+
                    "INNER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "INNER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "INNER JOIN purchase_master prm on ppm.ppm_prm_id = prm.prm_id "+
                    "INNER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    // "where ppm.ppm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(pm_name || ppm_code || ppm_color_code) LIKE LOWER($2);";

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


router.post('/product/limit', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT * FROM purchase_product_master ppm "+
                    "INNER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "INNER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "INNER JOIN purchase_master prm on ppm.ppm_prm_id = prm.prm_id "+
                    "INNER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    // "where ppm.ppm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(pm_name || ppm_code || ppm_color_code) LIKE LOWER($2) "+
                    "order by ppm.ppm_id desc LIMIT $3 OFFSET $4";

    // SQL Query > Select Data
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

router.post('/product/delete/:productId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.productId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'update purchase_product_master set ppm_status=1, ppm_updated_at=now() where ppm_id=$1 RETURNING *',
        params = [id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        client.query('COMMIT;');
        return res.json(results);
    });

    done(err);
  });
});

router.post('/product/details', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT * FROM purchase_product_master ppm "+
                    // "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    // "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    // "LEFT OUTER JOIN purchase_master prm on ppm.ppm_prm_id = prm.prm_id "+
                    // "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+

                    "inner JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+ 
                    "inner JOIN unit_master um on pm.pm_um_id = um.um_id "+ 
                    "inner JOIN purchase_master prm on ppm.ppm_prm_id = prm.prm_id "+ 
                    "inner JOIN company_master com on prm.prm_com_id = com.com_id "+ 

                    // "and com.com_status=0 "+ 
                    // "and com.com_id=7 "

                    // "where ppm.ppm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 ";
                    // "and LOWER(ppm_code ) LIKE LOWER($2) "+
                    // "order by ppm.ppm_id desc LIMIT $3 OFFSET $4";

    // SQL Query > Select Data
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

router.post('/purchase/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(prm.prm_id) as total "+
                    "FROM purchase_master prm "+
                    "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(prm_invoice_no||''||vm_firm_name||''||prm_amount ) LIKE LOWER($2)"+
                    "and prm.prm_date between $3 and $4 ";

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

router.post('/purchase/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM purchase_master prm "+
                    "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(prm_invoice_no||''||vm_firm_name||''||prm_amount ) LIKE LOWER($2) "+
                    "and prm.prm_date between $3 and $4 "+
                    "order by prm.prm_id desc LIMIT $5 OFFSET $6";

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
                    "FROM purchase_master prm "+
                    "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where prm.prm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(prm_invoice_no ) LIKE LOWER($2)"+
                    "and prm.prm_date between $3 and $4 "+
                    "order by prm.prm_id desc LIMIT 16";

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

module.exports = router;
