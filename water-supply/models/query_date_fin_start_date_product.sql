select * from (select abc.com_id, '' as invoice, 0 as idd, null as date, 'opening' as type, 
CASE
    WHEN sum(bal) >= 0 THEN sum(bal)
    else 0
END AS purchase,
CASE
    WHEN sum(bal) < 0 THEN sum(bal) * '-1'
    else 0
END AS sale,
 abc.pm_id from (select com_id, pm_id, sum(bal) as bal from product_opening_fin_year_mv where pm_id = 9 and fin_year < '2018-2019' group by com_id, pm_id
union
select foo.com_id, foo.pm_id, sum(foo.purchase - foo.sale) as bal 
from (SELECT com.com_id, sum(ppm.ppm_quantity) AS purchase, (0) AS sale, pm.pm_id
   FROM purchase_product_master ppm
     left JOIN purchase_master prm ON ppm.ppm_prm_id = prm.prm_id
     LEFT JOIN product_master pm ON ppm.ppm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id
  WHERE com.com_status = 0 AND prm.prm_status = 0 AND pm.pm_status = 0 
  and prm_date 
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and pm_id = 9
  group by com.com_id,pm.pm_id 
  union
 SELECT com.com_id, (0) AS purchase, sum(prpm.prpm_quantity) AS sale, pm.pm_id
   FROM purchasereturn_product_master prpm
     left JOIN purchasereturn_master prrm ON prpm.prpm_prrm_id = prrm.prrm_id
     left JOIN product_master pm ON prpm.prpm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id
  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND pm.pm_status = 0 
  and prrm_date 
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and pm_id = 9
  group by com.com_id,pm.pm_id 
  union
 SELECT com.com_id, sum(srpm.srpm_quantity) AS purchase, (0) AS sale, pm.pm_id
   FROM salereturn_product_master srpm
     left JOIN salereturn_master srm ON srpm.srpm_srm_id = srm.srm_id
     LEFT JOIN product_master pm ON srpm.srpm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id
  WHERE com.com_status = 0 AND srm.srm_status = 0 AND pm.pm_status = 0 
  and srm_date  
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and pm_id = 9
  group by com.com_id,pm.pm_id  
  union
 SELECT com.com_id, (0) AS purchase, sum(spm.spm_quantity) AS sale, pm.pm_id
   FROM sale_product_master spm
     left JOIN sale_master sm ON spm.spm_sm_id = sm.sm_id
     left JOIN product_master pm ON spm.spm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id
  WHERE com.com_status = 0 AND sm.sm_status = 0 AND pm.pm_status = 0 
  and sm_date  
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and pm_id = 9
  group by com.com_id,pm.pm_id ) as foo 
  group by foo.com_id, foo.pm_id) as abc
  group by abc.com_id, abc.pm_id

  union
  
SELECT com.com_id, prm_invoice_no as invoice, prm_id as idd, prm_date as date, 'purchase' as type, (ppm.ppm_quantity) AS purchase, (0) AS sale, pm.pm_id
   FROM purchase_product_master ppm
     left JOIN purchase_master prm ON ppm.ppm_prm_id = prm.prm_id
     LEFT JOIN product_master pm ON ppm.ppm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id
  WHERE com.com_status = 0 AND prm.prm_status = 0 AND pm.pm_status = 0 
  and prm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01')  and pm_id = 9
  union
 SELECT com.com_id, prrm_serial_no as invoice, prrm_id as idd, prrm_date as date,'purchase return' as type, (0) AS purchase, (prpm.prpm_quantity) AS sale, pm.pm_id
   FROM purchasereturn_product_master prpm
     left JOIN purchasereturn_master prrm ON prpm.prpm_prrm_id = prrm.prrm_id
     left JOIN product_master pm ON prpm.prpm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id
  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND pm.pm_status = 0 
  and prrm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01')  and pm_id = 9
  union
 SELECT com.com_id, srm_invoice_no as invoice, srm_id as idd, srm_date as date, 'sale return' as type, (srpm.srpm_quantity) AS purchase, (0) AS sale, pm.pm_id
   FROM salereturn_product_master srpm
     left JOIN salereturn_master srm ON srpm.srpm_srm_id = srm.srm_id
     LEFT JOIN product_master pm ON srpm.srpm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON srm.srm_com_id = com.com_id
  WHERE com.com_status = 0 AND srm.srm_status = 0 AND pm.pm_status = 0 
  and srm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01') and pm_id = 9
  union
 SELECT com.com_id, sm_invoice_no as invoice, sm_id as idd, sm_date as date, 'sale' as type, (0) AS purchase, (spm.spm_quantity) AS sale, pm.pm_id
   FROM sale_product_master spm
     left JOIN sale_master sm ON spm.spm_sm_id = sm.sm_id
     left JOIN product_master pm ON spm.spm_pm_id = pm.pm_id
     LEFT JOIN company_master com ON sm.sm_com_id = com.com_id
  WHERE com.com_status = 0 AND sm.sm_status = 0 AND pm.pm_status = 0 
  and sm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01') and pm_id = 9) as deb
  order by deb.date desc