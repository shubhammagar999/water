create materialized view debtors_opening_fin_year_mv as 
select com.com_id, sum(cm.cm_opening_debit-cm.cm_opening_credit) as bal, cm.cm_id,
CASE
	WHEN to_char(min(sm_date) - interval '1 year', 'mm'::text)::integer > 3 THEN (to_char(min(sm_date) - interval '1 year', 'yyyy'::text)::integer || '-'::text) || (to_char(min(sm_date) - interval '1 year', 'yyyy'::text)::integer + 1)
    ELSE ((to_char(min(sm_date) - interval '1 year', 'yyyy'::text)::integer - 1) || '-'::text) || to_char(min(sm_date) - interval '1 year', 'yyyy'::text)::integer
	END AS fin_year
FROM sale_master sm
     LEFT JOIN customer_master cm ON sm.sm_cm_id = cm.cm_id
     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id
  WHERE com.com_status = 0 AND sm.sm_status = 0 AND sm.sm_payment_mode::text = 'credit'::text AND cm.cm_status = 0 
  and cm_id = 57
  group by com.com_id,cm.cm_id

union
  
select foo.com_id,sum(foo.debit - foo.credit) as bal,foo.cm_id,foo.fin_year 
from (SELECT com.com_id, (sm.sm_amount) AS debit, (0) AS credit, cm.cm_id, cm.cm_opening_credit, cm.cm_opening_debit,
CASE
	WHEN to_char(sm_date, 'mm'::text)::integer > 3 THEN (to_char(sm_date, 'yyyy'::text)::integer || '-'::text) || 
  (to_char(sm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(sm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(sm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM sale_master sm
     LEFT JOIN customer_master cm ON sm.sm_cm_id = cm.cm_id
     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id
  WHERE com.com_status = 0 AND sm.sm_status = 0 AND sm.sm_payment_mode::text = 'credit'::text AND cm.cm_status = 0 
  and cm_id = 57
  
  union
  
  SELECT com.com_id, (0) AS debit, (srm.srm_amount) AS credit, cm.cm_id, cm.cm_opening_credit, cm.cm_opening_debit,
  CASE
	WHEN to_char(srm_date, 'mm'::text)::integer > 3 THEN (to_char(srm_date, 'yyyy'::text)::integer || '-'::text) || (to_char(srm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(srm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(srm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM salereturn_master srm
     LEFT JOIN customer_master cm ON srm.srm_cm_id = cm.cm_id
     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id
  WHERE com.com_status = 0 AND srm.srm_status = 0 AND cm.cm_status = 0
  and cm_id = 57
  
  union
  
  SELECT com.com_id,(0) AS debit, (em.em_amount) AS credit, cm.cm_id, cm.cm_opening_credit, cm.cm_opening_debit,
  CASE
	WHEN to_char(em_date, 'mm'::text)::integer > 3 THEN (to_char(em_date, 'yyyy'::text)::integer || '-'::text) || (to_char(em_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(em_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(em_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM expense_master em
     LEFT JOIN customer_master cm ON em.em_cm_id = cm.cm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND cm.cm_status = 0
  and cm_id = 57) as foo 
  group by foo.com_id,foo.cm_id,foo.fin_year
  
select * from debtors_opening_fin_year_mv