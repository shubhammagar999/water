var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.post('/dashadmin', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const str = "(SELECT count(sm.sm_id) as id, 'salereport' as type "+
                "FROM sale_master sm "+
                "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                "where com.com_status=0 "+
                "and sm.sm_status=0 "+
                "and sm.sm_date between $1 and $2 "+
                "and com.com_id=$3) union "+
                "(SELECT count(sm.sm_id) as id, 'paymentdatereport' as type "+
                "FROM sale_master sm "+
                "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                "where com.com_status=0 "+
                "and sm.sm_status=0 "+
                "and sm.sm_payment_mode='credit' "+
                "and sm.sm_balance_amount>0 "+
                "and sm.sm_date between $4 and $5 "+
                "and to_char(sm.sm_payment_date,'yyyymmdd') <= to_char(current_date + interval '6' day,'yyyymmdd') "+
                "and com.com_id=$6) union "+
                "(SELECT count(pem_id) as id, 'chequepaymentdatereport' as type "+
                "from purexpense_master em "+
                "LEFT OUTER JOIN vendor_master vm on em.em_vm_id = vm.vm_id "+
                "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                "where em.em_status=0 "+
                "and com.com_status=0 "+
                "and em.em_date between $7 and $8 "+
                "and com.com_id=$9 "+
                "and to_char(em.em_cheque_date,'yyyymmdd') <= to_char(current_date + interval '3' day,'yyyymmdd') ) union "+
                "(SELECT count(em_id) as id, 'chequereceivedatereport' as type "+
                "from EXPENSE_MASTER em "+
                "LEFT OUTER JOIN customer_master cm on em.em_cm_id = cm.cm_id "+
                "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                "where em.em_status=0 "+
                "and com.com_status=0 "+
                "and em.em_date between $10 and $11 "+
                "and com.com_id=$12 "+
                "and to_char(em.em_cheque_date,'yyyymmdd') <= to_char(current_date + interval '3' day,'yyyymmdd') ) union "+
                "(SELECT count(prm.prm_id) as id, 'purchasereport' as type "+
                "FROM purchase_master prm "+
                "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                "where com.com_status=0 "+
                "and prm.prm_status=0 "+
                "and prm.prm_date between $13 and $14 "+
                "and com.com_id=$15) union "+
                "(select cashinhand as id, 'cashreport' as type "+
                "from cash_in_hand "+
                "where com_id = $16) union "+
                "(SELECT count(sm.sm_id) as id, 'deliveryreport' as type "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and sm.sm_delivery_status=0 "+
                    "and com.com_id=$17 "+
                    "and sm.sm_del_check=1 "+
                    "and to_char(sm.sm_del_date,'yyyymmdd') = to_char(current_date,'yyyymmdd'))";
                // ""+
                // "(SELECT count(prm_id) as id, 'paymentdatereport' as type FROM purchase_master prm LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id where prm.prm_status = 0 and prm.prm_payment_date BETWEEN current_date AND current_date + interval '2' day) union "+
                // "(SELECT count(em_id) as id, 'chequereceivedatereport' as type FROM expense_master prm LEFT OUTER JOIN customer_master vm on prm.em_cm_id = vm.cm_id where prm.em_status = 0 and prm.em_cheque_date BETWEEN current_date AND current_date + interval '2' day) union "+
                // "(SELECT count(pem_id) as id, 'chequepaymentdatereport' as type FROM purexpense_master prm LEFT OUTER JOIN vendor_master vm on prm.em_vm_id = vm.vm_id where prm.em_status = 0 and prm.em_cheque_date BETWEEN current_date AND current_date + interval '2' day)";
    const query = client.query(str,[req.body.from, req.body.to, req.body.com_id, req.body.from, req.body.to, req.body.com_id, req.body.from, req.body.to, req.body.com_id, req.body.from, req.body.to, req.body.com_id, req.body.from, req.body.to, req.body.com_id, req.body.com_id, req.body.com_id]);
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

router.post('/salereport', oauth.authorise(), (req, res, next) => {
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
                    "and sm.sm_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount||' '||sm_bill_status) LIKE LOWER($2) "+
                    "and sm.sm_date BETWEEN $3 and $4 "+
                    "order by sm.sm_id desc";

    const query = client.query(strqry,[req.body.com_id, str, req.body.from_date, req.body.to_date]);
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

router.post('/salereport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT count(sm.sm_id) as total, sum(sm.sm_amount) as saletotal "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and com.com_id=$1 "+  
                    "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount|| ' '||sm_bill_status) LIKE LOWER($2) "+
                    "and sm_date BETWEEN $3 "+
                    "and $4 ";
    const query = client.query(strqry,[req.body.com_id,str,req.body.from_date,req.body.to_date]);
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

router.post('/salereport/limit', oauth.authorise(), (req, res, next) => {
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
                    "and sm.sm_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount||' '||sm_bill_status ) LIKE LOWER($2) "+
                    "and sm.sm_date BETWEEN $3 and $4 "+
                    "order by sm.sm_id desc LIMIT $5 OFFSET $6 ";

    const query = client.query(strqry,[req.body.com_id, str, req.body.from_date, req.body.to_date, req.body.number, req.body.begin]);
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

router.post('/purchasereport', oauth.authorise(), (req, res, next) => {
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
                    "and prm.prm_status=0 "+
                    "and LOWER(prm_invoice_no||''||vm_firm_name||''||prm_amount ) LIKE LOWER($2) "+
                    "and prm.prm_date BETWEEN $3 and $4 "+
                    "order by prm.prm_id desc";

    const query = client.query(strqry,[req.body.com_id, str, req.body.from_date, req.body.to_date]);
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

router.post('/purchasereport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(prm.prm_id) as total, sum(prm.prm_amount) as purchasetotal "+
                    "FROM purchase_master prm "+
                    "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and prm.prm_status=0 "+
                    "and LOWER(prm_invoice_no||''||vm_firm_name||''||prm_amount ) LIKE LOWER($2) "+
                    "and prm_date BETWEEN $3 "+
                    "and $4 ";

    const query = client.query(strqry,[req.body.com_id,str,req.body.from_date,req.body.to_date]);
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

router.post('/purchasereport/limit', oauth.authorise(), (req, res, next) => {
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
                    "and prm.prm_status=0 "+
                    "and LOWER(prm_invoice_no||''||vm_firm_name||''||prm_amount ) LIKE LOWER($2) "+
                    "and prm.prm_date BETWEEN $3 and $4 "+
                    "order by prm.prm_id desc LIMIT $5 OFFSET $6";

    const query = client.query(strqry,[req.body.com_id, str, req.body.from_date, req.body.to_date, req.body.number, req.body.begin]);
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

router.post('/paymentdatereport', oauth.authorise(), (req, res, next) => {
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
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and sm.sm_payment_mode='credit' "+
                    "and sm.sm_balance_amount>0 "+
                    "and to_char(sm.sm_payment_date,'yyyymmdd') <= to_char(current_date + interval '6' day,'yyyymmdd') "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||''||cm_name||''||sm_amount ) LIKE LOWER($2) "+
                    "and sm.sm_date between $3 and $4 "+
                    "order by sm.sm_payment_date asc ";

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

router.post('/paymentdatereport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(sm.sm_id) as total, sum(sm.sm_amount) as saletotal "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and sm.sm_payment_mode='credit' "+
                    "and sm.sm_balance_amount>0 "+
                    "and to_char(sm.sm_payment_date,'yyyymmdd') <= to_char(current_date + interval '6' day,'yyyymmdd') "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||''||cm_name||''||sm_amount ) LIKE LOWER($2) "+
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

router.post('/paymentdatereport/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and sm.sm_payment_mode='credit' "+
                    "and sm.sm_balance_amount>0 "+
                    "and to_char(sm.sm_payment_date,'yyyymmdd') <= to_char(current_date + interval '6' day,'yyyymmdd') "+
                    "and com.com_id=$1 "+
                    "and LOWER(sm_invoice_no||''||cm_name||''||sm_amount ) LIKE LOWER($2) "+
                    "and sm.sm_date between $3 and $4 "+
                    "order by sm.sm_payment_date asc LIMIT $5 OFFSET $6 ";

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

router.get('/balancesheetreport', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const querystr =  "(select spm.spm_id, spm.spm_quantity as quant,spm.spm_rate, ppm.ctm_purchase_rate,0 as debit,((((spm.spm_rate)-(spm.spm_rate*spm.spm_discount/100)) + ((((spm.spm_rate)-(spm.spm_rate*spm.spm_discount/100)))*((spm.spm_vat+spm.spm_sgst+spm.spm_igst)/100))) -(((ppm.ctm_purchase_rate) - (ppm.ctm_purchase_rate * ppm.ctm_discount/100))+(((ppm.ctm_purchase_rate) - (ppm.ctm_purchase_rate * ppm.ctm_discount/100)) * ppm.ctm_vat/100)+(((ppm.ctm_purchase_rate) - (ppm.ctm_purchase_rate * ppm.ctm_discount/100)) * ppm.ctm_sgst/100)+(((ppm.ctm_purchase_rate) - (ppm.ctm_purchase_rate * ppm.ctm_discount/100)) * ppm.ctm_igst/100))) as credit,'1' as num, sm.sm_date as date, 'income' as type from sale_product_master spm Left OUTER JOIN sale_master sm on spm.spm_sm_id = sm.sm_id LEFT OUTER JOIN category_master ppm on spm.spm_ctm_id = ppm.ctm_id) Union "+
                      // "(select srpm.srpm_id, srpm.srpm_quantity as quant, srpm.srpm_rate, 0,((srpm.srpm_rate)-(srpm.srpm_rate*srpm.srpm_discount/100)) as debit,0 as credit, '3' as num, srm.srm_date as date, 'return' as type from salereturn_product_master srpm Left OUTER JOIN salereturn_master srm on srpm.srpm_srm_id = srm.srm_id LEFT OUTER JOIN purchase_product_master ppm on srpm.srpm_ppm_id = ppm.ppm_id) Union "+
                      "(select dem_id,0,0,0,em_amount as debit,0 as credit,'2' as num, em_date as date, 'expense' as type from dailyexpense_master) order by date,num asc";
    
    const query = client.query(querystr);
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

router.get('/dailybalancereport', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const querystr =  "(select spm.spm_id, spm.spm_quantity as quant,spm.spm_rate, ppm.ctm_purchase_rate,0 as debit, (spm.spm_rate-ppm.ctm_purchase_rate) as credit,'1' as num, sm.sm_date as date, 'income' as type from sale_product_master spm Left OUTER JOIN sale_master sm on spm.spm_sm_id = sm.sm_id LEFT OUTER JOIN category_master ppm on spm.spm_ctm_id = ppm.ctm_id where sm.sm_date=current_date) Union"+
                      "(select dem_id,0,0,0,em_amount as debit,0 as credit,'2' as num, em_date as date, 'expense' as type from dailyexpense_master where em_date=current_date) order by date,num asc";
    
    const query = client.query(querystr);
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

router.post('/chequereceivedatereport', oauth.authorise(), (req, res, next) => {
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
                    "and to_char(em.em_cheque_date,'yyyymmdd') <= to_char(current_date + interval '3' day,'yyyymmdd') "+
                    "and LOWER(cm_name||''||cm_address||''||cm_mobile ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 "+
                    "order by em_cheque_date asc";

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

router.post('/chequereceivedatereport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";
                    

    const strqry =  "SELECT count(em_id) as total, sum(em.em_amount) as totalamount "+
                    "from EXPENSE_MASTER em "+
                    "LEFT OUTER JOIN customer_master cm on em.em_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and to_char(em.em_cheque_date,'yyyymmdd') <= to_char(current_date + interval '3' day,'yyyymmdd') "+
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

router.post('/chequereceivedatereport/limit', oauth.authorise(), (req, res, next) => {
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
                    "and to_char(em.em_cheque_date,'yyyymmdd') <= to_char(current_date + interval '3' day,'yyyymmdd') "+
                    "and LOWER(cm_name||''||cm_address||''||cm_mobile ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 "+
                    "order by em_cheque_date asc LIMIT $5 OFFSET $6";

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

router.post('/chequepaymentdatereport', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    var strqry =    "SELECT * "+
                    "from purexpense_master em "+
                    "LEFT OUTER JOIN vendor_master vm on em.em_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and to_char(em.em_cheque_date,'yyyymmdd') <= to_char(current_date + interval '3' day,'yyyymmdd') "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 "+
                    "order by em.em_cheque_date asc";
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

router.post('/chequepaymentdatereport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";
                    

    const strqry =  "SELECT count(pem_id) as total, sum(em.em_amount) as totalamount "+
                    "from purexpense_master em "+
                    "LEFT OUTER JOIN vendor_master vm on em.em_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and to_char(em.em_cheque_date,'yyyymmdd') <= to_char(current_date + interval '3' day,'yyyymmdd') "+
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

router.post('/chequepaymentdatereport/limit', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    var strqry =    "SELECT * "+
                    "from purexpense_master em "+
                    "LEFT OUTER JOIN vendor_master vm on em.em_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and to_char(em.em_cheque_date,'yyyymmdd') <= to_char(current_date + interval '3' day,'yyyymmdd') "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 "+
                    "order by em.em_cheque_date asc LIMIT $5 OFFSET $6";
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

router.get('/saledetails/:spmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.spmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query("SELECT * FROM sale_product_master spm LEFT OUTER JOIN sale_master sm on spm.spm_sm_id = sm.sm_id LEFT OUTER JOIN category_master ppm on spm.spm_ctm_id = ppm.ctm_id where sm.sm_status = 0 and spm.spm_id=$1",[id]);
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

router.get('/productlistdetails', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.spmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query("SELECT * FROM sale_product_master spm LEFT OUTER JOIN sale_master sm on spm.spm_sm_id = sm.sm_id LEFT OUTER JOIN category_master ppm on spm.spm_ctm_id = ppm.ctm_id where sm.sm_status = 0 and spm.spm_id=$1",[id]);
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

router.get('/productsalecount', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.spmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const str = "select sale.spm_ctm_id,sale.sm_date,ctm.ctm_type,COALESCE(sale.qty,0) as sale_qty,return.srm_date,COALESCE(return.qty,0) as return_qty, "+
                "(COALESCE(sale.qty,0)-COALESCE(return.qty,0)) as total_qty, "+
                "COALESCE(sale.rate,0) as sale_rate,COALESCE(return.rate,0) as return_rate, "+
                "(COALESCE(sale.rate,0)-COALESCE(return.rate,0)) as total_sale from sale_summary_view sale "+
                "left outer join salereturn_summary_view return on sale.spm_ctm_id = return.srpm_ctm_id "+
                "inner join category_master ctm on sale.spm_ctm_id = ctm.ctm_id "+
                // "where sale.sm_date = $1 "+
                "order by 2 desc";
    const query = client.query(str);
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

router.post('/gstreport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "select sum(sm_amount-sm_cgst-sm_sgst-sm_igst+sm_discount-sm_other_charges)::double precision as netamount,  sum(sm_cgst)::double precision as cgstamount, sum(sm_sgst)::double precision as sgstamount, sum(sm_igst)::double precision as igstamount, sum(sm_cgst + sm_sgst + sm_igst)::double precision as totalgst "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and com.com_id=$1 "+
                    "and sm_date BETWEEN $2 "+
                    "and $3 ";
    const query = client.query(strqry,[req.body.com_id,req.body.from_date,req.body.to_date]);
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

router.post('/vendorreport', oauth.authorise(), (req, res, next) => {
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
                    "FROM vendor_list "+
                    "where com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) ";

    const query = client.query(strqry,[req.body.com_id, str]);
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

router.post('/vendorreport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(vm_id) as total, sum(credit - debit) as saletotal "+
                    "FROM vendor_list "+
                    "where com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) ";
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

router.post('/vendorreport/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM vendor_list "+
                    "where com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) "+
                    "order by vm_id desc LIMIT $3 OFFSET $4 ";

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

router.post('/vendorreport/typeahead/search', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT * ,vm_firm_name||' '||vm_address||' '||vm_mobile as vm_search "+
                    "FROM vendor_list "+
                    "where com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) "+
                    "order by vm_id desc LIMIT $3 OFFSET $4 ";

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

router.post('/customerreport', oauth.authorise(), (req, res, next) => {
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
                    "FROM customer_list "+
                    "where comid=$1 "+
                    "and LOWER(cm_name||' '||cm_address||' '||cm_mobile||' '||cm_gst_no ) LIKE LOWER($2) ";

    const query = client.query(strqry,[req.body.com_id, str]);
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

router.post('/customerreport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(cm_id) as total, sum(debit - credit) as saletotal "+
                    "FROM customer_list "+
                    "where comid=$1 "+
                    "and LOWER(cm_name||' '||cm_address||' '||cm_mobile||' '||cm_gst_no ) LIKE LOWER($2) ";
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

router.post('/customerreport/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM customer_list "+
                    "where comid=$1 "+
                    "and LOWER(cm_name||' '||cm_address||' '||cm_mobile||' '||cm_gst_no ) LIKE LOWER($2) "+
                    "order by cm_id desc LIMIT $3 OFFSET $4 ";

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


router.post('/customerreport/typeahead/search', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT * ,cm_name||' '||cm_address||' '||cm_mobile as cm_search "+
                    "FROM customer_list "+
                    "where comid=$1 "+
                    "and LOWER(cm_name||' '||cm_address||' '||cm_mobile||' '||cm_gst_no ) LIKE LOWER($2) "+
                    "order by cm_id desc LIMIT $3 OFFSET $4 ";

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
// router.post('/customerreport/typeahead/search', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
//     const str = req.body.search+"%";

//     const strqry =  "SELECT *,cm_name||' '||cm_address||' '||cm_mobile ' ' ||cm_gst_no as cm_search  "+
//                     "FROM customer_list "+
//                     "where com_id=$1 "+
//                     "and LOWER(cm_name||''||cm_address||''||cm_mobile||''||cm_gst_no ) LIKE LOWER($2) "+
//                     "order by cm_id desc LIMIT $3 OFFSET $4 ";


//     const query = client.query(strqry,[req.body.com_id, str, req.body.number, req.body.begin]);
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

router.post('/productreport', oauth.authorise(), (req, res, next) => {
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
                    "FROM product_list "+
                    "where com_id=$1 "+
                    "and LOWER(pm_name ) LIKE LOWER($2) ";

    const query = client.query(strqry,[req.body.com_id, str]);
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

router.post('/productreport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(pm_id) as total "+
                    "FROM product_list "+
                    "where com_id=$1 "+
                    "and LOWER(pm_name ) LIKE LOWER($2) ";
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

router.post('/productreport/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM product_list "+
                    "where com_id=$1 "+
                    "and LOWER(pm_name ) LIKE LOWER($2) "+
                    "order by pm_id desc LIMIT $3 OFFSET $4 ";

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

router.post('/bankreport', oauth.authorise(), (req, res, next) => {
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
                    "FROM bank_list "+
                    "where com_id=$1 "+
                    "and LOWER(bkm_name||''||bkm_account_no ) LIKE LOWER($2) ";

    const query = client.query(strqry,[req.body.com_id, str]);
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

router.post('/bankreport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(bkm_id) as total, sum(balance) as totalvalue "+
                    "FROM bank_list "+
                    "where com_id=$1 "+
                    "and LOWER(bkm_name||''||bkm_account_no ) LIKE LOWER($2) ";
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

router.post('/bankreport/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM bank_list "+
                    "where com_id=$1 "+
                    "and LOWER(bkm_name||''||bkm_account_no ) LIKE LOWER($2) "+
                    "order by bkm_id desc LIMIT $3 OFFSET $4 ";

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


router.post('/expensereport/list', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT etm.etm_id,etm.etm_type, sum(em_amount) as valueamt "+
                    "FROM dailyexpense_master em "+
                    "LEFT OUTER JOIN bank_master bkm on em.em_bkm_id = bkm.bkm_id "+
                    "LEFT OUTER JOIN expense_type_master etm on em.em_etm_id = etm.etm_id "+
                    "LEFT OUTER JOIN company_master com on em.em_com_id = com.com_id "+
                    "where em.em_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(em_payment_mode ) LIKE LOWER($2) "+
                    "and em.em_date between $3 and $4 "+

                    "group by etm.etm_id,etm.etm_type ";
                    // "order by em.dem_id desc LIMIT $5 OFFSET $6";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.com_id,str, req.body.from_date, req.body.to_date]);
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

router.post('/purchasereport/list', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT prm.prm_id, prm.prm_credit, prm.prm_amount "+
                    "FROM purchase_master prm "+
                    "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and prm.prm_date between $2 and $3 ";

    // const strqry =  "SELECT * prm.prm_id,'credit' as type, sum(prm_amount) as valueamt  "+
    //                 "FROM purchase_master prm "+
    //                 "LEFT OUTER JOIN vendor_master vm on prm.prm_vm_id = vm.vm_id "+
    //                 "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
    //                 "where com.com_status=0 "+
    //                 "and com.com_id=$1 "+
    //                 "and prm_credit='credit' "+
    //                 "union "+
    //                 "and prm.prm_date between $3 and $4 "+

    //                 "group by prm.prm_id ";

                 // "order by prm.prm_id desc LIMIT $5 OFFSET $6";

    const query = client.query(strqry,[req.body.com_id, req.body.from_date, req.body.to_date]);
    // const query = client.query(strqry,[req.body.com_id, str, req.body.from, req.body.to, req.body.number, req.body.begin]);
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


router.post('/deliveryreport/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(sm.sm_id) as total, sum(sm.sm_amount) as saletotal "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and sm.sm_delivery_status=0 "+
                    "and com.com_id=$1 "+
                    "and sm.sm_del_check=1 "+
                    
                    // "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount ) LIKE LOWER($2) "+
                    // "and sm_date BETWEEN $3 "+
                    // "and $4 ";
                    "and to_char(sm.sm_del_date,'yyyymmdd') <= to_char(current_date + interval '6' day,'yyyymmdd')";
                    // "and to_char(sm_del_date,'yyyymmdd') <= to_char(current_date + interval '2' day,'yyyymmdd') ";
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

router.post('/deliveryreport/limit', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT *, "+
                    "CASE WHEN sm.sm_del_date < current_date THEN 'bg-danger' "+
                    "WHEN sm.sm_del_date = current_date THEN 'bg-warning' "+
                    "ELSE 'bg-success' END as cssclass "+
                    "FROM sale_master sm "+
                    "LEFT OUTER JOIN customer_master cm on sm.sm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN employee_master emp on sm.sm_emp_id=emp.emp_id "+
                    "LEFT OUTER JOIN company_master com on sm.sm_com_id = com.com_id "+
                    "where com.com_status=0 "+
                    "and sm.sm_status=0 "+
                    "and sm.sm_delivery_status=0 "+
                    "and com.com_id=$1 "+
                    "and sm.sm_del_check=1 "+
                    // "and LOWER(sm_invoice_no||' '||cm_name||' '||sm_amount ) LIKE LOWER($2) "+
                    "and to_char(sm.sm_del_date,'yyyymmdd') <= to_char(current_date + interval '6' day,'yyyymmdd') "+
                    
                    // "and to_char(sm.sm_del_date,'yyyymmdd') < to_char(current_date + interval '2' day,'yyyymmdd') ";
                    "order by sm.sm_del_date desc LIMIT $2 OFFSET $3 ";

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



router.post('/delivery', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    var singleInsert = "INSERT INTO expense_master(em_cm_id, em_date, em_received_by, em_comment, em_payment_mode, em_amount, em_com_id, em_status) values($1,current_date,'N/A',$2,'Cash',$3,$4,0) RETURNING *",
        params = [req.body.cm_id,req.body.sm_comment,req.body.sm_balance_amt,req.body.com_id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows

        client.query('UPDATE sale_master SET sm_balance_amt = 0, sm_delivery_status=1 WHERE sm_id=($1)',[req.body.sm_id]);
        client.query('insert into expense_sale_master (esm_em_id, esm_sm_id, esm_amount) values ($1,$2,$3)',[result.rows[0].em_id,req.body.sm_id,req.body.sm_balance_amt]);

        client.query('COMMIT;');
        done();
        return res.json(results);
    });

    done(err);
  });
});

module.exports = router;


