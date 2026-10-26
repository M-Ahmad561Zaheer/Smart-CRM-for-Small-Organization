import { useState } from 'react'
import banner from './gym-training.jpg'
import './training.css'

const trainers = [{ id: 'marcus', name: 'Marcus Thompson', initials: 'MT', role: 'Senior Specialist' }, { id: 'sarah', name: 'Sarah Chen', initials: 'SC', role: 'Yoga & Pilates' }]
const types = ['Strength Training', 'Personal Training', 'Yoga & Pilates', 'Cardio Training']
export default function TrainingSessions({ members }) {
  const [memberId, setMemberId] = useState('')
  const member = members.find(item => item.id === memberId)
  const [trainer, setTrainer] = useState('marcus')
  const [date, setDate] = useState('2026-06-07')
  const [time, setTime] = useState('10:00')
  const [type, setType] = useState(types[0])
  const [booking, setBooking] = useState(null)
  function submit(event) {
    event.preventDefault()
    if (!member) return
    setBooking({ date, time, type, member: `${member.name} (${member.membershipId})`, trainer: trainers.find(item => item.id === trainer).name })
  }
  return <div className="training-layout"><div>
    <div className="training-banner"><img src={banner} alt="Gym training equipment"/><div><span>TRAINING SESSIONS</span><h2>Schedule Personal Training</h2></div></div>
    <form className="training-form" onSubmit={submit} onChange={() => setBooking(null)}>
      <section className="g-panel"><h2 className="training-section-title">SELECT MEMBER</h2><label>Member<select required value={memberId} onChange={event => setMemberId(event.target.value)}><option value="" disabled>Select a member</option>{members.map(item => <option key={item.id} value={item.id}>{item.name} · {item.membershipId}</option>)}</select></label>{member && <p className="g-caption">{member.plan} · {member.status}</p>}{!members.length && <p>No members available. Add a member first.</p>}</section>
      <section className="g-panel"><h2 className="training-section-title">SELECT DATE & TIME</h2><div className="g-form-grid"><label>Session Date<input type="date" required value={date} onChange={event => setDate(event.target.value)}/></label><label>Session Time<input type="time" required value={time} onChange={event => setTime(event.target.value)}/></label></div></section>
      <section className="g-panel"><h2 className="training-section-title">BOOKING DETAILS</h2><fieldset className="training-trainers"><legend>Select Trainer</legend>{trainers.map(item => <label className={trainer === item.id ? 'selected' : ''} key={item.id}><input type="radio" name="trainer" value={item.id} checked={trainer === item.id} onChange={() => setTrainer(item.id)}/><span className="g-avatar">{item.initials}</span><span><strong>{item.name}</strong><small>{item.role}</small></span></label>)}</fieldset><label>Session Type<select value={type} onChange={event => setType(event.target.value)}>{types.map(item => <option key={item}>{item}</option>)}</select></label></section>
      <div className="training-reminder"><span aria-hidden="true">♧</span><div><strong>Automated Reminders</strong><p>SMS and push reminders are planned for the member and trainer 1 hour before the session. Delivery will be enabled when the backend is connected.</p></div></div>
      <button className="g-button training-book" type="submit">▣ Book Session</button>
    </form>
  </div><aside><section className="g-panel training-summary"><div className="g-panel-head"><h2>Session Summary</h2><span className="g-badge good">DEMO</span></div><dl>{[['Member', member ? `${member.name} (${member.membershipId})` : 'Select a member'], ['Trainer', trainers.find(item => item.id === trainer).name], ['Session', type], ['Date', date || 'Select date'], ['Time', time || 'Select time']].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="g-caption">Preview only. No booking or notifications are sent to a server.</p></section>{booking && <section className="g-panel training-success" role="status"><h2>Session preview ready</h2><p>Member: {booking.member}</p><p>{booking.type} with {booking.trainer}</p><p>{booking.date} at {booking.time}</p><p className="g-muted">Your details are valid. Booking confirmation will be available when the service is connected.</p></section>}</aside></div>
}
