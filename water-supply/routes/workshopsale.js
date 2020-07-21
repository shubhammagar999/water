var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:wsmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.wsmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * "+
                    "FROM workshop_sale_master wsm "+
                    "LEFT OUTER JOIN workshop_master wm on wsm.wsm_wm_id = wm.wm_id "+
                    "LEFT OUTER JOIN sale_master sm on wsm.wsm_sm_id= sm.sm_id "+
                    "LEFT OUTER JOIN company_master com on wsm.wsm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and wsm.wsm_id=$1";

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
// router.get('/:wsmId', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   const id = req.params.wsmId;
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }

//     const strqry =  //"SELECT * "+
//                     // "FROM workshop_sale_master wsm "+
//                     // // "LEFT OUTER JOIN customer_master cm on wsm.wsm_cm_id = cm.cm_id "+
//                     // // "LEFT OUTER JOIN employee_master emp on wsm.wsm_emp_id=emp.emp_id "+
//                     // "LEFT OUTER JOIN company_master com on wsm.wsm_com_id = com.com_id "+
//                     // "where com.com_status=0 "+
//                     // "and wsm.wsm_id=$1";

//                     "SELECT * "+
//                     "FROM workshop_sale_master wsm "+
//                     "LEFT OUTER JOIN sale_master sm on wsm.wsm_sm_id = sm.sm_id "+
//                     "LEFT OUTER JOIN workshop_master wm on wsm.wsm_wm_id = wm.wm_id "+
//                     // "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
//                     "LEFT OUTER JOIN company_master com on wsm.wsm_com_id = com.com_id "+
//                     "where com.com_status=0 "+
//                     "and wsm.wsm_id=$1";


//     const query = client.query(strqry,[id]);
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


// PRIMARY ROUTES
// router.get('/details/:wsmId', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   const id = req.params.wsmId;
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }

//     // const strqry =  "SELECT *, pm_name || ' ('|| um_name ||')' as pm_search "+
//     //                 "FROM workshop_sale_product_master spm "+
//     //                 "inner JOIN workshop_sale_master wsm on spm.spm_wsm_id = wsm.wsm_id "+
//     //                 "inner JOIN product_master pm on spm.spm_pm_id = pm.pm_id "+
//     //                 "inner JOIN unit_master um on pm.pm_um_id = um.um_id "+
//     //                 "where spm.spm_wsm_id=$1";

//      const strqry =  "SELECT *, pm_name || ' ('|| ppm_color_code ||')' as pm_search "+
//                     "FROM workshop_sale_product_master wspm "+
//                     "inner JOIN workshop_sale_master wsm on wspm.wspm_wsm_id = wsm.wsm_id "+
//                     "inner JOIN sale_product_master spm on wspm.wspm_spm_id = spm.spm_id "+
//                     "inner JOIN purchase_product_master ppm on wspm.spm_ppm_id = ppm.ppm_id "+
//                     "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
//                     "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
//                     "where wspm.wspm_spm_id=$1";

                   
//     // SQL Query > Select Data
//     // SQL Query > Select Data
//     const query = client.query(strqry,[id]);
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
// copy fro salereturn
// router.get('/details/:wsmId', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   const id = req.params.srmId;
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Select Data
    
//     // const strqry =  "SELECT *, pm_name || ' ('|| ppm_color_code ||')' as pm_search "+
//     //                 "FROM workshop_sale_product_master abc "+
//     //                 "LEFT OUTER JOIN workshop_sale_master wsm on abc.wspm_wsm_id = wsm.wsm_id "+
//     //                 "inner JOIN sale_product_master spm on abc.wspm_spm_id = spm.spm_id "+
//     //                 "LEFT OUTER JOIN sale_master sm on spm.spm_sm_id = sm.sm_id "+

//     //                 // "LEFT OUTER JOIN unit_master um on sm.sm_um_id = um.um_id "+
//     //                 "where abc.srpm_srm_id=$1";

//     const strqry =  "SELECT *, wspm_name || ' ('|| ppm_color_code ||')' as pm_search "+
//                     "FROM workshop_sale_product_master abc "+
//                     "LEFT OUTER JOIN workshop_sale_master wsm on abc.wspm_wsm_id = wsm.wsm_id "+
//                     "inner JOIN sale_product_master spm on abc.wspm_spm_id = spm.spm_id "+
//                     "LEFT OUTER JOIN purchase_product_master ppm on spm.spm_ppm_id = ppm.ppm_id "+
//                     "LEFT OUTER JOIN unit_master um on ppm.ppm_um_id = um.um_id "+
//                     "where abc.wspm_wsm_id=$1";

//     const query = client.query(strqry,[id]);
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

// router.get('/details/:wsmId', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   const id = req.params.smId;
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }

//     const strqry =  "SELECT *, pm_name || ' ('|| ppm_color_code ||')' as pm_search "+
//                     "FROM workshop_sale_product_master wspm "+
//                     "inner JOIN workshop_sale_master wsm on wspm.wspm_wsm_id = wsm.wsm_id "+
//                     "inner JOIN sale_product_master spm on wspm.wspm_spm_id = spm.spm_id "+
//                     // "LEFT OUTER JOIN sale_master sm on wspum.wsm_sm_id = sm.sm_id "+
//                     // "inner JOIN purchase_product_master ppm on wspm.spm_ppm_id = ppm.ppm_id "+
//                     // "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
//                     // "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
//                     "where wspm.wspm_spm_id=$1";
//     // SQL Query > Select Data
//     const query = client.query(strqry,[id]);
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

// router.get('/details/unsorted/:wsmId', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   const id = req.params.smId;
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }

//     const strqry =  "SELECT *, wspum_name || ' ('|| wspum_color_code ||')' as spum_search "+
//                     "FROM workshop_sale_product_unsorted_master wspum "+
//                     "inner JOIN workshop_sale_master wsm on wspum.wspum_wsm_id = wsm.wsm_id "+
//                     // "inner JOIN purchase_product_master ppm on spum.spm_ppm_id = ppm.ppm_id "+
//                     // "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
//                      "inner JOIN sale_product_unsorted_master spum on wspum.wspum_spum_id = spum.spum_id "+
//                     // "LEFT OUTER JOIN sale_master sm on wspum.wsm_sm_id = sm.sm_id "+
//                     // "LEFT OUTER JOIN unit_master um on wspum.spum_um_id = um.um_id "+
//                     "where wspum.wspum_spum_id=$1";
//     // SQL Query > Select Data
//     const query = client.query(strqry,[id]);
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
// TODAY copy
router.get('/details/:wsmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.wsmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, pm_name || ' ('|| ppm_color_code ||')' as pm_search "+
                    "FROM workshop_sale_product_master wspm "+
                    "inner JOIN workshop_sale_master wsm on wspm.wspm_wsm_id = wsm.wsm_id "+
                     "inner JOIN sale_product_master spm on wspm.wspm_spm_id = spm.spm_id "+
                    "inner JOIN purchase_product_master ppm on spm.spm_ppm_id = ppm.ppm_id "+
                    "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "where wspm.wspm_wsm_id=$1";
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

router.get('/details/unsorted/:wsmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.wsmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, spum_name || ' ('|| spum_color_code ||')' as spum_search "+
                    "FROM workshop_sale_product_unsorted_master wspum "+
                    "inner JOIN workshop_sale_master wsm on wspum.wspum_wsm_id = wsm.wsm_id "+
                    "inner JOIN sale_product_unsorted_master spum on wspum.wspum_spum_id = spum.spum_id "+

                    // "inner JOIN purchase_product_master ppm on spum.spm_ppm_id = ppm.ppm_id "+
                    // "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "LEFT OUTER JOIN unit_master um on spum.spum_um_id = um.um_id "+
                    "where wspum.wspum_wsm_id=$1";
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


// router.get('/gst/details/:wsmId', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   const id = req.params.wsmId;
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }

//     const strqry =  "SELECT pm.pm_hsn, sum(spm.spm_netamt) as taxable_value, sum((spm_netamt)*(spm.spm_cgst/100)) as tax_cgst, sum((spm_netamt)*(spm.spm_sgst/100)) as tax_sgst,spm.spm_cgst,spm.spm_sgst  "+
//                     "FROM workshop_sale_product_master spm "+
//                     "LEFT OUTER JOIN workshop_sale_master wsm on spm.spm_wsm_id = wsm.wsm_id "+
//                     "LEFT OUTER JOIN purchase_product_master pm on spm.wspm_ppm_id = pm.ppm_id "+
//                     "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
//                     "where spm.wspm_ppm_id=$1 "+
//                     "group by pm.pm_hsn,spm.spm_cgst,spm.spm_sgst";
//     // SQL Query > Select Data
//     const query = client.query(strqry,[id]);
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
    const query = client.query("SELECT * FROM workshop_sale_master wsm LEFT OUTER JOIN customer_master cm on wsm.wsm_cm_id = cm.cm_id LEFT OUTER JOIN employee_master emp on wsm.wsm_emp_id = emp.emp_id where wsm.wsm_status = 0 and cm.cm_id =$1 order by wsm_id asc",[id]);
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

// router.post('/add', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   const purchaseSingleData = req.body.purchaseSingleData;
//   const purchaseMultipleData = req.body.purchaseMultipleData;
//   console.log(purchaseSingleData);
  
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
//       client.query('BEGIN;');

//       if (purchaseSingleData.wsm_payment_mode == 'credit') {

//         var singleInsert = 'INSERT INTO public.workshop_sale_master( wsm_invoice_no, wsm_date, wsm_cm_id, wsm_amount, wsm_emp_id, wsm_cgst, wsm_balance_amount, wsm_comment, wsm_payment_mode, wsm_sgst, wsm_igst, wsm_discount, wsm_buyer_no, wsm_payment_date, wsm_com_id, wsm_other_charges, wsm_eway_bill_no, wsm_vehicle_no, wsm_distance, wsm_eway_bill_date, is_eway_bill, spm_disc, spm_net_amount, wsm_disc_per, wsm_status)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, 0) RETURNING *',
//             params = [purchaseSingleData.wsm_invoice_no,purchaseSingleData.wsm_date,purchaseSingleData.wsm_cm_id.cm_id,purchaseSingleData.wsm_amount,purchaseSingleData.wsm_emp_id.emp_id,purchaseSingleData.cgst,purchaseSingleData.wsm_amount,purchaseSingleData.wsm_comment,purchaseSingleData.wsm_payment_mode,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.wsm_discount,purchaseSingleData.wsm_buyer_no,purchaseSingleData.wsm_payment_date,purchaseSingleData.wsm_com_id,purchaseSingleData.wsm_other_charges,purchaseSingleData.wsm_eway_bill_no,purchaseSingleData.wsm_vehicle_no,purchaseSingleData.wsm_distance,purchaseSingleData.wsm_eway_bill_date,purchaseSingleData.is_eway,purchaseSingleData.discount,purchaseSingleData.amount,purchaseSingleData.disper]
//         client.query(singleInsert, params, function (error, result) {
//             results.push(result.rows[0]); // Will contain your inserted rows

//           purchaseMultipleData.forEach(function(product, index) {
//             client.query('INSERT INTO public.workshop_sale_product_master(wspm_wsm_id, wspm_ppm_id, wspm_quantity, wspm_rate, wspm_cgst, wspm_sgst, wspm_igst, wspm_discount, wspm_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[result.rows[0].wsm_id,product.ppm_id,product.ppm_quantity,product.ppm_purchase_rate,product.ppm_cgst,product.ppm_sgst,product.ppm_igst,purchaseSingleData.disper,product.netamt]);
            
//           });

//             client.query('COMMIT;');
//             done();
//             return res.json(results);
//         });

//       }
//       else{
        
//         var singleInsert = 'INSERT INTO public.workshop_sale_master( wsm_invoice_no, wsm_date, wsm_cm_id, wsm_amount, wsm_emp_id, wsm_cgst, wsm_comment, wsm_payment_mode, wsm_sgst, wsm_igst, wsm_discount, wsm_buyer_no, wsm_com_id, wsm_other_charges, wsm_eway_bill_no, wsm_vehicle_no, wsm_distance, wsm_eway_bill_date, is_eway_bill, spm_disc, spm_net_amount, wsm_disc_per, wsm_balance_amount, wsm_status)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 0, 0) RETURNING *',
//             params = [purchaseSingleData.wsm_invoice_no,purchaseSingleData.wsm_date,purchaseSingleData.wsm_cm_id.cm_id,purchaseSingleData.wsm_amount,purchaseSingleData.wsm_emp_id.emp_id,purchaseSingleData.cgst,purchaseSingleData.wsm_comment,purchaseSingleData.wsm_payment_mode,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.wsm_discount,purchaseSingleData.wsm_buyer_no,purchaseSingleData.wsm_com_id,purchaseSingleData.wsm_other_charges,purchaseSingleData.wsm_eway_bill_no,purchaseSingleData.wsm_vehicle_no,purchaseSingleData.wsm_distance,purchaseSingleData.wsm_eway_bill_date,purchaseSingleData.is_eway,purchaseSingleData.discount,purchaseSingleData.amount,purchaseSingleData.disper]
//         client.query(singleInsert, params, function (error, result) {
//             results.push(result.rows[0]); // Will contain your inserted rows

//           purchaseMultipleData.forEach(function(product, index) {
//              client.query('INSERT INTO public.workshop_sale_product_master(wspm_wsm_id, wspm_ppm_id, wspm_quantity, wspm_rate, wspm_cgst, wspm_sgst, wspm_igst, wspm_discount, wspm_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[result.rows[0].wsm_id,product.ppm_id,product.ppm_quantity,product.ppm_purchase_rate,product.ppm_cgst,product.ppm_sgst,product.ppm_igst,purchaseSingleData.disper,product.netamt]);
             
//           });

//             client.query('COMMIT;');
//             done();
//             return res.json(results);
//         });
//       }

//     done(err);
//   });

// });
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
    

    var singleInsert = 'INSERT INTO public.workshop_sale_master( wsm_invoice_no, wsm_date, wsm_exp_date, wsm_sm_id, wsm_buyer_no, wsm_del_date, wsm_comment, wsm_wm_id, wsm_com_id, wsm_status)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0) RETURNING *',
            params = [purchaseSingleData.wsm_invoice_no,purchaseSingleData.wsm_date,purchaseSingleData.wsm_exp_date,purchaseSingleData.wsm_sm_id.sm_id,purchaseSingleData.wsm_buyer_no,purchaseSingleData.wsm_del_date,purchaseSingleData.wsm_comment,purchaseSingleData.wsm_wm_id.wm_id,purchaseSingleData.wsm_com_id]
      client.query(singleInsert, params, function (error, result) {
      results.push(result.rows[0]); // Will contain your inserted rows

      purchaseMultipleData.forEach(function(product, index) {

        client.query('INSERT INTO public.workshop_sale_product_master(wspm_wsm_id, wspm_spm_id, wspm_quantity, wspm_type)VALUES ($1, $2, $3, $4)',[result.rows[0].wsm_id,product.spm_id,product.spm_quantity,product.wspm_type]);
        
      });
      // purchaseUnsortMultipleData.forEach(function(product, index) {
      //       client.query('INSERT INTO public.salereturn_product_unsorted_master(srpum_srm_id, srpum_pm_id, srpum_quantity, srpum_rate, srpum_cgst, srpum_sgst, srpum_igst, srpum_discount,srpum_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[result.rows[0].srm_id,product.pm_id,product.btpm_product_quantity,product.ppm_product_mrp,product.pm_product_cgst,product.pm_product_sgst,product.pm_product_igst,purchaseSingleData.disper,product.netamt]);
      //     });
      purchaseUnsortMultipleData.forEach(function(product, index) {
            client.query('INSERT INTO public.workshop_sale_product_unsorted_master(wspum_wsm_id, wspum_spum_id, wspum_quantity, wspum_type)VALUES ($1, $2, $3, $4)',[result.rows[0].wsm_id,product.spum_id,product.spum_quantity,product.wspum_type]);
            
          });

      client.query('COMMIT;');
      done();
      return res.json(results);
    });
    done(err);
  });

});

// router.post('/add', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   const purchaseSingleData = req.body.purchaseSingleData;
//   const purchaseMultipleData = req.body.purchaseMultipleData;  
//   const purchaseUnsortMultipleData = req.body.purchaseUnsortMultipleData;
//   console.log(purchaseSingleData);
  
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
//       client.query('BEGIN;');

//       // if (purchaseSingleData.wsm_payment_mode == 'credit') {

//         var singleInsert = 'INSERT INTO public.workshop_sale_master( wsm_invoice_no, wsm_date, wsm_exp_date, wsm_sm_id, wsm_buyer_no, wsm_del_date, wsm_comment, wsm_wm_id, wsm_com_id, wsm_status)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0) RETURNING *',
//             params = [purchaseSingleData.wsm_invoice_no,purchaseSingleData.wsm_date,purchaseSingleData.wsm_exp_date,purchaseSingleData.wsm_sm_id,purchaseSingleData.wsm_buyer_no,purchaseSingleData.wsm_del_date,purchaseSingleData.wsm_comment,purchaseSingleData.wsm_wm_id,purchaseSingleData.wsm_com_id]
//         client.query(singleInsert, params, function (error, result) {
//             results.push(result.rows[0]); // Will contain your inserted rows
//           purchaseMultipleData.forEach(function(product, index) {
//             client.query('INSERT INTO public.workshop_sale_product_master(wspm_wsm_id, wspm_spm_id, wspm_quantity, wspm_type, wspm_status)VALUES ($1, $2, $3, $4, $0)',[result.rows[0].wsm_id,product.pm_search,product.spm_quantity,product.wspm_type]);
            
//           });

//            purchaseUnsortMultipleData.forEach(function(product, index) {
//             client.query('INSERT INTO public.workshop_sale_product_unsorted_master(wspum_wsm_id, wspum_spm_id, wspum_quantity, wspum_type, wspum_status)VALUES ($1, $2, $3, $4, $0)',[result.rows[0].wsm_id,product.spum_search,product.spum_quantity,product.wspum_type]);
            
//           });

//             client.query('COMMIT;');
//             done();
//             return res.json(results);
//         });

//       // }
//       // else{
        
//       //   var singleInsert = 'INSERT INTO public.workshop_sale_master( wsm_invoice_no, wsm_date, wsm_cm_id, wsm_amount, wsm_emp_id, wsm_cgst, wsm_comment, wsm_payment_mode, wsm_sgst, wsm_igst, wsm_discount, wsm_buyer_no, wsm_com_id, wsm_other_charges, wsm_eway_bill_no, wsm_vehicle_no, wsm_distance, wsm_eway_bill_date, is_eway_bill, spm_disc, spm_net_amount, wsm_disc_per, wsm_balance_amount, wsm_status)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 0, 0) RETURNING *',
//       //       params = [purchaseSingleData.wsm_invoice_no,purchaseSingleData.wsm_date,purchaseSingleData.wsm_cm_id.cm_id,purchaseSingleData.wsm_amount,purchaseSingleData.wsm_emp_id.emp_id,purchaseSingleData.cgst,purchaseSingleData.wsm_comment,purchaseSingleData.wsm_payment_mode,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.wsm_discount,purchaseSingleData.wsm_buyer_no,purchaseSingleData.wsm_com_id,purchaseSingleData.wsm_other_charges,purchaseSingleData.wsm_eway_bill_no,purchaseSingleData.wsm_vehicle_no,purchaseSingleData.wsm_distance,purchaseSingleData.wsm_eway_bill_date,purchaseSingleData.is_eway,purchaseSingleData.discount,purchaseSingleData.amount,purchaseSingleData.disper]
//       //   client.query(singleInsert, params, function (error, result) {
//       //       results.push(result.rows[0]); // Will contain your inserted rows

//       //     purchaseMultipleData.forEach(function(product, index) {
//       //        client.query('INSERT INTO public.workshop_sale_product_master(wspm_wsm_id, wspm_ppm_id, wspm_quantity, wspm_rate, wspm_cgst, wspm_sgst, wspm_igst, wspm_discount, wspm_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[result.rows[0].wsm_id,product.ppm_id,product.ppm_quantity,product.ppm_purchase_rate,product.ppm_cgst,product.ppm_sgst,product.ppm_igst,purchaseSingleData.disper,product.netamt]);
             
//       //     });

//       //       client.query('COMMIT;');
//       //       done();
//       //       return res.json(results);
//       //   });
//       // }

//     done(err);
//   });

// });

// router.post('/edit/:wsmId', oauth.authorise(), (req, res, next) => {
//   const id = req.params.wsmId;
//   const results = [];
//   const purchaseSingleData = req.body.purchaseSingleData;
//   const purchaseMultipleData = req.body.purchaseMultipleData;
//   const purchaseadd = req.body.purchaseadd;
//   const purchaseremove = req.body.purchaseremove;
//   // const newpurchaseremove : req.body.newpurchaseremove;
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
//       client.query('BEGIN;');

//       if (purchaseSingleData.wsm_payment_mode == 'credit') {

//         const bal = purchaseSingleData.wsm_amount - purchaseSingleData.old_sm_amount;
//         var singleInsert = 'update public.workshop_sale_master set sm_date=$1, sm_cm_id=$2, sm_amount=$3, sm_emp_id=$4, sm_cgst=$5, sm_balance_amount=sm_balance_amount+$6, sm_comment=$7, sm_payment_mode=$8, sm_sgst=$9, sm_igst=$10, sm_discount=$11, sm_buyer_no=$12, sm_payment_date=$13, sm_other_charges=$14, sm_eway_bill_no=$15, sm_vehicle_no=$16, sm_distance=$17, sm_eway_bill_date=$18, is_eway_bill=$19, spm_disc=$20, spm_net_amount=$21, sm_disc_per=$22, sm_updated_at=now()  where sm_id=$23 RETURNING *',
//             params = [purchaseSingleData.sm_date,purchaseSingleData.sm_cm.cm_id,purchaseSingleData.sm_amount,purchaseSingleData.sm_emp.emp_id,purchaseSingleData.cgst,bal,purchaseSingleData.sm_comment,purchaseSingleData.sm_payment_mode,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.sm_discount,purchaseSingleData.sm_buyer_no,purchaseSingleData.sm_payment_date,purchaseSingleData.sm_other_charges,purchaseSingleData.sm_eway_bill_no,purchaseSingleData.sm_vehicle_no,purchaseSingleData.sm_distance,purchaseSingleData.sm_eway_bill_date,purchaseSingleData.is_eway,purchaseSingleData.discount,purchaseSingleData.amount,purchaseSingleData.disper,id]
//         client.query(singleInsert, params, function (error, result) {
//             results.push(result.rows[0]); // Will contain your inserted rows

//              done();
//         });
//       }
//       else{
        
//         var singleInsert = 'update public.workshop_sale_master set sm_date=$1, sm_cm_id=$2, sm_amount=$3, sm_emp_id=$4, sm_cgst=$5, sm_comment=$6, sm_payment_mode=$7, sm_sgst=$8, sm_igst=$9, sm_discount=$10, sm_buyer_no=$11, sm_other_charges=$12, sm_eway_bill_no=$13, sm_vehicle_no=$14, sm_distance=$15, sm_eway_bill_date=$16, is_eway_bill=$17, spm_disc=$18, spm_net_amount=$19, sm_disc_per=$20, sm_updated_at=now()  where sm_id=$21 RETURNING *',
//             params = [purchaseSingleData.sm_date,purchaseSingleData.sm_cm.cm_id,purchaseSingleData.sm_amount,purchaseSingleData.sm_emp.emp_id,purchaseSingleData.cgst,purchaseSingleData.sm_comment,purchaseSingleData.sm_payment_mode,purchaseSingleData.sgst,purchaseSingleData.igst,purchaseSingleData.sm_discount,purchaseSingleData.sm_buyer_no,purchaseSingleData.sm_other_charges,purchaseSingleData.sm_eway_bill_no,purchaseSingleData.sm_vehicle_no,purchaseSingleData.sm_distance,purchaseSingleData.sm_eway_bill_date,purchaseSingleData.is_eway,purchaseSingleData.discount,purchaseSingleData.amount,purchaseSingleData.disper,id]
//         client.query(singleInsert, params, function (error, result) {
//             results.push(result.rows[0]); // Will contain your inserted rows

//              done();
//         });
//       }

//         purchaseremove.forEach(function(product, index) {
//           client.query('delete from public.workshop_sale_product_master where spm_id=$1',[product.spm_id]);
//         });

//         purchaseMultipleData.forEach(function(product, index) {
//           const va = client.query('update public.workshop_sale_product_master set spm_quantity=$1, spm_discount=$2, spm_netamt=$3 where spm_id=$4 ',[product.spm_quantity,purchaseSingleData.disper,product.netamt,product.spm_id]);
//         });

//         purchaseadd.forEach(function(product, index) {

//           client.query('INSERT INTO public.workshop_sale_product_master(spm_wsm_id, spm_pm_id, spm_quantity, spm_rate, spm_cgst, spm_sgst, spm_igst, spm_discount, spm_netamt)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[id,product.pm_id,product.btpm_quantity,product.btpm_price,product.pm_cgst,product.pm_sgst,product.pm_igst,purchaseSingleData.disper,product.netamt]);
              
//         });
        
//       client.query('COMMIT;');
//       done();
//         return res.json(results);
//     done(err);
//   });

// });

router.post('/edit/:wsmId', oauth.authorise(), (req, res, next) => {
  const id = req.params.wsmId;
  const results = [];
  const purchaseSingleData = req.body.purchaseSingleData;
  const purchaseMultipleData = req.body.purchaseMultipleData;
  // const purchaseadd = req.body.purchaseadd;
  const purchaseremove = req.body.purchaseremove;
  const purchaseUnsortMultipleData = req.body.purchaseUnsortMultipleData;
  // const purchaseUnsortadd = req.body.purchaseUnsortadd;
  const purchaseUnsortremove = req.body.purchaseUnsortremove;
  
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
      client.query('BEGIN;');
 
        var singleInsert = 'update public.workshop_sale_master set wsm_date=$1, wsm_exp_date=$2, wsm_buyer_no=$3, wsm_del_date=$4, wsm_comment=$5, wsm_wm_id=$6, wsm_updated_at=now()  where wsm_id=$7 RETURNING *',
            params = [purchaseSingleData.wsm_date,purchaseSingleData.wsm_exp_date,purchaseSingleData.wsm_buyer_no,purchaseSingleData.wsm_del_date,purchaseSingleData.wsm_comment,purchaseSingleData.wsm_wm.wm_id,id]
        client.query(singleInsert, params, function (error, result) {
            results.push(result.rows[0]); // Will contain your inserted rows
            console.log(results);
             done();
        });

        purchaseremove.forEach(function(product, index) {
          client.query('delete from public.workshop_sale_product_master where wspm_id=$1',[product.wspm_id]);
        });

        purchaseMultipleData.forEach(function(product, index) {
          const va = client.query('update public.workshop_sale_product_master set wspm_type=$1 where wspm_id=$2 ',[product.wspm_type,product.wspm_id]);
        });

         purchaseUnsortremove.forEach(function(product, index) {
          client.query('delete from public.workshop_sale_product_unsorted_master where wspum_id=$1',[product.wspum_id]);
        });

        purchaseUnsortMultipleData.forEach(function(product, index) {
          const va = client.query('update public.workshop_sale_product_unsorted_master set wspum_type=$1 where wspum_id=$2 ',[product.wspum_type,product.wspum_id]);
        });

      client.query('COMMIT;');
      done();
        return res.json(results);
    done(err);
  });
});


router.post('/delete/:wsmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.wsmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var singleInsert = 'UPDATE workshop_sale_master SET wsm_status=1 WHERE wsm_id=($1) RETURNING *',
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

router.post('/reopen/:wsmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.wsmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'UPDATE workshop_sale_master SET wsm_status=0 WHERE wsm_id=($1) RETURNING *',
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
    
    const query = client.query("SELECT * from workshop_sale_master where wsm_invoice_no LIKE ($1) and wsm_com_id=$2 order by wsm_id desc limit 1;",[req.body.fin_year,req.body.com_id]);

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

// router.post('/workshopsale/total', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
//     const str = req.body.search+"%";

//     const strqry =  "SELECT count(wsm.wsm_id) as total "+
//                     "FROM workshop_sale_master wsm "+
//                     "LEFT OUTER JOIN customer_master cm on wsm.wsm_cm_id = cm.cm_id "+
//                     "LEFT OUTER JOIN employee_master emp on wsm.wsm_emp_id=emp.emp_id "+
//                     "LEFT OUTER JOIN company_master com on wsm.wsm_com_id = com.com_id "+
//                     "where com.com_status=0 "+
//                     "and com.com_id=$1 "+
//                     "and LOWER(wsm_invoice_no||''||cm_name||''||wsm_amount ) LIKE LOWER($2) "+
//                     "and wsm.wsm_date between $3 and $4 ";

//     const query = client.query(strqry,[req.body.com_id, str, req.body.from, req.body.to]);
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

router.post('/workshopsale/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(wsm.wsm_id) as total "+
                    "FROM workshop_sale_master wsm "+
                    "LEFT OUTER JOIN sale_master sm on wsm.wsm_sm_id = sm.sm_id "+
                    "LEFT OUTER JOIN workshop_master wm on wsm.wsm_wm_id=wm.wm_id "+
                    "LEFT OUTER JOIN company_master com on wsm.wsm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(wsm_invoice_no) LIKE LOWER($2) "+
                    "and wsm.wsm_date between $3 and $4 ";

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

// router.post('/workshopsale/limit', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
//     const str = req.body.search+"%";

//     const strqry =  "SELECT * "+
//                     "FROM workshop_sale_master wsm "+
//                     "LEFT OUTER JOIN customer_master cm on wsm.wsm_cm_id = cm.cm_id "+
//                     "LEFT OUTER JOIN employee_master emp on wsm.wsm_emp_id=emp.emp_id "+
//                     "LEFT OUTER JOIN company_master com on wsm.wsm_com_id = com.com_id "+
//                     "where com.com_status=0 "+
//                     "and com.com_id=$1 "+
//                     "and LOWER(wsm_invoice_no||''||cm_name||''||wsm_amount ) LIKE LOWER($2) "+
//                     "and wsm.wsm_date between $3 and $4 "+
//                     "order by wsm.wsm_id desc LIMIT $5 OFFSET $6";

//     const query = client.query(strqry,[req.body.com_id, str, req.body.from, req.body.to, req.body.number, req.body.begin]);
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
router.post('/workshopsale/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM workshop_sale_master wsm "+
                   "LEFT OUTER JOIN sale_master sm on wsm.wsm_sm_id = sm.sm_id "+
                    "LEFT OUTER JOIN workshop_master wm on wsm.wsm_wm_id=wm.wm_id "+
                    "LEFT OUTER JOIN company_master com on wsm.wsm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(wsm_invoice_no) LIKE LOWER($2) "+
                    "and wsm.wsm_date between $3 and $4 "+
                    "order by wsm.wsm_id desc LIMIT $5 OFFSET $6";

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
                    "FROM workshop_sale_master wsm "+
                    "LEFT OUTER JOIN customer_master cm on wsm.wsm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on wsm.wsm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on wsm.wsm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and wsm.wsm_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(wsm_invoice_no ) LIKE LOWER($2) "+
                    "and wsm.wsm_date between $3 and $4 "+
                    "order by wsm.wsm_id desc LIMIT 16";

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
