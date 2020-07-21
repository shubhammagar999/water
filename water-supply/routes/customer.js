var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:customerId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.customerId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT cm.*,com.*, cl.debit, cl.credit,cm.cm_name||''||cm.cm_address||''||cm.cm_mobile as cm_search "+
                    "FROM CUSTOMER_MASTER cm "+
                    "LEFT OUTER JOIN company_master com on cm.cm_com_id = com.com_id "+
                    "LEFT OUTER JOIN customer_list cl on cm.cm_id = cl.cm_id "+  
                    "where cm.cm_status = 0 "+
                    "and com.com_status=0 "+
                    "and cm.cm_id=$1";

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
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *, cm_name||''||cm_address||''||cm_mobile as cm_search "+
                    "FROM CUSTOMER_MASTER cm "+
                    "LEFT OUTER JOIN company_master com on cm.cm_com_id = com.com_id "+
                    "where cm.cm_status = 0 "+
                    "and com.com_status=0 "+
                    "and cm.cm_com_id=$1 "+
                    "and LOWER(cm.cm_name) like LOWER($2)"+
                    "and LOWER(cm.cm_mobile) like LOWER($3)"+
                    "and LOWER(cm.cm_gst_no) like LOWER($4)";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.cm_com_id,req.body.cm_name,req.body.cm_mobile,req.body.cm_gst_no]);
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

router.post('/checkserial', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT cm_serial_no, cm_id  "+
                    "FROM CUSTOMER_MASTER cm "+
                    "inner JOIN company_master com on cm.cm_com_id = com.com_id "+
                    "where cm.cm_status = 0 "+
                    "and com.com_status=0 "+
                    "and cm.cm_com_id=$1 "+
                    "and LOWER(cm.cm_serial_no) like LOWER($2)";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.cm_com_id,req.body.cm_serial_no]);
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

    var singleInsert = 'INSERT INTO customer_master(cm_name, cm_serial_no, cm_date, cm_gst_no, cm_address, cm_pin, cm_mobile, cm_email,  cm_balance, cm_debit, cm_opening_credit, cm_opening_debit, cm_prod_price_set, cm_com_id, cm_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,0) RETURNING *',
        params = [req.body.cm_name,req.body.cm_serial_no, req.body.cm_date,req.body.cm_gst_no,req.body.cm_address,req.body.cm_pin,req.body.cm_mobile,req.body.cm_email,req.body.cm_balance,req.body.cm_debit,req.body.cm_opening_credit,req.body.cm_opening_debit,req.body.cm_prod_price_set,req.body.cm_com_id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        return res.json(results);
    });

  done(err);
  });
});

router.post('/edit/:customerId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.customerId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    // const credit = req.body.cm_opening_credit - req.body.old_opening_credit;
    // const debit = req.body.cm_opening_debit - req.body.old_opening_debit;

 
    var singleInsert = 'UPDATE customer_master SET cm_name=$1, cm_serial_no=$2, cm_date=$3, cm_gst_no=$4, cm_address=$5, cm_pin=$6, cm_mobile=$7, cm_email=$8, cm_prod_price_set=$9,  cm_updated_at=now() where cm_id=$10 RETURNING *',
        params = [req.body.cm_name,req.body.cm_serial_no,req.body.cm_date,req.body.cm_gst_no,req.body.cm_address,req.body.cm_pin,req.body.cm_mobile,req.body.cm_email,req.body.cm_prod_price_set,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        client.query('COMMIT;');
        return res.json(results);
    });

  done(err);
  });
});

router.post('/delete/:customerId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.customerId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'update customer_master set cm_status=1, cm_updated_at=now() where cm_id=$1 RETURNING *',
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

    const querystr =  "select * from (select abc.com_id, 0 as idd, '' as invoice,null as date, 'opening' as type, 'credit' as ctype, "+
                      "CASE "+
                      "    WHEN sum(bal) >= 0 THEN sum(bal) "+
                      "    else 0 "+
                      "END AS debit, "+
                      "CASE "+
                      "    WHEN sum(bal) < 0 THEN sum(bal) * '-1' "+
                      "    else 0 "+
                      "END AS credit, "+
                      " abc.cm_id from (select com_id, cm_id, sum(bal) as bal from debtors_opening_fin_year_mv where cm_id = $1 and fin_year < $2 group by com_id, cm_id "+
                      "union "+
                      "select foo.com_id, foo.cm_id, sum(foo.debit - foo.credit) as bal "+
                      "from (SELECT com.com_id, sum(sm.sm_amount) AS debit, (0) AS credit, cm.cm_id "+
                      "   FROM sale_master sm "+
                      "     LEFT JOIN customer_master cm ON sm.sm_cm_id = cm.cm_id "+
                      "     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND sm.sm_status = 0 AND sm.sm_payment_mode::text = 'credit'::text AND cm.cm_status = 0 "+
                      "  and sm_date "+
                      "  between "+
                      "  to_date(case WHEN to_char(to_date($3,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
                      "  THEN (to_char(to_date($4,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
                      "  ELSE ((to_char(to_date($5,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
                      "  end,'yyyy-mm-dd') and  "+
                      "  to_date($6,'yyyy-MM-dd') - INTERVAL '1 day' "+
                      "  and cm_id = $7 "+
                      "  group by com.com_id,cm.cm_id "+
                      "  union "+
                      " SELECT com.com_id, (0) AS debit, sum(srm.srm_amount) AS credit, cm.cm_id "+
                      "   FROM salereturn_master srm "+
                      "     LEFT JOIN customer_master cm ON srm.srm_cm_id = cm.cm_id "+
                      "     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND srm.srm_status = 0 AND cm.cm_status = 0 "+
                      "  and srm_date  "+
                      "  between "+
                      "  to_date(case WHEN to_char(to_date($8,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
                      "  THEN (to_char(to_date($9,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
                      "  ELSE ((to_char(to_date($10,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
                      "  end,'yyyy-mm-dd') and  "+
                      "  to_date($11,'yyyy-MM-dd') - INTERVAL '1 day' "+
                      "  and cm_id = $12 "+
                      "  group by com.com_id,cm.cm_id "+
                      "  union "+
                      " SELECT com.com_id, (0) AS debit, sum(em.em_amount) AS credit, cm.cm_id "+
                      "   FROM expense_master em "+
                      "     LEFT JOIN customer_master cm ON em.em_cm_id = cm.cm_id "+
                      "     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND em.em_status = 0 AND cm.cm_status = 0 "+
                      " and em_date   "+
                      " between "+
                      " to_date(case WHEN to_char(to_date($13,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
                      " THEN (to_char(to_date($14,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
                      " ELSE ((to_char(to_date($15,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
                      " end,'yyyy-mm-dd') and  "+
                      " to_date($16,'yyyy-MM-dd') - INTERVAL '1 day' "+
                      " and cm_id = $17 "+
                      "group by com.com_id, cm.cm_id) as foo  "+
                      " group by foo.com_id, foo.cm_id) as abc "+
                      " group by abc.com_id, abc.cm_id "+
                      "  union  "+
                      "SELECT com.com_id, sm_id as idd, sm_invoice_no as invoice, sm_date as date, 'Sale' as type, sm_payment_mode as ctype, (sm.sm_amount) AS debit, (0) AS credit, cm.cm_id "+
                      "   FROM sale_master sm "+
                      "     LEFT JOIN customer_master cm ON sm.sm_cm_id = cm.cm_id "+
                      "     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND sm.sm_status = 0 AND sm.sm_payment_mode::text = 'credit'::text AND cm.cm_status = 0  "+
                      "  and sm_date in (select date_actual from time_dimension where date_actual between $18 and $19)  and cm_id = $20 "+
                      "  union "+
                      " SELECT com.com_id, srm_id as idd, srm_invoice_no as invoice, srm_date as date,'Return' as type, '' as ctype, (0) AS debit, (srm.srm_amount) AS credit, cm.cm_id "+
                      "   FROM salereturn_master srm "+
                      "     LEFT JOIN customer_master cm ON srm.srm_cm_id = cm.cm_id "+
                      "     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND srm.srm_status = 0 AND cm.cm_status = 0 "+
                      "  and srm_date in (select date_actual from time_dimension where date_actual between $21 and $22)  and cm_id = $23 "+
                      "  union "+
                      " SELECT com.com_id, em_id as idd, ''||em.em_id as invoice, em_date as date, 'Cashbook' as type, em_payment_mode as ctype, (0) AS debit, (em.em_amount) AS credit, cm.cm_id "+
                      "   FROM expense_master em "+
                      "     LEFT JOIN customer_master cm ON em.em_cm_id = cm.cm_id "+
                      "     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND em.em_status = 0 AND cm.cm_status = 0 "+
                      "  and em_date in (select date_actual from time_dimension where date_actual between $24 and $25) and cm_id = $26) as deb "+
                      "  order by deb.date desc";
    
    const query = client.query(querystr,[id,req.body.fin_prev_year,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.from,req.body.from,req.body.from,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id,req.body.from,req.body.to,id]);
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

router.post('/customer/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";

    const strqry =  "SELECT count(cm.cm_id) as total "+
                    "from customer_master cm "+
                    "LEFT OUTER JOIN company_master com on cm.cm_com_id = com.com_id "+
                    "where cm.cm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(cm_name||' '||cm_address||' '||cm_mobile||' '||cm_gst_no||' '||cm_serial_no) LIKE LOWER($2);";

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

router.post('/customer/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM CUSTOMER_MASTER cm "+
                    "LEFT OUTER JOIN company_master com on cm.cm_com_id = com.com_id "+
                    "where cm.cm_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(cm_name||' '||cm_address||' '||cm_mobile||' '||cm_gst_no||' '||cm_serial_no) LIKE LOWER($2) "+
                    "order by cm.cm_id desc LIMIT $3 OFFSET $4";

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

// CUSTOMER LIST FOR SEND SMS
router.post('/customer/sms', oauth.authorise(), (req, res, next) => {
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
                    "FROM CUSTOMER_MASTER cm "+
                    "LEFT OUTER JOIN company_master com on cm.cm_com_id = com.com_id "+
                    "where cm.cm_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(cm_name||''||cm_mobile) LIKE LOWER($2) "+
                    "order by cm.cm_id desc";

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

router.post('/typeahead/search', oauth.authorise(), (req, res, next) => {
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

    const strqry =  "SELECT *, cm_serial_no||' '||cm_name||' - '||cm_address as cm_search "+
                    "FROM CUSTOMER_MASTER cm "+
                    "LEFT OUTER JOIN company_master com on cm.cm_com_id = com.com_id "+
                    "where cm.cm_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(cm_serial_no||' '||cm_name||' '||cm_address||' '||cm_mobile||' '||cm_gst_no ) LIKE LOWER($2) "+
                    "order by cm.cm_id desc LIMIT 7";

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
