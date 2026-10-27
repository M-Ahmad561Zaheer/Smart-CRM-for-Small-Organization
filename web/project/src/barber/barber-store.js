import { useSyncExternalStore } from 'react';
export const services = [
    { id: 'haircut', name: 'Classic Haircut', minutes: 45, cents: 3500, bookings: 42 },
    { id: 'beard', name: 'Beard Sculpting', minutes: 30, cents: 3000, bookings: 31 },
    { id: 'shave', name: 'Hot Towel Shave', minutes: 30, cents: 2500, bookings: 18 },
    { id: 'fade', name: 'Fade & Beard Trim', minutes: 60, cents: 4500, bookings: 24 },
];
let state = {
    clients: [
        { id: 'james', name: 'James Dalton', phone: '+1 (555) 123-4567', email: 'james@example.com', service: 'haircut', loyalty: true, notes: 'Short sides, natural finish.', points: 450 },
        { id: 'alex', name: 'Alex Morgan', phone: '+1 (555) 234-5678', email: 'alex@example.com', service: 'fade', loyalty: true, notes: '', points: 650 },
    ], receipts: [],
};
const listeners = new Set();
const subscribe = (listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const getBarber = () => state;
export const useBarber = () => useSyncExternalStore(subscribe, getBarber, getBarber);
const publish = () => listeners.forEach(listener => listener());
export const money = (cents) => `$${(cents / 100).toFixed(2)}`;
export function addClient(input) {
    if (!input.name.trim() || input.phone.replace(/\D/g, '').length < 7 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || !services.some(s => s.id === input.service))
        return 'Enter a name, valid phone, email and primary service.';
    if (state.clients.some(c => c.email.toLowerCase() === input.email.trim().toLowerCase() || c.phone.replace(/\D/g, '') === input.phone.replace(/\D/g, '')))
        return 'A client with this email or phone already exists.';
    state = { ...state, clients: [...state.clients, { ...input, name: input.name.trim(), email: input.email.trim(), id: `client-${Date.now()}`, points: 0 }] };
    publish();
    return '';
}
export function totals(ids, client, redeem) {
    const subtotal = services.filter(s => ids.includes(s.id)).reduce((sum, s) => sum + s.cents, 0);
    const discount = redeem && client?.loyalty && client.points >= 500 ? Math.min(1000, subtotal) : 0;
    const tax = Math.round((subtotal - discount) * 0.08);
    return { subtotal, discount, tax, total: subtotal - discount + tax, earned: client?.loyalty ? Math.floor((subtotal - discount) / 100) : 0 };
}
export function recordService(clientId, ids, redeem, method) {
    const client = state.clients.find(c => c.id === clientId);
    if (!client || !ids.length || ids.some(id => !services.some(s => s.id === id)))
        return 'Select a client and at least one service.';
    if (!['Cash', 'Card', 'Digital'].includes(method))
        return 'Choose a payment method.';
    if (redeem && (!client.loyalty || client.points < 500))
        return '500 loyalty points are required to redeem.';
    const amount = totals(ids, client, redeem);
    state = { clients: state.clients.map(c => c.id === clientId ? { ...c, points: c.points - (amount.discount ? 500 : 0) + amount.earned } : c), receipts: [...state.receipts, { id: `demo-${Date.now()}`, client: client.name, total: amount.total, method }] };
    publish();
    return '';
}
