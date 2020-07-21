var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');
var multer = require('multer');
var filenamestore = "";

var pool = new pg.Pool(config);

router.post('/:companyId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.companyId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM company_master where com_status=0 and com_id=$1',[id]);
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
    const query = client.query('SELECT * FROM company_master where com_status=0 and LOWER(com_name) like LOWER($1) and LOWER(com_contact) like LOWER($2) and LOWER(com_gst) like LOWER($3)',[req.body.com_name,req.body.com_contact,req.body.com_gst]);
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
  var Storage = multer.diskStorage({
      destination: function (req, file, callback) {
            callback(null, "./images/company"); //local
            // callback(null, "../nginx/html/pos/images"); //server
            
      },
      filename: function (req, file, callback) {
          var fi = file.fieldname + "_" + Date.now() + "_" + file.originalname;
          filenamestore = "../images/"+fi;
          callback(null, fi);
      }
  });

  var upload = multer({ storage: Storage }).array("imgUploader"); 
  
  upload(req, res, function (err) { 
    if (err) { 
        return res.end("Something went wrong!"+err); 
    } 
     pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    var singleInsert = 'INSERT INTO company_master(com_name, com_gst, com_address, com_state, com_city, com_pin, com_contact, com_email, com_is_composition, com_note, com_comment, com_file, com_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,0) RETURNING *',
        params = [req.body.com_name,req.body.com_gst,req.body.com_address,req.body.com_state,req.body.com_city,req.body.com_pin,req.body.com_contact,req.body.com_email,req.body.com_is_composition,req.body.com_note,req.body.com_comment,filenamestore]
    client.query(singleInsert, params, function (error, result) {

        results.push(result.rows[0]); // Will contain your inserted rows
        done();
        return res.json(results);
    });

    done(err);
  });
  });
  
});
// router.post('/add', oauth.authorise(), (req, res, next) => {
//   const results = [];
//   pool.connect(function(err, client, done){
//     if(err) {
//       done();
//       // pg.end();
//       console.log("the error is"+err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Insert Data
//     var singleInsert = 'INSERT INTO company_master(com_name, com_gst, com_address, com_state, com_city, com_pin, com_contact, com_email, com_is_composition, com_note, com_comment, com_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0) RETURNING *',
//         params = [req.body.com_name,req.body.com_gst,req.body.com_address,req.body.com_state,req.body.com_city,req.body.com_pin,req.body.com_contact,req.body.com_email,req.body.com_is_composition,req.body.com_note,req.body.com_comment]
//     client.query(singleInsert, params, function (error, result) {
//         // client.query('INSERT INTO cash_master(chm_amount, chm_opening_amount, chm_com_id) values(0,0,$1)',[result.rows[0].com_id]);
//         results.push(result.rows[0]); // Will contain your inserted rows
//         done();
//         return res.json(results);
//     });
//     done(err);
//   });
// });

router.post('/edit/:companyId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.companyId;
  var Storage = multer.diskStorage({
      destination: function (req, file, callback) {
          // callback(null, "./images");
            // callback(null, "./images/company"); //local
            callback(null, "../nginx/html/pos/images"); //server
            
      },
      filename: function (req, file, callback) {
          var fi = file.fieldname + "_" + Date.now() + "_" + file.originalname;
          filenamestore = "../images/"+fi;
          callback(null, fi);
      }
  });

  var upload = multer({ storage: Storage }).array("imgUploader"); 

  upload(req, res, function (err) { 
    if (err) { 
        return res.end("Something went wrong!"+err); 
    } 
    pool.connect(function(err, client, done){
      if(err) {
        done();
        console.log("the error is"+err);
        return res.status(500).json({success: false, data: err});
      }

      var singleInsert = 'update company_master set com_name=$1, com_gst=$2, com_address=$3, com_state=$4, com_city=$5, com_pin=$6, com_contact=$7, com_email=$8, com_note=$9, com_comment=$10, com_is_composition=$11, com_file=$12, com_updated_at=now() where com_id=$13 RETURNING *',
        params = [req.body.com_name,req.body.com_gst,req.body.com_address,req.body.com_state,req.body.com_city,req.body.com_pin,req.body.com_contact,req.body.com_email,req.body.com_note,req.body.com_comment,req.body.com_is_composition,filenamestore,id]
    
      // var singleInsert = 'update event_master set em_event_name=$1, em_timezone=$2, em_start_date=$3, em_event_desc=$4, em_end_date=$5, em_venue_name=$6, em_country=$7, em_state=$8, em_city=$9, em_twitter=$10, em_facebook=$11, em_file=$12, em_updated_at=now() where em_id=$13 RETURNING *',
      //   params = [req.body.em_event_name,req.body.em_timezone,req.body.em_start_date,req.body.em_event_desc,req.body.em_end_date,req.body.em_venue_name,req.body.em_country,req.body.em_state,req.body.em_city,req.body.em_twitter,req.body.em_facebook,filenamestore,id];
    console.log(params);

    client.query(singleInsert, params, function (error, result) {
        results.push(result.rows[0]); // Will contain your inserted rows
          done();
          return res.json(results);
      });
      done(err);
    });
  }); 
});

router.post('/delete/:companyId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.companyId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');

    var singleInsert = 'update company_master set com_status=1, com_updated_at=now() where com_id=$1 RETURNING *',
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

router.post('/company/total', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const str = "%"+req.body.search+"%";
    // const query = client.query('SELECT com_id,com_name,com_address,com_contact,com_email,com_gst,com_city,com_state,com_status,com_pin,com_is_composition,com_created_at,com_updated_at FROM company_master where com_status=0 and LOWER(com_name) like LOWER($1) and LOWER(com_contact) like LOWER($2) and LOWER(com_gst) like LOWER($3)',[req.body.com_name,req.body.com_contact,req.body.com_gst]);
    
    const query = client.query("SELECT count(com_id) as total from company_master where com_status=0 and LOWER(com_name||''||com_gst ) LIKE LOWER($1);",[str]);
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

router.post('/company/limit', oauth.authorise(), (req, res, next) => {
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
    const query = client.query("SELECT * from company_master where com_status=0 and LOWER(com_name||''||com_gst ) LIKE LOWER($1) order by com_id desc LIMIT $2 OFFSET $3",[str, req.body.number, req.body.begin]);
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