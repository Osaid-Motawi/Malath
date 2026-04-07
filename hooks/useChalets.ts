import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
interface Chalet {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  discount: number;
  photo: {          
    photoA: string;
    photoB: string;
    photoC: string;
    photoD: string;
    photoE: string;
    photoF: string;
    photoG: string;
    photoH: string;
  };
}
const useChalets = (selectedCity: string) => {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    setLoading(true);

    let query = firestore().collection('chalets');

    const unsubscribe = query.onSnapshot(snapshot => {
      let data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Chalet[];

      if (selectedCity && selectedCity !== 'الكل') {
        data = data.filter(c => c.location === selectedCity);
      }

      setChalets(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedCity]);
 return { chalets, cities, loading };
};
export default useChalets;