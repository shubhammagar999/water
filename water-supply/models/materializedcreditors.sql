create materialized view creditors_opening_fin_year_mv as 
select com.com_id, sum(vm.vm_opening_credit-vm.vm_opening_debit) as bal, vm.vm_id,
CASE
	WHEN to_char(min(prm_date) - interval '1 year', 'mm'::text)::integer > 3 THEN (to_char(min(prm_date) - interval '1 year', 'yyyy'::text)::integer || '-'::text) || (to_char(min(prm_date) - interval '1 year', 'yyyy'::text)::integer + 1)
    ELSE ((to_char(min(prm_date) - interval '1 year', 'yyyy'::text)::integer - 1) || '-'::text) || to_char(min(prm_date) - interval '1 year', 'yyyy'::text)::integer
	END AS fin_year
FROM purchase_master prm
     LEFT JOIN vendor_master vm ON prm.prm_vm_id = vm.vm_id
     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id
  WHERE com.com_status = 0 AND prm.prm_status = 0 AND prm.prm_credit::text = 'credit'::text AND vm.vm_status = 0 
  group by com.com_id,vm.vm_id

union
  
select foo.com_id,sum(foo.credit - foo.debit) as bal,foo.vm_id,foo.fin_year 
from (SELECT com.com_id, (0) AS debit, (prm.prm_amount) AS credit, vm.vm_id, vm.vm_opening_credit, vm.vm_opening_debit,
CASE
	WHEN to_char(prm_date, 'mm'::text)::integer > 3 THEN (to_char(prm_date, 'yyyy'::text)::integer || '-'::text) || 
  (to_char(prm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(prm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(prm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM purchase_master prm
     LEFT JOIN vendor_master vm ON prm.prm_vm_id = vm.vm_id
     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id
  WHERE com.com_status = 0 AND prm.prm_status = 0 AND prm.prm_credit::text = 'credit'::text AND vm.vm_status = 0 
  
  union
  
  SELECT com.com_id, (prrm.prrm_amount) AS debit, (0) AS credit, vm.vm_id, vm.vm_opening_credit, vm.vm_opening_debit,
  CASE
	WHEN to_char(prrm_date, 'mm'::text)::integer > 3 THEN (to_char(prrm_date, 'yyyy'::text)::integer || '-'::text) || (to_char(prrm_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(prrm_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(prrm_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM purchasereturn_master prrm
     LEFT JOIN vendor_master vm ON prrm.prrm_vm_id = vm.vm_id
     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id
  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND vm.vm_status = 0 
  
  union
  
  SELECT com.com_id,(em.em_amount) AS debit, (0) AS credit, vm.vm_id, vm.vm_opening_credit, vm.vm_opening_debit,
  CASE
	WHEN to_char(em_date, 'mm'::text)::integer > 3 THEN (to_char(em_date, 'yyyy'::text)::integer || '-'::text) || (to_char(em_date, 'yyyy'::text)::integer + 1)
    ELSE ((to_char(em_date, 'yyyy'::text)::integer - 1) || '-'::text) || to_char(em_date, 'yyyy'::text)::integer
	END AS fin_year
   FROM purexpense_master em
     LEFT JOIN vendor_master vm ON em.em_vm_id = vm.vm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND vm.vm_status = 0 ) as foo 
  group by foo.com_id,foo.vm_id,foo.fin_year
  
select * from creditors_opening_fin_year_mv