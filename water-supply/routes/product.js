var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:productId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.productId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, pm_name as pm_search, cm.cm_serial_no||' '||cm.cm_name||' - '||cm.cm_address as cm_search "+
                    "FROM product_master pm "+
                    "LEFT OUTER JOIN customer_master cm on pm.pm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN company_master com on pm.pm_com_id = com.com_id "+
                    "where pm.pm_status=0 "+
                    "and com.com_status=0 "+
                    "and pm.pm_id=$1";

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

router.post('/checkname', oauth.authorise(), (req, res, next) => {
  const results = [];

  const productSingleData = req.body;

  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT * FROM product_master pm "+
                    // "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "LEFT OUTER JOIN company_master com on pm.pm_com_id = com.com_id "+
                    "where pm.pm_status=0 "+
                    "and com.com_status=0 "+
                    "and pm.pm_com_id=$1"+
                    "and LOWER(pm.pm_name) like LOWER($2)";
                    // "and pm.pm_um_id=$3";

    // SQL Query > Select Data
    const query = client.query(strqry,[productSingleData.pm_com_id,productSingleData.pm_name]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
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

   var singleInsert = 'INSERT INTO product_master(pm_name, pm_cm_id, pm_date, pm_qty_filled, pm_qty_empty, pm_emp_id, pm_com_id, pm_status) values($1,$2,$3,$4,$5,$6,$7,0) RETURNING *',
        params = [req.body.pm_name, req.body.pm_cm_id.cm_id,req.body.pm_date,req.body.pm_qty_filled,req.body.pm_qty_empty,req.body.user_emp_id,req.body.pm_com_id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        // done();
    });
    done(err);
    return res.json(results);
  });
});

router.post('/edit/:productId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.productId;

  // const productSingleData = req.body.productSingleData;
  // const productMultipleData = req.body.productMultipleData;
  // const productadd = req.body.productadd;
  // const productremove = req.body.productremove;

  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    // const quantity = productSingleData.pm_opening_quantity - productSingleData.old_pm_opening_quantity;

    var singleInsert = 'UPDATE product_master SET pm_date=$1, pm_qty_filled=$2, pm_qty_empty=$3,  pm_updated_at=now() where pm_id=$4 RETURNING *',
        params = [req.body.pm_date,req.body.pm_qty_filled,req.body.pm_qty_empty,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        
        
    });
    client.query('COMMIT;');
    done(err);
    return res.json(results);
  });
});

router.post('/delete/:productId', oauth.authorise(), (req, res, next) => {
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

    var singleInsert = 'update product_master set pm_status=1, pm_updated_at=now() where pm_id=$1 RETURNING *',
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

    const querystr =  "select * from (select abc.com_id, '' as invoice, 0 as idd, null as date, 'opening' as type,  "+
"CASE "+
"    WHEN sum(bal) >= 0 THEN sum(bal) "+
"    else 0 "+
"END AS purchase, "+
"CASE "+
"    WHEN sum(bal) < 0 THEN sum(bal) * '-1' "+
"    else 0 "+
"END AS sale, "+
" abc.pm_id from (select com_id, pm_id, sum(bal) as bal from product_opening_fin_year_mv where pm_id = $1 and fin_year < $2 group by com_id, pm_id "+
"union "+
"select foo.com_id, foo.pm_id, sum(foo.purchase - foo.sale) as bal  "+
"from (SELECT com.com_id, sum(ppm.ppm_quantity) AS purchase, (0) AS sale, pm.pm_id "+
"   FROM purchase_product_master ppm "+
"     left JOIN purchase_master prm ON ppm.ppm_prm_id = prm.prm_id "+
"     LEFT JOIN product_master pm ON ppm.ppm_pm_id = pm.pm_id "+
"     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND prm.prm_status = 0 AND pm.pm_status = 0  "+
"  and prm_date  "+
"  between "+
"  to_date(case WHEN to_char(to_date($3,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($4,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($5,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($6,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and pm_id = $7 "+
"  group by com.com_id,pm.pm_id  "+
"  union "+
" SELECT com.com_id, (0) AS purchase, sum(prpm.prpm_quantity) AS sale, pm.pm_id "+
"   FROM purchasereturn_product_master prpm "+
"     left JOIN purchasereturn_master prrm ON prpm.prpm_prrm_id = prrm.prrm_id "+
"     left JOIN product_master pm ON prpm.prpm_pm_id = pm.pm_id "+
"     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND pm.pm_status = 0  "+
"  and prrm_date  "+
"  between "+
"  to_date(case WHEN to_char(to_date($8,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($9,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($10,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($11,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and pm_id = $12 "+
"  group by com.com_id,pm.pm_id  "+
"  union "+
" SELECT com.com_id, sum(srpm.srpm_quantity) AS purchase, (0) AS sale, pm.pm_id "+
"   FROM salereturn_product_master srpm "+
"     left JOIN salereturn_master srm ON srpm.srpm_srm_id = srm.srm_id "+
"     LEFT JOIN product_master pm ON srpm.srpm_pm_id = pm.pm_id "+
"     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND srm.srm_status = 0 AND pm.pm_status = 0  "+
"  and srm_date   "+
"  between "+
"  to_date(case WHEN to_char(to_date($13,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($14,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($15,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($16,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and pm_id = $17 "+
"  group by com.com_id,pm.pm_id   "+
"  union "+
" SELECT com.com_id, (0) AS purchase, sum(spm.spm_quantity) AS sale, pm.pm_id "+
"   FROM sale_product_master spm "+
"     left JOIN sale_master sm ON spm.spm_sm_id = sm.sm_id "+
"     left JOIN product_master pm ON spm.spm_pm_id = pm.pm_id "+
"     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND sm.sm_status = 0 AND pm.pm_status = 0  "+
"  and sm_date   "+
"  between "+
"  to_date(case WHEN to_char(to_date($18,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
"  THEN (to_char(to_date($19,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
"  ELSE ((to_char(to_date($20,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
"  end,'yyyy-mm-dd') and  "+
"  to_date($21,'yyyy-MM-dd') - INTERVAL '1 day' "+
"  and pm_id = $22 "+
"  group by com.com_id,pm.pm_id ) as foo  "+
"  group by foo.com_id, foo.pm_id) as abc "+
"  group by abc.com_id, abc.pm_id "+
"  union "+
"SELECT com.com_id, prm_invoice_no as invoice, prm_id as idd, prm_date as date, 'purchase' as type, (ppm.ppm_quantity) AS purchase, (0) AS sale, pm.pm_id "+
"   FROM purchase_product_master ppm "+
"     left JOIN purchase_master prm ON ppm.ppm_prm_id = prm.prm_id "+
"     LEFT JOIN product_master pm ON ppm.ppm_pm_id = pm.pm_id "+
"     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND prm.prm_status = 0 AND pm.pm_status = 0  "+
"  and prm_date in (select date_actual from time_dimension where date_actual between $23 and $24)  and pm_id = $25 "+
"  union "+
" SELECT com.com_id, prrm_serial_no as invoice, prrm_id as idd, prrm_date as date,'purchase return' as type, (0) AS purchase, (prpm.prpm_quantity) AS sale, pm.pm_id "+
"   FROM purchasereturn_product_master prpm "+
"     left JOIN purchasereturn_master prrm ON prpm.prpm_prrm_id = prrm.prrm_id "+
"     left JOIN product_master pm ON prpm.prpm_pm_id = pm.pm_id "+
"     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND pm.pm_status = 0  "+
"  and prrm_date in (select date_actual from time_dimension where date_actual between $26 and $27)  and pm_id = $28 "+
"  union "+
" SELECT com.com_id, srm_invoice_no as invoice, srm_id as idd, srm_date as date, 'sale return' as type, (srpm.srpm_quantity) AS purchase, (0) AS sale, pm.pm_id "+
"   FROM salereturn_product_master srpm "+
"     left JOIN salereturn_master srm ON srpm.srpm_srm_id = srm.srm_id "+
"     LEFT JOIN product_master pm ON srpm.srpm_pm_id = pm.pm_id "+
"     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND srm.srm_status = 0 AND pm.pm_status = 0  "+
"  and srm_date in (select date_actual from time_dimension where date_actual between $29 and $30) and pm_id = $31 "+
"  union "+
" SELECT com.com_id, sm_invoice_no as invoice, sm_id as idd, sm_date as date, 'sale' as type, (0) AS purchase, (spm.spm_quantity) AS sale, pm.pm_id "+
"   FROM sale_product_master spm "+
"     left JOIN sale_master sm ON spm.spm_sm_id = sm.sm_id "+
"     left JOIN product_master pm ON spm.spm_pm_id = pm.pm_id "+
"     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id "+
"  WHERE com.com_status = 0 AND sm.sm_status = 0 AND pm.pm_status = 0  "+
"  and sm_date in (select date_actual from time_dimension where date_actual between $32 and $33) and pm_id = $34) as deb "+
"  order by deb.date desc";


    const query = client.query(querystr,[id,req.body.fin_prev_year,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id]);
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
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT count(pm.pm_id) as total "+
                    "FROM product_master pm "+
                    "LEFT OUTER JOIN employee_master emp on pm.pm_emp_id = emp.emp_id "+
                    "LEFT OUTER JOIN customer_master cm on pm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN company_master com on pm.pm_com_id = com.com_id "+
                    "where pm.pm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(cm_name||''||emp_name) LIKE LOWER($2);";

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

    const strqry =  "SELECT * FROM product_master pm "+
                    "LEFT OUTER JOIN employee_master emp on pm.pm_emp_id = emp.emp_id "+
                    "LEFT OUTER JOIN customer_master cm on pm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN company_master com on pm.pm_com_id = com.com_id "+
                    "where pm.pm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(cm_name||''||emp_name ) LIKE LOWER($2) "+
                    "order by pm.pm_id desc LIMIT $3 OFFSET $4";

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

router.post('/product/emp/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT count(pm.pm_id) as total "+
                    "FROM product_master pm "+
                    "LEFT OUTER JOIN employee_master emp on pm.pm_emp_id = emp.emp_id "+
                    "LEFT OUTER JOIN customer_master cm on pm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN company_master com on pm.pm_com_id = com.com_id "+
                    "where pm.pm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and pm.pm_emp_id=$2"+
                    "and LOWER(cm_name||''||emp_name) LIKE LOWER($3);";

    const query = client.query(strqry,[req.body.com_id, req.body.user_emp_id,str]);
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

router.post('/product/emp/limit', oauth.authorise(), (req, res, next) => {
  const results = [];

  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT * FROM product_master pm "+
                    "LEFT OUTER JOIN employee_master emp on pm.pm_emp_id = emp.emp_id "+
                    "LEFT OUTER JOIN customer_master cm on pm_cm_id = cm.cm_id "+
                    "LEFT OUTER JOIN company_master com on pm.pm_com_id = com.com_id "+
                    "where pm.pm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and pm.pm_emp_id=$2"+
                    "and LOWER(cm_name||''||emp_name ) LIKE LOWER($3) "+
                    "order by pm.pm_id desc LIMIT $4 OFFSET $5";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.com_id, req.body.user_emp_id, str, req.body.number, req.body.begin]);
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

    // const strqry =  "SELECT *, pm_name || ' ('|| um_name ||')' as pm_search FROM product_master pm "+
    //                 "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
    //                 "LEFT OUTER JOIN company_master com on pm.pm_com_id = com.com_id "+
    //                 "where pm.pm_status=0 "+
    //                 "and com.com_status=0 "+
    //                 "and com.com_id=$1 "+
    //                 "and LOWER(pm_name ) LIKE LOWER($2) "+
    //                 "order by pm.pm_id desc LIMIT 16";


    const strqry =  "SELECT *, ppm_code  as pm_search FROM purchase_product_master ppm "+
                    "LEFT OUTER JOIN product_master pm on ppm.ppm_pm_id = pm.pm_id "+
                    "LEFT OUTER JOIN unit_master um on pm.pm_um_id = um.um_id "+
                    "LEFT OUTER JOIN purchase_master prm on ppm.ppm_prm_id = prm.prm_id "+
                    "LEFT OUTER JOIN company_master com on prm.prm_com_id = com.com_id "+
                    "where prm.prm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(ppm_code ) LIKE LOWER($2) "+
                    "order by ppm.ppm_id desc LIMIT 16";

    // SQL Query > Select Data
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

router.post('/typeahead1/search', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT *, pm_name  FROM product_master ppm "+
                    "LEFT OUTER JOIN unit_master um on ppm.pm_um_id = um.um_id "+
                    // "LEFT OUTER JOIN purchase_master prm on ppm.ppm_prm_id = prm.prm_id "+
                    "LEFT OUTER JOIN company_master com on ppm.pm_com_id = com.com_id "+
                    "where ppm.pm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(pm_name ) LIKE LOWER($2) "+
                    "order by ppm.pm_id desc LIMIT 16";

    // SQL Query > Select Data
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

module.exports = router;
