var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/:workshopId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.workshopId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    const strqry =  "SELECT *,wm_name||''||wm_address||''||wm_mobile as wm_search "+
                    "FROM workshop_master wm "+
                    "LEFT OUTER JOIN company_master com on wm.wm_com_id = com.com_id "+
                    "where wm.wm_status = 0 "+
                    "and com.com_status=0 "+
                    "and wm.wm_id=$1";

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

    const strqry =  "SELECT *, wm_name||''||wm_address||''||wm_mobile as wm_search "+
                    "FROM workshop_master wm "+
                    "LEFT OUTER JOIN company_master com on wm.wm_com_id = com.com_id "+
                    "where wm.wm_status = 0 "+
                    "and com.com_status=0 "+
                    "and wm.wm_com_id=$1 "+
                    "and LOWER(wm.wm_name) like LOWER($2)"+
                    "and LOWER(wm.wm_mobile) like LOWER($3)"+
                    "and LOWER(wm.wm_gst_no) like LOWER($4)";

    // SQL Query > Select Data
    const query = client.query(strqry,[req.body.wm_com_id,req.body.wm_name,req.body.wm_mobile,req.body.wm_gst_no]);
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

    var singleInsert = 'INSERT INTO workshop_master(wm_name, wm_mobile, wm_address, wm_state, wm_city, wm_pin, wm_balance, wm_debit, wm_email, wm_gst_no, wm_opening_credit, wm_opening_debit, wm_del_address, wm_del_state, wm_del_city, wm_del_pin, wm_com_id, wm_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,0) RETURNING *',
        params = [req.body.wm_name,req.body.wm_mobile,req.body.wm_address,req.body.wm_state,req.body.wm_city,req.body.wm_pin,req.body.wm_opening_credit,req.body.wm_opening_debit,req.body.wm_email,req.body.wm_gst_no,req.body.wm_opening_credit,req.body.wm_opening_debit,req.body.wm_del_address,req.body.wm_del_state,req.body.wm_del_city,req.body.wm_del_pin,req.body.wm_com_id]
   
        //     var singleInsert = 'INSERT INTO workshop_master(wm_name, wm_mobile, wm_address, wm_status, wm_balance, wm_debit, wm_email, wm_gst_no, wm_opening_credit, wm_opening_debit, wm_state, wm_city, wm_pin, wm_com_id, wm_del_address, wm_del_state, wm_del_city, wm_del_pin) values($1,$2,$3,0,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *',
        // params = [req.body.wm_name,req.body.wm_mobile,req.body.wm_address,req.body.wm_opening_credit,req.body.wm_opening_debit,req.body.wm_email,req.body.wm_gst_no,req.body.wm_opening_credit,req.body.wm_opening_debit, req.body.wm_state,req.body.wm_city,req.body.wm_pin, req.body.wm_com_id, req.body.wm_del_address,req.body.wm_del_state,req.body.wm_del_city,req.body.wm_del_pin]

    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        return res.json(results);
    });

  done(err);
  });
});

router.post('/edit/:workshopId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.workshopId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('BEGIN;');

    const credit = req.body.wm_opening_credit - req.body.old_opening_credit;
    const debit = req.body.wm_opening_debit - req.body.old_opening_debit;

    var singleInsert = 'UPDATE workshop_master SET wm_name=$1, wm_mobile=$2, wm_address=$3, wm_email=$4, wm_balance=wm_balance+$5, wm_opening_credit=$6, wm_debit=wm_debit+$7, wm_opening_debit=$8, wm_gst_no=$9, wm_state=$10, wm_city=$11, wm_pin=$12, wm_del_address=$13, wm_del_state=$14, wm_del_city=$15, wm_del_pin=$16, wm_updated_at=now() where wm_id=$17 RETURNING *',
        params = [req.body.wm_name,req.body.wm_mobile,req.body.wm_address,req.body.wm_email,credit,req.body.wm_opening_credit,debit,req.body.wm_opening_debit,req.body.wm_gst_no,req.body.wm_state,req.body.wm_city,req.body.wm_pin,req.body.wm_del_address,req.body.wm_del_state,req.body.wm_del_city,req.body.wm_del_pin,id]
    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        client.query('COMMIT;');
        return res.json(results);
    });

  done(err);
  });
});

router.post('/delete/:workshopId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.workshopId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'update workshop_master set wm_status=1, wm_updated_at=now() where wm_id=$1 RETURNING *',
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
                      " abc.wm_id from (select com_id, wm_id, sum(bal) as bal from debtors_opening_fin_year_mv where wm_id = $1 and fin_year < $2 group by com_id, wm_id "+
                      "union "+
                      "select foo.com_id, foo.wm_id, sum(foo.debit - foo.credit) as bal "+
                      "from (SELECT com.com_id, sum(sm.sm_amount) AS debit, (0) AS credit, wm.wm_id "+
                      "   FROM sale_master sm "+
                      "     LEFT JOIN workshop_master wm ON sm.sm_wm_id = wm.wm_id "+
                      "     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND sm.sm_status = 0 AND sm.sm_payment_mode::text = 'credit'::text AND wm.wm_status = 0 "+
                      "  and sm_date "+
                      "  between "+
                      "  to_date(case WHEN to_char(to_date($3,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
                      "  THEN (to_char(to_date($4,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
                      "  ELSE ((to_char(to_date($5,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
                      "  end,'yyyy-mm-dd') and  "+
                      "  to_date($6,'yyyy-MM-dd') - INTERVAL '1 day' "+
                      "  and wm_id = $7 "+
                      "  group by com.com_id,wm.wm_id "+
                      "  union "+
                      " SELECT com.com_id, (0) AS debit, sum(srm.srm_amount) AS credit, wm.wm_id "+
                      "   FROM salereturn_master srm "+
                      "     LEFT JOIN workshop_master wm ON srm.srm_wm_id = wm.wm_id "+
                      "     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND srm.srm_status = 0 AND wm.wm_status = 0 "+
                      "  and srm_date  "+
                      "  between "+
                      "  to_date(case WHEN to_char(to_date($8,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
                      "  THEN (to_char(to_date($9,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
                      "  ELSE ((to_char(to_date($10,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
                      "  end,'yyyy-mm-dd') and  "+
                      "  to_date($11,'yyyy-MM-dd') - INTERVAL '1 day' "+
                      "  and wm_id = $12 "+
                      "  group by com.com_id,wm.wm_id "+
                      "  union "+
                      " SELECT com.com_id, (0) AS debit, sum(em.em_amount) AS credit, wm.wm_id "+
                      "   FROM expense_master em "+
                      "     LEFT JOIN workshop_master wm ON em.em_wm_id = wm.wm_id "+
                      "     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND em.em_status = 0 AND wm.wm_status = 0 "+
                      " and em_date   "+
                      " between "+
                      " to_date(case WHEN to_char(to_date($13,'yyyy-MM-dd'), 'mm'::text)::integer > 3  "+
                      " THEN (to_char(to_date($14,'yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text) "+
                      " ELSE ((to_char(to_date($15,'yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text) "+
                      " end,'yyyy-mm-dd') and  "+
                      " to_date($16,'yyyy-MM-dd') - INTERVAL '1 day' "+
                      " and wm_id = $17 "+
                      "group by com.com_id, wm.wm_id) as foo  "+
                      " group by foo.com_id, foo.wm_id) as abc "+
                      " group by abc.com_id, abc.wm_id "+
                      "  union  "+
                      "SELECT com.com_id, sm_id as idd, sm_invoice_no as invoice, sm_date as date, 'Sale' as type, sm_payment_mode as ctype, (sm.sm_amount) AS debit, (0) AS credit, wm.wm_id "+
                      "   FROM sale_master sm "+
                      "     LEFT JOIN workshop_master wm ON sm.sm_wm_id = wm.wm_id "+
                      "     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND sm.sm_status = 0 AND sm.sm_payment_mode::text = 'credit'::text AND wm.wm_status = 0  "+
                      "  and sm_date in (select date_actual from time_dimension where date_actual between $18 and $19)  and wm_id = $20 "+
                      "  union "+
                      " SELECT com.com_id, srm_id as idd, srm_invoice_no as invoice, srm_date as date,'Return' as type, '' as ctype, (0) AS debit, (srm.srm_amount) AS credit, wm.wm_id "+
                      "   FROM salereturn_master srm "+
                      "     LEFT JOIN workshop_master wm ON srm.srm_wm_id = wm.wm_id "+
                      "     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND srm.srm_status = 0 AND wm.wm_status = 0 "+
                      "  and srm_date in (select date_actual from time_dimension where date_actual between $21 and $22)  and wm_id = $23 "+
                      "  union "+
                      " SELECT com.com_id, em_id as idd, ''||em.em_id as invoice, em_date as date, 'Cashbook' as type, em_payment_mode as ctype, (0) AS debit, (em.em_amount) AS credit, wm.wm_id "+
                      "   FROM expense_master em "+
                      "     LEFT JOIN workshop_master wm ON em.em_wm_id = wm.wm_id "+
                      "     LEFT JOIN company_master com ON em.em_com_id = com.com_id "+
                      "  WHERE com.com_status = 0 AND em.em_status = 0 AND wm.wm_status = 0 "+
                      "  and em_date in (select date_actual from time_dimension where date_actual between $24 and $25) and wm_id = $26) as deb "+
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

router.post('/workshop/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = req.body.search+"%";

    const strqry =  "SELECT count(wm.wm_id) as total "+
                    "from workshop_master wm "+
                    "LEFT OUTER JOIN company_master com on wm.wm_com_id = com.com_id "+
                    "where wm.wm_status=0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(wm_name||''||wm_address||''||wm_mobile||''||wm_gst_no ) LIKE LOWER($2);";

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

router.post('/workshop/limit', oauth.authorise(), (req, res, next) => {
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
                    "FROM workshop_master wm "+
                    "LEFT OUTER JOIN company_master com on wm.wm_com_id = com.com_id "+
                    "where wm.wm_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(wm_name||''||wm_address||''||wm_mobile||''||wm_gst_no ) LIKE LOWER($2) "+
                    "order by wm.wm_id desc LIMIT $3 OFFSET $4";

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

    const strqry =  "SELECT *, wm_name||''||wm_address||''||wm_mobile as wm_search "+
                    "FROM workshop_master wm "+
                    "LEFT OUTER JOIN company_master com on wm.wm_com_id = com.com_id "+
                    "where wm.wm_status = 0 "+
                    "and com.com_status=0 "+
                    "and com.com_id=$1 "+
                    "and LOWER(wm_name||' '||wm_address||' '||wm_mobile||' '||wm_gst_no ) LIKE LOWER($2) "+
                    "order by wm.wm_id desc LIMIT 16";

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
