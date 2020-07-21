select * from (select abc.com_id, 0 as idd, '' as invoice,null as date, 'opening' as type, '' as ctype, 
CASE
    WHEN sum(bal) < 0 THEN sum(bal) * '-1'
    else 0
END AS debit,
CASE
    WHEN sum(bal) >= 0 THEN sum(bal)
    else 0
END AS credit,
 abc.vm_id from (select com_id, vm_id, sum(bal) as bal from creditors_opening_fin_year_mv where vm_id = 93 and fin_year < '2018-2019' group by com_id, vm_id
union
select foo.com_id, foo.vm_id, sum(foo.credit - foo.debit) as bal 
from (SELECT com.com_id, (0) AS debit, sum(prm.prm_amount) AS credit, vm.vm_id
   FROM purchase_master prm
     LEFT JOIN vendor_master vm ON prm.prm_vm_id = vm.vm_id
     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id
  WHERE com.com_status = 0 AND prm.prm_status = 0 AND prm.prm_credit::text = 'credit'::text AND vm.vm_status = 0 
  and prm_date 
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and vm_id = 93
  group by com.com_id,vm.vm_id
  union
 SELECT com.com_id, sum(prrm.prrm_amount) AS debit, (0) AS credit, vm.vm_id
   FROM purchasereturn_master prrm
     LEFT JOIN vendor_master vm ON prrm.prrm_vm_id = vm.vm_id
     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id
  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND vm.vm_status = 0
  and prrm_date 
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and vm_id = 93
  group by com.com_id,vm.vm_id
  union
 SELECT com.com_id, sum(em.em_amount) AS debit, (0) AS credit, vm.vm_id
   FROM purexpense_master em
     LEFT JOIN vendor_master vm ON em.em_vm_id = vm.vm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND vm.vm_status = 0
  and em_date  
  between
  to_date(case WHEN to_char(to_date('2019-02-01','yyyy-MM-dd'), 'mm'::text)::integer > 3 
  THEN (to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer || '-04-01'::text)
  ELSE ((to_char(to_date('2019-02-01','yyyy-MM-dd'), 'yyyy'::text)::integer - 1) || '-04-01'::text)
  end,'yyyy-mm-dd') and 
  to_date('2019-02-01','yyyy-MM-dd') - INTERVAL '1 day'
  and vm_id = 93
  group by com.com_id,vm.vm_id) as foo 
  group by foo.com_id, foo.vm_id) as abc
  group by abc.com_id, abc.vm_id
  
  union
  
  SELECT com.com_id, prm_id as idd, prm_invoice_no as invoice, prm_date as date, 'Purchase' as type, prm_credit as ctype, (0) AS debit, (prm.prm_amount) AS credit, vm.vm_id
   FROM purchase_master prm
     LEFT JOIN vendor_master vm ON prm.prm_vm_id = vm.vm_id
     LEFT JOIN company_master com ON prm.prm_com_id = com.com_id
  WHERE com.com_status = 0 AND prm.prm_status = 0 AND prm.prm_credit::text = 'credit'::text AND prm.prm_status = 0 
  and prm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01')  and vm_id = 93
  union
 SELECT com.com_id, prrm_id as idd, prrm_serial_no as invoice, prrm_date as date,'Return' as type, '' as ctype, (prrm.prrm_amount) AS debit, (0) AS credit, vm.vm_id
   FROM purchasereturn_master prrm
     LEFT JOIN vendor_master vm ON prrm.prrm_vm_id = vm.vm_id
     LEFT JOIN company_master com ON prrm.prrm_com_id = com.com_id
  WHERE com.com_status = 0 AND prrm.prrm_status = 0 AND vm.vm_status = 0
  and prrm_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01')  and vm_id = 93
  union
 SELECT com.com_id, pem_id as idd, ''||em.pem_id as invoice, em_date as date, 'Cashbook' as type, em_payment_mode as ctype, (em.em_amount) AS debit, (0) AS credit, vm.vm_id
   FROM purexpense_master em
     LEFT JOIN vendor_master vm ON em.em_vm_id = vm.vm_id
     LEFT JOIN company_master com ON em.em_com_id = com.com_id
  WHERE com.com_status = 0 AND em.em_status = 0 AND vm.vm_status = 0
  and em_date in (select date_actual from time_dimension where date_actual between '2019-02-01' and '2019-03-01') and vm_id = 93) as deb
  order by deb.date desc
  