import { useLocalSearchParams } from 'expo-router';
import BarberScreen from '../../components/barber-screen';
export default function BarberRoute() {
  const { screen, clientId } = useLocalSearchParams<{ screen: string; clientId?: string }>();
  return <BarberScreen key={`${screen}-${clientId}`} page={screen} clientId={clientId} />;
}
