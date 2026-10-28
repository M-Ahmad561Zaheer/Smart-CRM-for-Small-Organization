import { useSyncExternalStore } from 'react'
export const barberFeatures = [['clients', 'Clients'], ['payments', 'Record Service & Payment'], ['appointments', 'Book Appointments'], ['reports', 'Reports']]
export const gymFeatures = [['members', 'Members'], ['renewal', 'Membership Renewal'], ['training', 'Training Sessions'], ['reports', 'Gym Reports']]
let config = { name: 'School Management', gym: false, features: [], barber: false, barberFeatures: [] }
const listeners = new Set()
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener) }
export const getWorkspace = () => config
export function useWorkspace() { return useSyncExternalStore(subscribe, getWorkspace, getWorkspace) }
export function saveWorkspace(name, gym, features, barber = false, selectedBarber = []) {
  const selected = gym ? gymFeatures.map(([id]) => id).filter(id => features.includes(id)) : []
  if ((barber && !selectedBarber.length) || (gym && !selected.length)) return false
  config = { name: name.trim() || 'School Management', gym, features: selected, barber, barberFeatures: barber ? selectedBarber : [] }
  listeners.forEach(listener => listener())
  return true
}
export function gymFeatureForRoute(route) {
  const page = route.replace('#gym-', '').split('/')[0]
  return page === 'member' || page === 'add-member' ? 'members' : page
}
