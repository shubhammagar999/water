select * from (select abc.com_id, 0 as idd, null as date, 'opening' as type, 
CASE
    WHEN sum(bal) >= 0 THEN sum(bal)
    else 0
END AS deposit,
CASE
    WHEN sum(bal) < 0 THEN sum(bal) * '-1'
    else 0
END AS withdraw,
 abc.bkm_id from (select com_id, bkm_id, sum(bal) as bal from bank_opening_fin_year_mv where bkm_id = 9 and fin_year < '2018-2019' group by com_id, bkm_id
union
select foo.com_id, foo.bkm_id, sum(foo.deposit - foo.withdraw) as bal 
from (SELECT com.com_id, sum(ctm.ctm_amount) AS deposit, (0) AS withdraw, bkm.bkm_id
   FROM cashtransfer_master ctm
     LEFT JOIN bank_master bkm ON ctm.ctm_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON ctm.ctm_com_id = com.com_id
  WHERE com.com_status = 0 AND ctm.ctm_status = 0 AND bkm.bkm_status = 0 
  and ctm_date 
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and bkm_id = 9
  group by com.com_id,bkm.bkm_id 
  union
 SELECT com.com_id, (0) AS deposit, sum(bwm.bwm_amount) AS withdraw, bkm.bkm_id
   FROM bankwithdraw_master bwm
     LEFT JOIN bank_master bkm ON bwm.bwm_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON bwm.bwm_com_id = com.com_id
  WHERE com.com_status = 0 AND bwm.bwm_status = 0 AND bkm.bkm_status = 0
  and bwm_date 
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and bkm_id = 9
  group by com.com_id,bkm.bkm_id 
  union
 SELECT com.com_id, sum(em.em_amount) AS deposit, (0) AS withdraw, bkm.bkm_id
   FROM expense_master em
     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0
  and em_date  
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and bkm_id = 9
  group by com.com_id,bkm.bkm_id  
  union
 SELECT com.com_id, (0) AS deposit, sum(em.em_amount) AS withdraw, bkm.bkm_id
   FROM purexpense_master em
     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0
  and em_date  
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and bkm_id = 9
  group by com.com_id,bkm.bkm_id   
  union
 SELECT com.com_id, (0) AS deposit, sum(em.em_amount) AS withdraw, bkm.bkm_id
   FROM dailyexpense_master em
     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0
  and em_date  
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and bkm_id = 9
  group by com.com_id,bkm.bkm_id ) as foo 
  group by foo.com_id, foo.bkm_id) as abc
  group by abc.com_id, abc.bkm_id

  union
  
SELECT com.com_id, ctm_id as idd, ctm_date as date, 'Cashtransfer' as type, (ctm.ctm_amount) AS deposit, (0) AS withdraw, bkm.bkm_id
   FROM cashtransfer_master ctm
     LEFT JOIN bank_master bkm ON ctm.ctm_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON ctm.ctm_com_id = com.com_id
  WHERE com.com_status = 0 AND ctm.ctm_status = 0 AND bkm.bkm_status = 0 
  and ctm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01')  and bkm_id = 9
  union
 SELECT com.com_id, bwm_id as idd, bwm_date as date,'bankwithdraw' as type, (0) AS deposit, (bwm.bwm_amount) AS withdraw, bkm.bkm_id
   FROM bankwithdraw_master bwm
     LEFT JOIN bank_master bkm ON bwm.bwm_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON bwm.bwm_com_id = com.com_id
  WHERE com.com_status = 0 AND bwm.bwm_status = 0 AND bkm.bkm_status = 0
  and bwm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01')  and bkm_id = 9
  union
 SELECT com.com_id, em_id as idd, em_date as date, 'DebtorsCashbook' as type, (em.em_amount) AS deposit, (0) AS withdraw, bkm.bkm_id
   FROM expense_master em
     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0
  and em_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01') and bkm_id = 9
  union
 SELECT com.com_id, pem_id as idd, em_date as date, 'CreditorsCashbook' as type, (0) AS deposit, (em.em_amount) AS withdraw, bkm.bkm_id
   FROM purexpense_master em
     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0
  and em_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01') and bkm_id = 9
  union
 SELECT com.com_id, dem_id as idd, em_date as date, 'DailyCashbook' as type, (0) AS deposit, (em.em_amount) AS withdraw, bkm.bkm_id
   FROM dailyexpense_master em
     LEFT JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0
  and em_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01') and bkm_id = 9) as deb
  order by deb.date desc