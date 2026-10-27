import GymDashboard from '@/components/gym/gym-dashboard';
import GymFeatureGate from '@/components/gym-feature-gate';
export default function GymDashboardPage() { return <GymFeatureGate feature="dashboard"><GymDashboard /></GymFeatureGate>; }
