import { useSyncExternalStore } from 'react';
import initial from './profile-data.json';
let state = initial;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const getProfileSnapshot = () => state;
export function useProfile() { return useSyncExternalStore(subscribe, getProfileSnapshot, getProfileSnapshot); }
export function updateProfile(fields: Partial<typeof initial.student>) {
  if (Object.values(fields).some(value => !value.trim())) return false;
  state = { ...state, student: { ...state.student, ...fields } };
  listeners.forEach(listener => listener());
  return true;
}
export function recordPayment(id: string) {
  if (!state.fees.some(fee => fee.id === id && fee.status === 'Pending')) return false;
  state = { ...state, fees: state.fees.map(fee => fee.id === id ? { ...fee, status: 'Paid' } : fee) };
  listeners.forEach(listener => listener());
  return true;
}
