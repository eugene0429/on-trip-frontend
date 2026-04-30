import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatListScreen from '@/screens/ChatListScreen';
import MyProfileScreen from '@/screens/MyProfileScreen';
import type { RootTabParamList } from './types';
import CustomTabBar from './CustomTabBar';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="chat" component={ChatListScreen} />
      <Tab.Screen name="home" component={HomeStack} />
      <Tab.Screen name="my" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}
