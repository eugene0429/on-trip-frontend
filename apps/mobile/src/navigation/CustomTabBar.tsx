import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBar, { type TabKey } from '@/components/TabBar';

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const active = state.routeNames[state.index] as TabKey;
  return (
    <TabBar
      active={active}
      onTab={(key) => navigation.navigate(key)}
    />
  );
}
