import { useSyncExternalStore } from 'react';
export const barberFeatures = [{ id: 'clients', label: 'Clients' }, { id: 'payments', label: 'Record Service & Payment' }, { id: 'appointments', label: 'Book Appointments' }, { id: 'reports', label: 'Reports' }] as const;
export type BarberFeature = typeof barberFeatures[number]['id'];
export const gymFeatures = [{ id: 'members', label: 'Members', route: '/gym-members' }, { id: 'renewal', label: 'Membership Renewal', route: '/gym-renewal' }, { id: 'training', label: 'Training Sessions', route: '/gym-training' }, { id: 'reports', label: 'Gym Reports', route: '/gym-reports' }] as const;
export type GymFeature = typeof gymFeatures[number]['id'];
let config: { name: string; gym: boolean; features: GymFeature[]; barber: boolean; barberFeatures: BarberFeature[] } = { name: 'School Management', gym: false, features: [], barber: false, barberFeatures: [] };
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const getWorkspace = () => config;
export function useWorkspace() { return useSyncExternalStore(subscribe, getWorkspace, getWorkspace); }
export function saveWorkspace(name: string, gym: boolean, features: GymFeature[], barber = false, selectedBarber: BarberFeature[] = []) {
  const selected = gym ? gymFeatures.map(item => item.id).filter(id => features.includes(id)) : [];
  if ((barber && !selectedBarber.length) || (gym && !selected.length)) return false;
  config = { name: name.trim() || 'School Management', gym, features: selected, barber, barberFeatures: barber ? selectedBarber : [] };
  listeners.forEach(listener => listener());
  return true;
}
