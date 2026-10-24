import icons from './icons.json'

const extra = {
  back: 'M20 12H4 M11 5l-7 7 7 7',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0 M15 15l6 6',
  filter: 'M3 5h18 M6 11h12 M10 17h4',
  trend: 'M3 17l6-6 4 4 8-10 M15 5h6v6',
  addPerson: 'M14 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M2 22v-4c0-5 16-5 16 0v4z M20 3v8 M16 7h8',
}
export default function SchoolIcon({ name, size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={extra[name] || icons[name]} /></svg>
}
