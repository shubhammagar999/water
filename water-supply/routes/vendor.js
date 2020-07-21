var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:vendorId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.vendorId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const strqry =  "SELECT *, vm_firm_name||' '||vm_address||' '||vm_mobile as vm_search "+
                    "FROM vendor_master vm "+
                    "LEFT OUTER JOIN company_master com on vm.vm_com_id = com.com_id "+
                    "where vm.vm_status=0 "+
                    "and com.com_status=0 "+
                    "and vm.vm_id=$1";
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

    // SQL Query > Select Data
    const strqry =  "SELECT *, vm_firm_name||' '||vm_address||' '||vm_mobile as vm_search "+
                    "FROM vendor_master vm "+
                    "LEFT OUTER JOIN company_master com on vm.vm_com_id = com.com_id "+
                    "where vm.vm_status=0 "+
                    "and com.com_status=0 "+
                    "and vm.vm_com_id=$1 "+
                    "and LOWER(vm.vm_firm_name) like LOWER($2)"+
                    "and LOWER(vm.vm_mobile) like LOWER($3)"+
                    "and LOWER(vm.vm_gst_no) like LOWER($4)";
    const query = client.query(strqry,[req.body.vm_com_id,req.body.vm_firm_name,req.body.vm_mobile,req.body.vm_gst_no]);
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

    var singleInsert = 'INSERT INTO vendor_master(vm_mobile, vm_address, vm_state, vm_city, vm_pin, vm_firm_name, vm_balance, vm_debit, vm_gst_no, vm_opening_credit, vm_opening_debit, vm_email_id, vm_com_id, vm_agent_name, vm_agent_mobile, vm_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,0) RETURNING *',
        params = [req.body.vm_mobile,req.body.vm_address,req.body.vm_state,req.body.vm_city,req.body.vm_pin,req.body.vm_firm_name,req.body.vm_opening_credit,req.body.vm_opening_debit,req.body.vm_gst_no,req.body.vm_opening_credit,req.body.vm_opening_debit,req.body.vm_email_id,req.body.vm_com_id,req.body.vm_agent_name,req.body.vm_agent_mobile]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        return res.json(results);
    });

    done(err);
  });
});

router.post('/edit/:vendorId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.vendorId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    const credit = req.body.vm_opening_credit - req.body.old_opening_credit;
    const debit = req.body.vm_opening_debit - req.body.old_opening_debit;

    var singleInsert = 'UPDATE vendor_master SET vm_mobile=$1, vm_address=$2, vm_firm_name=$3, vm_gst_no=$4, vm_balance=vm_balance+$5, vm_opening_credit=$6, vm_debit=vm_debit+$7, vm_opening_debit=$8, vm_email_id=$9, vm_state=$10, vm_city=$11, vm_pin=$12, vm_agent_name=$13, vm_agent_mobile=$14, vm_updated_at=now() where vm_id=$15 RETURNING *',
        params = [req.body.vm_mobile,req.body.vm_address,req.body.vm_firm_name,req.body.vm_gst_no,credit,req.body.vm_opening_credit,debit,req.body.vm_opening_debit,req.body.vm_email_id,req.body.vm_state,req.body.vm_city,req.body.vm_pin,req.body.vm_agent_name,req.body.vm_agent_mobile,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        client.query('COMMIT;');
        return res.json(results);
    });

    done(err);
  });
});

router.post('/delete/:vendorId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.vendorId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'update vendor_master set vm_status=1, vm_updated_at=now() where vm_id=$1 RETURNING *',
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

router.post('/details/:vmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.vmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "select * from (select abc.com_id, 0 as idd, '' as invoice,null as date, 'opening' as type, '' as ctype, "+
"CASE "+
"    WHEN sum(bal) < 0 THEN sum(bal) * '-1' "+
"    else 0 "+
"END AS debit, "+
"CASE "+
"    WHEN sum(bal) >= 0 THEN sum(bal) "+
"    else 0 "+
"END AS credit, "+
" abc.vm_id from (select com_id, vm_id, sum(bal) as bal from creditors_opening_fin_year_mv where vm_id = $1 and fin_year < $2 group by com_id, vm_id "+
"union "+
"select foo.com_id, foo.vm_id, sum(foo.credit - foo.debit) as bal  "+
"from (SELECT com.com_id, (0) AS debit, sum(prm.prm_amount) AS credit, vm.vm_id "+
"   FROM purchase_master prm "+
"     LEFT JOIN vendor_master vm ON prm.prm_vm_id = vm.vm_id "+
"     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND prm.prm_status = 0 AND prm.prm_credit::text = 'credit'::text AND vm.vm_status = 0  "+
"  and prm_date  "+
"  between "+
"  to_date(case WHEN to_char(to_date($3,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($4,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($5,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($6,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and vm_id = $7 "+
"  group by com.com_id,vm.vm_id "+
"  union "+
" SELECT com.com_id, sum(prrm.prrm_amount) AS debit, (0) AS credit, vm.vm_id "+
"   FROM purchasereturn_master prrm "+
"     LEFT JOIN vendor_master vm ON prrm.prrm_vm_id = vm.vm_id "+
"     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND vm.vm_status = 0 "+
"  and prrm_date  "+
"  between "+
"  to_date(case WHEN to_char(to_date($8,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($9,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($10,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($11,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and vm_id = $12 "+
"  group by com.com_id,vm.vm_id "+
"  union "+
" SELECT com.com_id, sum(em.em_amount) AS debit, (0) AS credit, vm.vm_id "+
"   FROM purexpense_master em "+
"     LEFT JOIN vendor_master vm ON em.em_vm_id = vm.vm_id "+
"     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND em.em_status = 0 AND vm.vm_status = 0 "+
"  and em_date   "+
"  between "+
"  to_date(case WHEN to_char(to_date($13,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($14,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($15,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($16,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and vm_id = $17 "+
"  group by com.com_id,vm.vm_id) as foo  "+
"  group by foo.com_id, foo.vm_id) as abc "+
"  group by abc.com_id, abc.vm_id "+
"  union "+
"  SELECT com.com_id, prm_id as idd, prm_invoice_no as invoice, prm_date as date, 'Purchase' as type, prm_credit as ctype, (0) AS debit, (prm.prm_amount) AS credit, vm.vm_id "+
"   FROM purchase_master prm "+
"     LEFT JOIN vendor_master vm ON prm.prm_vm_id = vm.vm_id "+
"     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND prm.prm_status = 0 AND prm.prm_credit::text = 'credit'::text AND prm.prm_status = 0  "+
"  and prm_date in (select date_actual from time_dimension where date_actual between $18 and $19)  and vm_id = $20 "+
"  union "+
" SELECT com.com_id, prrm_id as idd, prrm_serial_no as invoice, prrm_date as date,'Return' as type, '' as ctype, (prrm.prrm_amount) AS debit, (0) AS credit, vm.vm_id "+
"   FROM purchasereturn_master prrm "+
"     LEFT JOIN vendor_master vm ON prrm.prrm_vm_id = vm.vm_id "+
"     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND vm.vm_status = 0 "+
"  and prrm_date in (select date_actual from time_dimension where date_actual between $21 and $22)  and vm_id = $23 "+
"  union "+
" SELECT com.com_id, pem_id as idd, ''||em.pem_id as invoice, em_date as date, 'Cashbook' as type, em_payment_mode as ctype, (em.em_amount) AS debit, (0) AS credit, vm.vm_id "+
"   FROM purexpense_master em "+
"     LEFT JOIN vendor_master vm ON em.em_vm_id = vm.vm_id "+
"     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND em.em_status = 0 AND vm.vm_status = 0 "+
"  and em_date in (select date_actual from time_dimension where date_actual between $24 and $25) and vm_id = $26) as deb "+
"  order by deb.date desc"; 

    const query = client.query(strqry,[id,req.body.fin_prev_year,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id]);
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

router.post('/vendor/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(vm.vm_id) as total "+
                    "from vendor_master vm "+
                    "LEFT OUTER JOIN company_master com on vm.vm_com_id = com.com_id "+
                    "where vm.vm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ||''||vm_gst_no) LIKE LOWER($2);";

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

router.post('/vendor/limit', oauth.authorise(), (req, res, next) => {
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
                    "from vendor_master vm "+
                    "LEFT OUTER JOIN company_master com on vm.vm_com_id = com.com_id "+
                    "where vm.vm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ||''||vm_gst_no ) LIKE LOWER($2) "+
                    "order by vm.vm_id desc LIMIT $3 OFFSET $4";

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

    const strqry =  "SELECT *, vm_firm_name||' '||vm_address||' '||vm_mobile as vm_search "+
                    "from vendor_master vm "+
                    "LEFT OUTER JOIN company_master com on vm.vm_com_id = com.com_id "+
                    "where vm.vm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(vm_firm_name||''||vm_address||''||vm_mobile ) LIKE LOWER($2) "+
                    "order by vm.vm_id desc LIMIT 16";

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

module.exports = router;
