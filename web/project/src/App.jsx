import { useState, useEffect } from 'react'
import './App.css'
import SchoolWorkspace from './dashboard/SchoolWorkspace'
import { barberFeatures, gymFeatures, saveWorkspace } from './workspace-store'
const paths = {
mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3',
user: 'M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-3c0-5 16-5 16 0v3z',
store: 'M3 3h18 M4 6h16l2 5H2z M4 11v10h16V11 M8 21v-7h8',
type: 'M12 2l4 7H8z M3 14h7v7H3z M21 17.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0',
arrow: 'M4 12h16 M13 5l7 7-7 7', back: 'M20 12H4 M11 5l-7 7 7 7',
rocket: 'M9 15l-4-4C9 4 14 2 22 2c0 8-2 13-9 17l-4-4z M9 15l-3 3 M5 15c-3 1-3 6-3 7 1 0 6 0 7-3 M14 7l3 3 M5 11H2l3-6 5-1 M13 19v3l6-3 1-5'
}
function Icon({ name, size = 24 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg> }
function Field({ label, icon, children, ...props }) { return <div className="field"><label htmlFor={props.id}>{label}</label><div className="input-wrap"><Icon name={icon} />{children || <input {...props} required />}</div></div> }
export default function App() {
const [workspace, setWorkspace] = useState(location.hash === '#create-workspace')
const [barber, setBarber] = useState(false)
const [barberSelection, setBarberSelection] = useState([])
const [gym, setGym] = useState(false)
const [features, setFeatures] = useState([])
const [notice, setNotice] = useState('')
const [route, setRoute] = useState(location.hash)
useEffect(() => { const update = () => { setRoute(location.hash); window.scrollTo(0, 0) }; window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])
useEffect(() => { const update = () => { setWorkspace(location.hash === '#create-workspace'); setNotice('') }; window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])
function submit(event) { event.preventDefault(); if (workspace) { if (!saveWorkspace(event.currentTarget.querySelector('#business').value, gym, features, barber, barberSelection)) { setNotice('Select at least one feature for each enabled module.'); return }; location.hash = '#school-dashboard'; return }; setNotice(workspace ? 'Your workspace details are ready. Workspace creation will be available when the service is connected.' : 'Your details are ready. Sign-in will be available when the service is connected.') }
if (route.startsWith('#school-') || route === '#students' || route.startsWith('#student/')) return <SchoolWorkspace route={route} />
if (route.startsWith('#barber-')) return <SchoolWorkspace route={route} />
if (route.startsWith('#gym-')) return <SchoolWorkspace route={route === '#gym-dashboard' ? '#school-dashboard' : route} />
return <main className={workspace ? 'page workspace-page' : 'page login-page'}>
{workspace && <a href="#login" className="back-link"><Icon name="back" />Create Workspace</a>}
<section className={workspace ? 'card workspace-card' : 'card login-card'} aria-labelledby="title">
{!workspace && <svg className="brand" width="42" height="38" viewBox="0 0 42 38" aria-label="CRM"><path fill="currentColor" d="M1 13 21 2l20 11-20 11L1 13Zm7 7 13 7 13-7v10l-13 7-13-7Zm30-4h3v12h-3Z" /></svg>}
<h1 id="title">{workspace ? 'Workspace Setup' : 'Welcome Back'}</h1>
<p className="subtitle">{workspace ? 'Configure your digital office to start managing your clients effectively.' : 'Please enter your credentials to access your dashboard.'}</p>
<form onSubmit={submit} key={workspace ? 'workspace' : 'login'}>
{workspace && <><Field label="School Name" id="business" icon="store" placeholder="e.g. Sunrise School" autoComplete="organization" pattern=".*\S.*" /><Field label="Owner Name" id="owner" icon="user" placeholder="Full Name" autoComplete="name" pattern=".*\S.*" /></>}
<Field label="Email" id="email" icon="mail" type="email" placeholder={workspace ? 'name@business.com' : 'name@school.edu'} autoComplete="email" />
{workspace && <fieldset className="workspace-modules"><legend>School workspace</legend><p>School features are included. Add optional modules below.</p><label><input type="checkbox" checked={gym} onChange={event => setGym(event.target.checked)}/>Add Gym module</label>{gym && <div>{gymFeatures.map(([id, label]) => <label key={id}><input type="checkbox" checked={features.includes(id)} onChange={event => setFeatures(previous => event.target.checked ? [...previous, id] : previous.filter(value => value !== id))}/>{label}</label>)}</div>}<label><input type="checkbox" checked={barber} onChange={event => setBarber(event.target.checked)}/>Add Barber module</label>{barber && barberFeatures.map(([id,label]) => <label key={id}><input type="checkbox" checked={barberSelection.includes(id)} onChange={event => setBarberSelection(previous => event.target.checked ? [...previous,id] : previous.filter(value => value !== id))}/>{label}</label>)}<p>Demo setup: choices last for this session. Account creation requires the backend.</p></fieldset>}
<div className="password-field">{!workspace && <button type="button" className="forgot text-link" onClick={() => setNotice('Password recovery will be available when the service is connected.')}>Forgot password?</button>}<Field label="Password" id="password" icon="lock" type="password" minLength={workspace ? 8 : undefined} placeholder={workspace ? 'Min. 8 characters' : '••••••••'} autoComplete={workspace ? 'new-password' : 'current-password'} /></div>
{!workspace && <label className="remember"><input type="checkbox" />Remember me for 30 days</label>}
<button className="primary" type="submit">{workspace ? 'Create Workspace' : 'Login'}<Icon name={workspace ? 'rocket' : 'arrow'} size={26} /></button>
</form>
{notice && <p className="notice" role="status">{notice}</p>}
{!workspace && <><div className="divider"><span />OR CONTINUE WITH<span /></div><button className="google" onClick={() => setNotice('Google sign-in will be available when the service is connected.')}><span className="google-g">G</span>Sign in with Google</button><p className="footer">Don’t have a workspace? <a href="#create-workspace">Create one</a></p></>}
<p className="footer"><a href="#school-dashboard">Preview School Dashboard</a></p>

</section></main>
}
