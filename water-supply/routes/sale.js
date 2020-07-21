var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:smId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.smId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *,cm_name||''||cm_address||''||cm_mobile as cm_search "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_id=$1";

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

router.get('/details/:smId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.smId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, pm_name || ' ('|| ppm_color_code ||')' as pm_search "+
                    "FROM sale_product_master spm "+
                    "inner JOIN sale_master sm on spm.spm_sm_id = sm.sm_id "+
                    "inner JOIN purchase_product_master ppm on spm.spm_ppm_id = ppm.ppm_id "+
                    "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "where spm.spm_sm_id=$1";
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

    const strqry =  "SELECT *, spum_name || ' ('|| spum_color_code ||')' as spum_search "+
                    "FROM sale_product_unsorted_master spum "+
                    "inner JOIN sale_master sm on spum.spum_sm_id = sm.sm_id "+
                    // "inner JOIN purchase_product_master ppm on spum.spm_ppm_id = ppm.ppm_id "+
                    // "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "LEFT OUTER JOIN unit_master um on spum.spum_um_id = um.um_id "+
                    "where spum.spum_sm_id=$1";
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

router.get('/gst/details/:smId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.smId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT pm.pm_hsn, sum(spm.spm_netamt) as taxable_value, sum((spm_netamt)*(spm.spm_cgst/100)) as tax_cgst, sum((spm_netamt)*(spm.spm_sgst/100)) as tax_sgst,spm.spm_cgst,spm.spm_sgst  "+
                    "FROM sale_product_master spm "+
                    "LEFT OUTER JOIN sale_master sm on spm.spm_sm_id = sm.sm_id "+
                    "inner JOIN purchase_product_master ppm on spm.spm_ppm_id = ppm.ppm_id "+
                    "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "where spm.spm_sm_id=$1 "+
                    "group by pm.pm_hsn,spm.spm_cgst,spm.spm_sgst";
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

router.get('/deliverydetails/:vmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.vmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query("SELECT * FROM sale_master sm LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id LEFT OUTER JOIN employee_master emp on sm.sm_emp_id = emp.emp_id where sm.sm_status = 0 and cm.cm_id =$1 order by sm_id asc",[id]);
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
  const sale = req.body;
  // const purchaseMultipleData = req.body.purchaseMultipleData;
  // const purchaseUnsortMultipleData = req.body.purchaseUnsortMultipleData;
  var pending = 'pending';
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
      client.query('BEGIN;');

      var singleInsert = 'INSERT INTO public.sale_master(sm_invoice_no, sm_date, sm_cm_id, sm_from_date, sm_to_date, sm_prod_price, sm_amount, sm_net_amount, sm_prod_name, sm_com_id, sm_bill_status, sm_status)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0) RETURNING *',
            params = [sale.sm_invoice_no,sale.sm_date,sale.sm_cm_id.cm_id,sale.sm_from_date,sale.sm_to_date,sale.sm_product_price,sale.sm_amount, sale.sm_net_amount, sale.sm_prod_name, sale.sm_com_id, pending]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows

            client.query('COMMIT;');
            done();
            return res.json(results);
        });

    done(err);
  });

});

router.post('/edit/:smId', oauth.authorise(), (req, res, next) => {
  const id = req.params.smId;
  const results = [];
  // console.log(req.body.purchaseMultipleData);
  const purchaseSingleData = req.body.purchaseSingleData;
  const purchaseMultipleData = req.body.purchaseMultipleData;
  const purchaseadd = req.body.purchaseadd;
  const purchaseremove = req.body.purchaseremove;

  const purchaseUnsortMultipleData = req.body.purchaseUnsortMultipleData;
  const purchaseUnsortadd = req.body.purchaseUnsortadd;
  const purchaseUnsortremove = req.body.purchaseUnsortremove;
  
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
      client.query('BEGIN;');

      if (purchaseSingleData.sm_payment_mode == 'credit') {

        // const bal = purchaseSingleData.sm_amount - purchaseSingleData.old_sm_amount;   this cobdition replce with purchaseSingleData.sm_balance_amt variable(bal);
        var singleInsert = 'update public.sale_master set sm_date=$1, sm_cm_id=$2, sm_amount=$3, sm_emp_id=$4, sm_cgst=$5, sm_balance_amount=$6, sm_comment=$7, sm_payment_mode=$8, sm_sgst=$9, sm_igst=$10, sm_discount=$11, sm_buyer_no=$12, sm_payment_date=$13, sm_other_charges=$14, sm_eway_bill_no=$15, sm_vehicle_no=$16, sm_distance=$17, sm_eway_bill_date=$18, is_eway_bill=$19, spm_disc=$20, spm_net_amount=$21, sm_disc_per=$22, sm_prod_list=$23, sm_prod_unsort_list=$24, sm_del_date=$25, sm_advance_amt=$26, sm_balance_amt=$27, sm_del_check=$28, sm_delivery_status=$29, sm_updated_at=now()  where sm_id=$30 RETURNING *',
            params = [purchaseSingleData.sm_date,purchaseSingleData.sm_cm.cm_id,purchaseSingleData.sm_amount,purchaseSingleData.sm_emp.emp_id,purchaseSingleData.cgst,purchaseSingleData.sm_balance_amt,purchaseSingleData.sm_comment,purchaseSingleData.sm_payment_mode,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.sm_discount,purchaseSingleData.sm_buyer_no,purchaseSingleData.sm_payment_date,purchaseSingleData.sm_other_charges,purchaseSingleData.sm_eway_bill_no,purchaseSingleData.sm_vehicle_no,purchaseSingleData.sm_distance,purchaseSingleData.sm_eway_bill_date,purchaseSingleData.is_eway,purchaseSingleData.discount,purchaseSingleData.amount,purchaseSingleData.disper,purchaseSingleData.sm_prod_list,purchaseSingleData.sm_prod_unsort_list, purchaseSingleData.sm_del_date, purchaseSingleData.sm_advance_amt, purchaseSingleData.sm_balance_amt, purchaseSingleData.sm_del_check, purchaseSingleData.sm_delivery_status, id]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows

             done();
        });
      }
      else{
        
        var singleInsert = 'update public.sale_master set sm_date=$1, sm_cm_id=$2, sm_amount=$3, sm_emp_id=$4, sm_cgst=$5, sm_comment=$6, sm_payment_mode=$7, sm_sgst=$8, sm_igst=$9, sm_discount=$10, sm_buyer_no=$11, sm_other_charges=$12, sm_eway_bill_no=$13, sm_vehicle_no=$14, sm_distance=$15, sm_eway_bill_date=$16, is_eway_bill=$17, spm_disc=$18, spm_net_amount=$19, sm_disc_per=$20, sm_prod_list=$21, sm_prod_unsort_list=$22, sm_advance_amt=$23, sm_balance_amt=$24, sm_del_date=$25, sm_del_check=$26, sm_delivery_status=$27, sm_updated_at=now()  where sm_id=$28 RETURNING *',
            params = [purchaseSingleData.sm_date,purchaseSingleData.sm_cm.cm_id,purchaseSingleData.sm_amount,purchaseSingleData.sm_emp.emp_id,purchaseSingleData.cgst,purchaseSingleData.sm_comment,purchaseSingleData.sm_payment_mode,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.sm_discount,purchaseSingleData.sm_buyer_no,purchaseSingleData.sm_other_charges,purchaseSingleData.sm_eway_bill_no,purchaseSingleData.sm_vehicle_no,purchaseSingleData.sm_distance,purchaseSingleData.sm_eway_bill_date,purchaseSingleData.is_eway,purchaseSingleData.discount,purchaseSingleData.amount,purchaseSingleData.disper,purchaseSingleData.sm_prod_list,purchaseSingleData.sm_prod_unsort_list, purchaseSingleData.sm_advance_amt, purchaseSingleData.sm_balance_amt, purchaseSingleData.sm_del_date, purchaseSingleData.sm_del_check, purchaseSingleData.sm_delivery_status, id]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows

             done();
        });
      }

        purchaseremove.forEach(function(product, index) {
          client.query('delete from public.sale_product_master where spm_id=$1',[product.spm_id]);
        });

        purchaseMultipleData.forEach(function(product, index) {
          const va = client.query('update public.sale_product_master set spm_quantity=$1, spm_discount=$2, spm_netamt=$3 where spm_id=$4 ',[product.spm_quantity,purchaseSingleData.disper,product.netamt,product.spm_id]);
        });

        purchaseadd.forEach(function(product, index) {

          client.query('INSERT INTO public.sale_product_master(spm_sm_id, spm_ppm_id, spm_quantity, spm_rate, spm_cgst, spm_sgst, spm_igst, spm_discount, spm_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[id,product.ppm_id,product.btpm_quantity,product.ppm_mrp,product.pm_cgst,product.pm_sgst,product.pm_igst,purchaseSingleData.disper,product.netamt]);
              
        });


        purchaseUnsortremove.forEach(function(product, index) {
          client.query('delete from public.sale_product_unsorted_master where spum_id=$1',[product.spum_id]);
        });

        purchaseUnsortMultipleData.forEach(function(product, index) {
          // const va = client.query('update public.sale_product_unsorted_master set spum_quantity=$1, spum_discount=$2, spum_netamt=$3 where spum_id=$4 ',[product.spm_quantity,purchaseSingleData.disper,product.netamt,product.spum_id]);
          const va = client.query('update public.sale_product_unsorted_master set spum_quantity=$1, spum_rate=$2, spum_cgst=$3, spum_sgst=$4, spum_igst=$5, spum_name=$6, spum_color_code=$7, spum_size=$8, spum_hsn=$9, spum_um_id=$10, spum_discount=$11, spum_netamt=$12 where spum_id=$13 ',[product.btpm_product_quantity,product.ppm_product_mrp,product.pm_product_cgst,product.pm_product_sgst,product.pm_product_igst,product.pm_product_name,product.pm_product_color_code,product.pm_product_size,product.pm_product_hsn,product.um_id,purchaseSingleData.disper,product.netamt,product.spum_id]);
        });

        purchaseUnsortadd.forEach(function(product, index) {
          client.query('INSERT INTO public.sale_product_unsorted_master(spum_sm_id, spum_quantity, spum_rate, spum_cgst, spum_sgst, spum_igst, spum_name, spum_color_code, spum_size, spum_hsn, spum_um_id, spum_discount, spum_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',[id,product.btpm_product_quantity,product.ppm_product_mrp,product.pm_product_cgst,product.pm_product_sgst,product.pm_product_igst,product.pm_product_name,product.pm_product_color_code,product.pm_product_size,product.pm_product_hsn,product.um_id,purchaseSingleData.disper,product.netamt]);
        });
        
      client.query('COMMIT;');
      done();
        return res.json(results);
    done(err);
  });

});

router.post('/delete/:smId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.smId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var singleInsert = 'UPDATE sale_master SET sm_status=1 WHERE sm_id=($1) RETURNING *',
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

router.post('/pending/delete/:smId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.smId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var singleInsert = "UPDATE sale_master SET sm_status=1, sm_bill_status='cancel' WHERE sm_id=($1) RETURNING *",
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

router.post('/reopen/:smId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.smId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'UPDATE sale_master SET sm_status=0 WHERE sm_id=($1) RETURNING *',
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

// FOR REOPEN DELIVERED INVOICE
router.post('/reopen/delivery/:smId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.smId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

      // const strqry = "SELECT * "+
      //               "from expense_master em "+
      //               "LEFT OUTER JOIN customer_master cm on em.em_cm_id = cm.cm_id "+
      //               "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
      //               "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
      //               "where em.em_status=0 "+
      //               "and com.com_status=0 "+
      //               "and com.com_id=$1 "+
      //               // "and LOWER(cm_name||''||cm_address||''||cm_mobile ) LIKE LOWER($2) "+
      //               "and em.em_date between $3 and $4 "+
      //               "order by em.em_id desc";

    var singleInsert = 'UPDATE sale_master SET sm_balance_amt = sm_balance_amount, sm_delivery_status=0 WHERE sm_id=($1) RETURNING *',
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

router.post('/action', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }  
        
    var singleInsert = "update public.sale_master set sm_payment_date=$1, sm_advance_amt=$2, sm_balance_amt=$3, sm_payment_mode=$4, sm_comment=$5, sm_bill_status='paid', sm_updated_at=now() where sm_id=$6 RETURNING *",
        params = [req.body.sm_payment_date,req.body.sm_advance_amt,req.body.sm_balance_amt,req.body.sm_payment_mode,req.body.sm_comment,req.body.sm_id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
 
    client.query('update public.customer_master set cm_balance=$1 where cm_id=$2 RETURNING *',
        [req.body.sm_balance_amt,req.body.cm_id]);
          
        return res.json(results);
        done();
    });

    done(err);
  });
});
// router.post('/reopen/delivery/:smId', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }

//     client.query('BEGIN;');
//     var singleInsert = "INSERT INTO sale_master(sm_cm_id, sm_date, sm_received_by, sm_comment, sm_payment_mode, sm_balance_amt, sm_com_id, sm_status) values($1,current_date,'N/A',$2,'Cash',$3,$4,0) RETURNING *",

//     var singleInsert = "INSERT INTO expense_master(em_cm_id, em_date, em_received_by, em_comment, em_payment_mode, em_amount, em_com_id, em_status) values($1,current_date,'N/A',$2,'Cash',$3,$4,0) RETURNING *",
//         params = [req.body.cm_id,req.body.sm_comment,req.body.sm_balance_amt,req.body.com_id]
//     client.query(singleInsert, params, function (error, result) {
//         results.push(result.rows[0]); // Will contain your inserted rows

//         client.query('UPDATE sale_master SET sm_balance_amt = em_amount, sm_delivery_status=0 WHERE sm_id=($1)',[req.body.sm_id]);
//         client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[result.rows[0].em_id,req.body.sm_id,req.body.sm_balance_amt]);

//         client.query('COMMIT;');
//         done();
//         return res.json(results);
//     });

//     done(err);
//   });
// });


router.post('/checkPending/:cm_id', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.cm_id;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * FROM sale_master sm "+
                    "where sm.sm_cm_id = $1 "+
                    // "and sm.sm_bill_status = 'pending' "+
                    "and sm.sm_status = 0 "+
                    "ORDER BY sm.sm_id DESC limit 1";

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

// router.post('/checkPending/forList', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
    
//     const query = client.query("SELECT * from sale_master where sm.sm_cm_id = $1  and sm_id<$2 order by sm_id desc limit 1;",[req.body.customer_id,req.body.sale_id]);
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     query.on('end', () => {
//       done();
//       // pg.end();
//       return res.json(results);
//     });
//     done(err);
//   });
// });
// router.post('/checkPending/:cm_id', oauth.authorise(), (req, res, next) => {

router.post('/check_pend/list', oauth.authorise(), (req, res, next) => {
  const results = [];
  // const id = req.params.cm_id;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * FROM sale_master sm "+
                    "where sm.sm_cm_id = $1 "+
                    "and sm.sm_id < $2 "+
                    // "and sm.sm_bill_status = 'pending' "+
                    // "and sm.sm_status = 0 "+ 
                    "ORDER BY sm.sm_id DESC limit 1";

    const query = client.query(strqry,[req.body.customer_id,req.body.sale_id]);
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


router.post('/serial/no', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    
    const query = client.query("SELECT * from sale_master where sm_invoice_no LIKE ($1) and sm_com_id=$2 order by sm_id desc limit 1;",[req.body.fin_year,req.body.com_id]);
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

router.post('/sale/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT count(sm.sm_id) as total "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount ) LIKE LOWER($2) "+
                    "and sm.sm_date between $3 and $4 ";

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

router.post('/sale/limit', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT * "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount) LIKE LOWER($2) "+
                    "and sm.sm_date between $3 and $4 "+
                    "order by sm.sm_id desc LIMIT $5 OFFSET $6";

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


router.post('/sale/total/pending', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT count(sm.sm_id) as total "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_bill_status='pending' "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount ) LIKE LOWER($2) "+
                    "and sm.sm_date between $3 and $4 ";

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

router.post('/sale/limit/pending', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT * "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_bill_status='pending' "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount) LIKE LOWER($2) "+
                    "and sm.sm_date between $3 and $4 "+
                    "order by sm.sm_id desc LIMIT $5 OFFSET $6";

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
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and sm.sm_delivery_status=1 "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no ) LIKE LOWER($2) "+
                    "and sm.sm_date between $3 and $4 "+
                    "order by sm.sm_id desc LIMIT 16";

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

// THIS ROUTE IS ADD TO SEARCH SALE SERIAL LIST ON WORKSHOP SALE FORM IF PRODUCT IS NOT DELIVERED
router.post('/typeahead/search/invoice', oauth.authorise(), (req, res, next) => {
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
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and sm.sm_delivery_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no ) LIKE LOWER($2) "+
                    "and sm.sm_date between $3 and $4 "+
                    "order by sm.sm_id desc LIMIT 16";

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

router.post('/salereport/bill', oauth.authorise(), (req, res, next) => {
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
                    "FROM product_master pm "+
                    "LEFT OUTER JOIN customer_master cm on pm.pm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN company_master com on pm.pm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and pm.pm_status=0 "+
                    "and com.com_id=$1 "+ 
                    "and cm.cm_id=$2 "+  
                    "and pm_date BETWEEN $3 and $4 ";
    const query = client.query(strqry,[req.body.com_id,req.body.customer_id,req.body.from_date,req.body.to_date]);
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
