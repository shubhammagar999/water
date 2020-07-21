select * from (select abc.com_id, 0 as idd, '' as invoice,null as date, 'opening' as type, '' as ctype, 
CASE
    WHEN sum(bal) >= 0 THEN sum(bal)
    else 0
END AS debit,
CASE
    WHEN sum(bal) < 0 THEN sum(bal) * '-1'
    else 0
END AS credit,
 abc.cm_id from (select com_id, cm_id, sum(bal) as bal from debtors_opening_fin_year_mv where cm_id = 57 and fin_year < '2017-2018' group by com_id, cm_id
union
select foo.com_id, foo.cm_id, sum(foo.debit - foo.credit) as bal 
from (SELECT com.com_id, sum(sm.sm_amount) AS debit, (0) AS credit, cm.cm_id
   FROM sale_master sm
     LEFT JOIN customer_master cm ON sm.sm_cm_id = cm.cm_id
     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id
  WHERE com.com_status = 0 AND sm.sm_status = 0 AND sm.sm_payment_mode::text = 'credit'::text AND cm.cm_status = 0 
  and sm_date 
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and cm_id = 57
  group by com.com_id,cm.cm_id 
  union
 SELECT com.com_id, (0) AS debit, (srm.srm_amount) AS credit, cm.cm_id
   FROM salereturn_master srm
     LEFT JOIN customer_master cm ON srm.srm_cm_id = cm.cm_id
     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id
  WHERE com.com_status = 0 AND srm.srm_status = 0 AND cm.cm_status = 0
  and srm_date 
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and cm_id = 57
  group by com.com_id,cm.cm_id 
  union
 SELECT com.com_id, (0) AS debit, (em.em_amount) AS credit, cm.cm_id
   FROM expense_master em
     LEFT JOIN customer_master cm ON em.em_cm_id = cm.cm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND cm.cm_status = 0
  and em_date  
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and cm_id = 57
  group by com.com_id,cm.cm_id ) as foo 
  group by foo.com_id, foo.cm_id) as abc
  group by abc.com_id, abc.cm_id

  union
  
SELECT com.com_id, sm_id as idd, sm_invoice_no as invoice, sm_date as date, 'Sale' as type, sm_payment_mode as ctype, (sm.sm_amount) AS debit, (0) AS credit, cm.cm_id
   FROM sale_master sm
     LEFT JOIN customer_master cm ON sm.sm_cm_id = cm.cm_id
     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id
  WHERE com.com_status = 0 AND sm.sm_status = 0 AND sm.sm_payment_mode::text = 'credit'::text AND cm.cm_status = 0 
  and sm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01')  and cm_id = 57
  union
 SELECT com.com_id, srm_id as idd, srm_invoice_no as invoice, srm_date as date,'Return' as type, '' as ctype, (0) AS debit, (srm.srm_amount) AS credit, cm.cm_id
   FROM salereturn_master srm
     LEFT JOIN customer_master cm ON srm.srm_cm_id = cm.cm_id
     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id
  WHERE com.com_status = 0 AND srm.srm_status = 0 AND cm.cm_status = 0
  and srm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01')  and cm_id = 57
  union
 SELECT com.com_id, em_id as idd, ''||em.em_id as invoice, em_date as date, 'Cashbook' as type, em_payment_mode as ctype, (0) AS debit, (em.em_amount) AS credit, cm.cm_id
   FROM expense_master em
     LEFT JOIN customer_master cm ON em.em_cm_id = cm.cm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND cm.cm_status = 0
  and em_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01') and cm_id = 57) as deb
  order by deb.date desc