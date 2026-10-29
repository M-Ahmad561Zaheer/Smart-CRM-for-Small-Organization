import { useState } from 'react'
import { useStudents } from './students-store'
import { generateFeeInvoice, useFeeInvoices } from '../alerts-store'
import './alerts.css'
export default function FeeInvoiceForm() {
  const invoices=useFeeInvoices();
  const students=useStudents(),[notice,setNotice]=useState('')
  return <section className="g-panel"><h2>Generate Fee Invoice</h2><p className="g-muted">Create a session invoice and a pending notification addressed to the parent.</p><form className="invoice-form" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);const id=data.get('student');const error=generateFeeInvoice({studentId:id,studentName:students.find(s=>s.id===id)?.name||'',parent:data.get('parent'),contact:data.get('contact'),amount:data.get('amount'),due:data.get('due')});setNotice(error||'Demo invoice created. Parent notification is Pending in Alerts.');}}><label>Student<select required name="student" defaultValue=""><option value="" disabled>Select student</option>{students.map(s=><option key={s.id} value={s.id}>{s.name} · {s.id}</option>)}</select></label><label>Parent / Guardian Name<input required name="parent"/></label><label>Parent Email or Phone<input required name="contact"/></label><label>Fee Amount ($)<input required type="number" name="amount" min="0.01" step="0.01"/></label><label>Due Date<input required type="date" name="due"/></label><button className="g-button" type="submit">Generate Invoice & Queue Notification</button>{notice&&<p role="status">{notice} <a href="#school-alerts">View Alerts →</a></p>}</form>{invoices.length>0&&<div><h2>Session Invoices</h2>{invoices.map(i=><p key={i.id}>{i.id} · {i.student} · ${i.amount} · Due {i.due} · Parent: {i.parent}</p>)}</div>}</section>
}
