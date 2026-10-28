import BarberApp from '../barber/BarberApp'
import GymApp from '../gym/GymApp'
import { barberFeatures, gymFeatures, gymFeatureForRoute, useWorkspace } from '../workspace-store'
import { useState } from 'react'
import TeacherTimetable from './TeacherTimetable'
import SchoolDashboard from './SchoolDashboard'
import Students from './Students'
import StudentProfile from './StudentProfile'
import Icon from './SchoolIcon'
import data from './demo-data.json'
import { useStudents } from './students-store'
import '../gym/gym.css'
import './school-workspace.css'

const links = [
  ['#school-dashboard', 'Overview', 'dashboard'],
  ['#students', 'Students / Tasks', 'students'],
  ['#school-fees', 'Fee Management', 'fees'],
  ['#school-reports', 'Reports & Analytics', 'reports'],
  ['#school-timetable', 'Timetable', 'calendar'],
]
function Fees() {
  const students = useStudents()
  const [status, setStatus] = useState('All')
  const visible = students.filter(student => status === 'All' || student.status === status)
  return <section className="g-panel"><div className="g-panel-head"><h2>Student Fee Status</h2><select aria-label="Filter fee status" value={status} onChange={event => setStatus(event.target.value)}>{['All', 'Paid', 'Pending'].map(value => <option key={value}>{value}</option>)}</select></div><p className="g-muted">Available student records. Detailed balances and payment history are pending backend integration.</p><div className="g-table-wrap"><table><thead><tr><th>Student</th><th>ID</th><th>Grade</th><th>Fee status</th><th>Action</th></tr></thead><tbody>{visible.map(student => <tr key={student.id}><td><strong>{student.name}</strong></td><td>{student.id}</td><td>{student.grade}</td><td><span className={`g-badge ${student.status === 'Paid' ? 'good' : 'warn'}`}>{student.status}</span></td><td><a href={`#student/${student.id}`}>View profile →</a></td></tr>)}</tbody></table>{!visible.length && <p className="g-empty">No students with this fee status.</p>}</div></section>
}
function Reports() {
  return <><div className="g-metrics">{[['Monthly Revenue', '$12.4K'], ['Student Growth', '+12%'], ['New Enrolments', '24'], ['Returning Students', '96']].map(([label, value]) => <section key={label}><div><span className="g-eyebrow">{label}</span><strong>{value}</strong><small>Sample school overview</small></div></section>)}</div><section className="g-panel"><div className="g-panel-head"><h2>Monthly Revenue</h2><span className="g-muted">Last 6 months</span></div><div className="g-table-wrap"><table><thead><tr><th>Month</th><th>Revenue</th><th>Trend</th></tr></thead><tbody>{data.monthly.labels.map((month,index) => <tr key={month}><td>{month}</td><td>${data.monthly.values[index].toFixed(1)}K</td><td><div className="g-track"><span style={{ width: `${data.monthly.values[index] / 12.4 * 100}%` }}/></div></td></tr>)}</tbody></table></div></section></>
}
export default function SchoolWorkspace({ route }) {
  const config = useWorkspace()
  const gymRoute = route.startsWith('#gym-')
  const feature = gymFeatureForRoute(route)
  const enabled = config.gym && (feature === 'dashboard' || config.features.includes(feature))
  const [menu, setMenu] = useState(false)
  const profile = route.startsWith('#student/')
  const active = profile ? '#students' : route.startsWith('#school-timetable') ? '#school-timetable' : route
  const title = route.startsWith('#barber-') ? 'Barber Management' : gymRoute ? (feature === 'dashboard' ? 'Gym Overview' : gymFeatures.find(([id]) => id === feature)?.[1] || 'Gym') : profile ? 'Student Profile' : links.find(([href]) => href === active)?.[1] || 'Page not found'
  return <div className="gym-app school-web">
    <aside className={`g-sidebar ${menu ? 'open' : ''}`}><a className="g-brand" href="#school-dashboard"><span><Icon name="students"/></span>Smart CRM</a><div className="g-workspace"><span className="g-workspace-icon"><Icon name="students"/></span><div><strong>{config.name}</strong><small>School workspace</small></div></div><p className="g-nav-label">WORKSPACE</p><nav aria-label="School workspace navigation">{links.map(([href,label,icon]) => <a href={href} key={href} aria-current={active === href ? 'page' : undefined} onClick={() => setMenu(false)}><Icon name={icon}/>{label}</a>)}</nav>{config.gym && <><p className="g-nav-label g-module-label"><Icon name="gym" size={17}/>GYM MODULE</p><nav aria-label="Gym module navigation">{[["dashboard", "Overview"], ...gymFeatures.filter(([id]) => config.features.includes(id))].map(([id,label]) => <a key={id} href={`#gym-${id}`} aria-current={gymRoute && feature === id ? 'page' : undefined} onClick={() => setMenu(false)}><Icon name={{dashboard:"dashboard",members:"people",renewal:"renewal",training:"gym",reports:"reports"}[id]}/>{label}</a>)}</nav></>}<>{config.barber && <><p className="g-nav-label g-module-label"><Icon name="barber" size={17}/>BARBER MODULE</p><nav aria-label="Barber module navigation">{[["dashboard","Overview"],...barberFeatures.filter(([id]) => config.barberFeatures.includes(id))].map(([id,label]) => <a key={id} href={`#barber-${id}`} aria-current={route === `#barber-${id}` ? "page" : undefined} onClick={() => setMenu(false)}><Icon name={{dashboard:"dashboard",clients:"people",payments:"money",appointments:"calendar",reports:"reports"}[id]}/>{label}</a>)}</nav></>}</><div className="g-sidebar-bottom"><span className="g-badge good">DEMO WORKSPACE</span><p>Your students. Their growth.<br/>All in one place.</p><a href="#login">← Back to workspaces</a></div></aside>
    <div className="g-main"><header className="g-topbar"><button className="g-menu" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button><span>Workspace <span className="g-slash">/</span><strong>School Management</strong></span><div className="g-admin"><span className="g-avatar">SA</span><div><strong>School Admin</strong><small>Administrator</small></div></div></header>
      <div className="g-content"><div className="g-heading"><div><p className="g-eyebrow">SCHOOL MANAGEMENT</p><h1>{title}</h1><p className="g-muted">{route === '#school-dashboard' ? 'Welcome back. Here’s what’s happening at your school.' : 'Manage your school community from one workspace.'}</p></div>{route === '#school-dashboard' && <a className="g-button" href="#students">Manage Students →</a>}{profile && <a className="g-button secondary" href="#students">← Back to Students</a>}</div><div className="g-demo">Sample data · Workspace choices last for this session</div>
        {route.startsWith('#barber-') ? <BarberApp key={route} page={route.slice(8)}/> : gymRoute ? enabled ? <GymApp route={route} embedded/> : <section className="g-panel"><h2>Feature not enabled</h2><p>Select this Gym feature during School workspace setup.</p><a href="#school-dashboard">Back to overview</a></section> : route === '#school-dashboard' ? <SchoolDashboard/> : route === '#students' ? <Students/> : profile ? <StudentProfile key={route} studentId={route.slice('#student/'.length)}/> : route === '#school-fees' ? <Fees/> : route === '#school-reports' ? <Reports/> : route.startsWith('#school-timetable') ? <TeacherTimetable key={route} teacherId={route.split('/')[1]}/> : <section className="g-panel"><h2>Page not found</h2><a href="#school-dashboard">Return to overview</a></section>}
      </div><footer className="g-footer">Smart CRM <span>School Management Workspace</span></footer></div>
  </div>
}
