import { Image } from 'expo-image';
import icons from './icons.json';

const extra: Record<string, string> = {
  back: 'M20 12H4 M11 5l-7 7 7 7',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0 M15 15l6 6',
  filter: 'M3 5h18 M6 11h12 M10 17h4',
  trend: 'M3 17l6-6 4 4 8-10 M15 5h6v6',
  addPerson: 'M14 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M2 22v-4c0-5 16-5 16 0v4z M20 3v8 M16 7h8',
};
export default function SchoolIcon({ name, color = '#0050d5', size = 22 }: { name: string; color?: string; size?: number }) {
  const path = extra[name] || icons[name as keyof typeof icons];
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"/></svg>';
  return <Image source={{ uri: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg) }} style={{ width: size, height: size }} accessibilityElementsHidden />;
}
