import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import MapScreen from '@/screens/MapScreen';
import PokeModal from '@/screens/PokeModal';
import RegionDetailScreen from '@/screens/RegionDetailScreen';
import type { Companion } from '@/mock/companions';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  const [pokeTarget, setPokeTarget] = useState<Companion | null>(null);

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
        <Stack.Screen name="Map">
          {({ navigation }) => (
            <MapScreen
              onPinPress={(regionId) => navigation.navigate('RegionDetail', { regionId })}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="RegionDetail">
          {({ route, navigation }) => (
            <RegionDetailScreen
              regionId={route.params.regionId}
              onBack={() => navigation.goBack()}
              onPokePress={(companion) => setPokeTarget(companion)}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>

      <PokeModal
        open={pokeTarget !== null}
        target={pokeTarget}
        onClose={() => setPokeTarget(null)}
        onSend={() => setPokeTarget(null)}
      />
    </>
  );
}
