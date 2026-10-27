import { useLocalSearchParams } from 'expo-router';
import BarberScreen from '../../components/barber-screen';
export default function BarberRoute() {
  const { screen } = useLocalSearchParams<{ screen: string }>();
  return <BarberScreen key={screen} page={screen} />;
}
