create materialized view product_opening_fin_year_mv as 
select com.com_id, sum(pm.pm_opening_quantity) as bal, pm.pm_id,
CASE
	WHEN to_char(min(sm_date) - interval '1 year', 'mm'::text)::integer > 3 THEN (to_char(min(sm_date) - interval '1 year', 'yyyy'::text)::integer || '-'::text) || (to_char(min(sm_date) - interval '1 year', 'yyyy'::text)::integer + 1)
    ELSE ((to_char(min(sm_date) - interval '1 year', 'yyyy'::text)::integer - 1) || '-'::text) || to_char(min(sm_date) - interval '1 year', 'yyyy'::text)::integer
	END AS fin_year
FROM sale_product_master spm
     left JOIN sale_master sm ON spm.spm_sm_id = sm.sm_id
     left JOIN product_master pm ON spm.spm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id
  WHERE com.com_status = 0 AND sm.sm_status = 0 AND pm.pm_status = 0 
  group by com.com_id,pm.pm_id

union
  
select foo.com_id,sum(foo.purchase - foo.sale) as bal,foo.pm_id,foo.fin_year 
from (SELECT com.com_id, (0) AS purchase, (spm.spm_quantity) AS sale, pm.pm_id,
CASE
	WHEN to_char(sm_date, 'mm'::text)::integer > 3 THEN (to_char(sm_date, 'yyyy'::text)::integer || '-'::text) || 
  (to_char(sm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(sm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(sm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM sale_product_master spm
     left JOIN sale_master sm ON spm.spm_sm_id = sm.sm_id
     left JOIN product_master pm ON spm.spm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id
  WHERE com.com_status = 0 AND sm.sm_status = 0 AND pm.pm_status = 0 
  
  union
  
  SELECT com.com_id, (srpm.srpm_quantity) AS purchase, (0) AS sale, pm.pm_id,
  CASE
	WHEN to_char(srm_date, 'mm'::text)::integer > 3 THEN (to_char(srm_date, 'yyyy'::text)::integer || '-'::text) || (to_char(srm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(srm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(srm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM salereturn_product_master srpm
     left JOIN salereturn_master srm ON srpm.srpm_srm_id = srm.srm_id
     LEFT JOIN product_master pm ON srpm.srpm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id
  WHERE com.com_status = 0 AND srm.srm_status = 0 AND pm.pm_status = 0 
  
  union
  
  SELECT com.com_id, (ppm.ppm_quantity) AS purchase, (0) AS sale, pm.pm_id,
  CASE
	WHEN to_char(prm_date, 'mm'::text)::integer > 3 THEN (to_char(prm_date, 'yyyy'::text)::integer || '-'::text) || (to_char(prm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(prm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(prm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM purchase_product_master ppm
     left JOIN purchase_master prm ON ppm.ppm_prm_id = prm.prm_id
     LEFT JOIN product_master pm ON ppm.ppm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id
  WHERE com.com_status = 0 AND prm.prm_status = 0 AND pm.pm_status = 0 
  
  union

	SELECT com.com_id, (0) AS purchase, (prpm.prpm_quantity) AS sale, pm.pm_id,
	CASE
	WHEN to_char(prrm_date, 'mm'::text)::integer > 3 THEN (to_char(prrm_date, 'yyyy'::text)::integer || '-'::text) || 
  (to_char(prrm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(prrm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(prrm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM purchasereturn_product_master prpm
     left JOIN purchasereturn_master prrm ON prpm.prpm_prrm_id = prrm.prrm_id
     left JOIN product_master pm ON prpm.prpm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id
  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND pm.pm_status = 0 ) as foo 
  group by foo.com_id,foo.pm_id,foo.fin_year
  
select * from product_opening_fin_year_mv