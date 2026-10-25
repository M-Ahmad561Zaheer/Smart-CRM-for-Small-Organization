import { useEffect, useRef, useState } from 'react'
import Icon from './SchoolIcon'
import portrait from './student-avatar.svg'
import { useProfile, updateProfile, recordPayment } from './profile-store'
import './dashboard.css'
import './students.css'
import './profile.css'

const editFields = [['name', 'Student name'], ['grade', 'Grade / Section'], ['address', 'Address'], ['guardian', 'Guardian name'], ['phone', 'Phone number'], ['email', 'Email']]
function ProfileDialog({ title, close, children }) {
  const ref = useRef(null)
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close() }, [])
  return <dialog ref={ref} className="school-dialog" aria-label={title} onCancel={close} onClick={event => { if (event.target === event.currentTarget) close() }}><div className="school-panel-heading"><h2>{title}</h2><button className="school-icon-button" aria-label="Close dialog" onClick={close}><Icon name="close" /></button></div>{children}</dialog>
}
export default function StudentProfile() {
  const { student, attendance, fees } = useProfile()
  const [panel, setPanel] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const pending = fees.filter(fee => fee.status === 'Pending')
  function save(event) {
    event.preventDefault()
    const fields = Object.fromEntries([...new FormData(event.currentTarget)].map(([key, value]) => [key, value.trim()]))
    if (!updateProfile(fields)) { setError('Please fill in all fields.'); return }
    setPanel(null); setNotice('Student details updated for this demo session.')
  }
  function pay(event) {
    event.preventDefault()
    const id = new FormData(event.currentTarget).get('fee')
    if (!recordPayment(id)) { setError('Select a pending fee.'); return }
    setPanel(null); setNotice('Demo payment recorded. No money was charged.')
  }
  function downloadReceipt() {
    const text = ['SAMPLE RECEIPT — DEMO ONLY', student.name, 'Student ID: ' + student.id, 'Receipt: ' + receipt.id, receipt.description, 'Date: ' + receipt.date, 'Amount: $' + receipt.amount.toFixed(2), 'Status: Paid', 'This is sample data, not proof of an actual payment.'].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    const link = document.createElement('a'); link.href = url; link.download = 'sample-receipt-' + receipt.id + '.txt'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="school-shell profile-shell">
    <header className="school-header"><div className="school-header-inner"><a className="school-icon-button student-back" href="#students" aria-label="Back to students"><Icon name="back" /></a><h1>Student Information</h1><a className="school-icon-button profile-search" href="#students" aria-label="Search students"><Icon name="search" size={20} /></a><span className="profile-header-icon"><Icon name="profile" size={21} /></span></div></header>
    <main className="profile-main">
      <section className="profile-card profile-hero"><div className="profile-portrait"><img src={portrait} alt="Illustrated student portrait" /><span aria-label="Active student" /></div><h2>{student.name}</h2><span className="profile-id">ID: #{student.id}</span><button className="profile-button" onClick={() => { setError(''); setPanel('Edit Student') }}><Icon name="edit" size={15} />Edit Student</button></section>
      <div className="profile-details">
        <section className="profile-card"><h2 className="profile-section-label"><Icon name="profile" size={14} />PERSONAL DETAILS</h2><dl className="profile-description"><div><dt>DATE OF BIRTH</dt><dd>{student.birthDate} ({student.age})</dd></div><div><dt>GRADE / SECTION</dt><dd>{student.grade}</dd></div><div><dt>ADDRESS</dt><dd>{student.address}</dd></div></dl></section>
        <section className="profile-card"><h2 className="profile-section-label"><Icon name="people" size={15} />GUARDIAN DETAILS</h2><div className="profile-guardian"><span className="guardian-avatar">{student.guardian.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('')}</span><div><strong>{student.guardian}</strong><p>{student.relationship}</p></div></div><p className="guardian-contact"><Icon name="phone" size={16} />{student.phone}</p><p className="guardian-contact"><Icon name="mail" size={16} />{student.email}</p></section>
      </div>
      <section className="profile-card profile-attendance"><div className="school-panel-heading"><h2>Attendance Overview</h2><span className="profile-present">● {attendance.rate}% Present</span></div><div className="attendance-grid">{[[attendance.total, 'Total Days', 'total'], [attendance.present, 'Present', 'present'], [attendance.absent, 'Absent', 'absent'], [attendance.late, 'Late', 'late']].map(([value, label, tone]) => <div key={label}><strong className={tone}>{value}</strong><span>{label}</span></div>)}</div><div className="attendance-week"><span>Last 7 Days</span><div>{attendance.days.map((day, index) => <span key={index} className={day.toLowerCase()} title={'Day ' + (index + 1) + ': ' + day} aria-label={'Day ' + (index + 1) + ': ' + day} />)}</div></div></section>
      <section className="profile-card profile-fees"><div className="school-panel-heading"><h2>Fee History</h2><button className="profile-button record-payment" onClick={() => { setError(''); setPanel('Record Payment') }}><Icon name="money" size={17} />Record Payment</button></div><div className="profile-table-wrap"><table><thead><tr><th>DATE</th><th>DESCRIPTION</th><th>AMOUNT</th><th>STATUS</th><th>RECEIPT</th></tr></thead><tbody>{fees.map(fee => <tr key={fee.id}><td>{fee.date}</td><td>{fee.description}</td><td className={fee.status === 'Pending' ? 'fee-overdue' : ''}>${fee.amount.toFixed(2)}</td><td><span className={'fee-status ' + fee.status.toLowerCase()}>{fee.status}</span></td><td>{fee.status === 'Paid' ? <button className="receipt-button" aria-label={'View receipt for ' + fee.description} onClick={() => { setReceipt(fee); setPanel('Receipt') }}><Icon name="download" size={18} /></button> : <span className="no-receipt">—</span>}</td></tr>)}</tbody></table></div></section>
      {notice && <p className="student-notice" role="status">{notice}</p>}<p className="school-sample-note">Sample profile · Changes last for this session only</p>
    </main>
    <nav className="school-nav" aria-label="School navigation">{['Dashboard', 'Tasks', 'Alerts', 'Profile'].map(item => <button key={item} className={item === 'Profile' ? 'active' : ''} aria-current={item === 'Profile' ? 'page' : undefined} onClick={() => item === 'Dashboard' ? (location.hash = '#school-dashboard') : item === 'Tasks' ? (location.hash = '#students') : item === 'Profile' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : setPanel('Alerts')}><Icon name={item.toLowerCase()} size={21} /><span>{item}</span></button>)}</nav>
    {panel && <ProfileDialog key={panel} title={panel} close={() => setPanel(null)}>
      {panel === 'Edit Student' ? <form className="student-form" onSubmit={save}><p className="school-detail-note">Updates apply to this sample profile for the current session.</p>{editFields.map(([key, label]) => <label key={key}>{label}<input name={key} defaultValue={student[key]} required maxLength={key === 'address' ? 180 : 80} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} /></label>)}{error && <p className="student-error" role="alert">{error}</p>}<button className="student-submit">Save Changes</button></form>
        : panel === 'Record Payment' ? pending.length ? <form className="student-form" onSubmit={pay}><p className="school-detail-note">Record a payment in the demo only. This does not charge or transfer money.</p><label>Pending fee<select name="fee">{pending.map(fee => <option key={fee.id} value={fee.id}>{fee.description} — ${fee.amount.toFixed(2)}</option>)}</select></label>{error && <p className="student-error" role="alert">{error}</p>}<button className="student-submit">Record Demo Payment</button></form> : <p className="school-detail-note">All sample fees are paid. No pending payments.</p>
          : panel === 'Receipt' && receipt ? <div className="profile-receipt"><p className="school-demo">SAMPLE RECEIPT · DEMO ONLY</p><h3>{student.name}</h3><p>{student.id}</p><p>{receipt.description}</p><p>{receipt.date}</p><strong>${receipt.amount.toFixed(2)} · Paid</strong><p className="school-detail-note">This is sample data, not proof of an actual payment.</p><button className="student-submit" onClick={downloadReceipt}>Download sample receipt</button></div>
            : <p className="school-detail-note">{pending.length ? pending.length + ' sample fee is pending for this student.' : 'No pending fees for this student.'}</p>}
    </ProfileDialog>}
  </div>
}
