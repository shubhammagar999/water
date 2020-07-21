create materialized view bank_opening_fin_year_mv as 
select com.com_id, sum(bkm.bkm_opening_balance) as bal, bkm.bkm_id,
CASE
	WHEN to_char(min(ctm_date) - interval '1 year', 'mm'::text)::integer > 3 THEN (to_char(min(ctm_date) - interval '1 year', 'yyyy'::text)::integer || '-'::text) || (to_char(min(ctm_date) - interval '1 year', 'yyyy'::text)::integer + 1)
    ELSE ((to_char(min(ctm_date) - interval '1 year', 'yyyy'::text)::integer - 1) || '-'::text) || to_char(min(ctm_date) - interval '1 year', 'yyyy'::text)::integer
	END AS fin_year
FROM cashtransfer_master ctm
     left JOIN bank_master bkm ON ctm.ctm_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON ctm.ctm_com_id = com.com_id
  WHERE com.com_status = 0 AND ctm.ctm_status = 0 AND bkm.bkm_status = 0 
  group by com.com_id,bkm.bkm_id

union
  
select foo.com_id,sum(foo.deposit - foo.withdraw) as bal,foo.bkm_id,foo.fin_year 
from (SELECT com.com_id, (0) AS deposit, (bwm.bwm_amount) AS withdraw, bkm.bkm_id,
CASE
	WHEN to_char(bwm_date, 'mm'::text)::integer > 3 THEN (to_char(bwm_date, 'yyyy'::text)::integer || '-'::text) || 
  (to_char(bwm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(bwm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(bwm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM bankwithdraw_master bwm
     LEFT JOIN bank_master bkm ON bwm.bwm_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON bwm.bwm_com_id = com.com_id
  WHERE com.com_status = 0 AND bwm.bwm_status = 0 AND bkm.bkm_status = 0 
  
  union
  
  SELECT com.com_id, (ctm.ctm_amount) AS deposit, (0) AS withdraw, bkm.bkm_id,
  CASE
	WHEN to_char(ctm_date, 'mm'::text)::integer > 3 THEN (to_char(ctm_date, 'yyyy'::text)::integer || '-'::text) || (to_char(ctm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(ctm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(ctm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM cashtransfer_master ctm
     LEFT JOIN bank_master bkm ON ctm.ctm_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON ctm.ctm_com_id = com.com_id
  WHERE com.com_status = 0 AND ctm.ctm_status = 0 AND bkm.bkm_status = 0 
  
  union
  
  SELECT com.com_id,(0) AS deposit, (em.em_amount) AS withdraw, bkm.bkm_id,
  CASE
	WHEN to_char(em_date, 'mm'::text)::integer > 3 THEN (to_char(em_date, 'yyyy'::text)::integer || '-'::text) || (to_char(em_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(em_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(em_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM purexpense_master em
     inner JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 
  
  union
  
  SELECT com.com_id,(em.em_amount) AS deposit, (0) AS withdraw, bkm.bkm_id,
  CASE
	WHEN to_char(em_date, 'mm'::text)::integer > 3 THEN (to_char(em_date, 'yyyy'::text)::integer || '-'::text) || (to_char(em_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(em_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(em_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM expense_master em
     inner JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 
  
  union
  
  SELECT com.com_id,(0) AS deposit, (em.em_amount) AS withdraw, bkm.bkm_id,
  CASE
	WHEN to_char(em_date, 'mm'::text)::integer > 3 THEN (to_char(em_date, 'yyyy'::text)::integer || '-'::text) || (to_char(em_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(em_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(em_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM dailyexpense_master em
     inner JOIN bank_master bkm ON em.em_bkm_id = bkm.bkm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND bkm.bkm_status = 0 ) as foo 
  group by foo.com_id,foo.bkm_id,foo.fin_year
  
select * from bank_opening_fin_year_mv