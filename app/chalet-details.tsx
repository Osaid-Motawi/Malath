import { useLocalSearchParams } from 'expo-router';
import ChaletDetailsPage from './page/screens/chalet/ChaletDetailsPage';

export default function ChaletDetails() {
  const { chaletId } = useLocalSearchParams<{ chaletId: string }>();
  return <ChaletDetailsPage chaletId={chaletId} />;
}