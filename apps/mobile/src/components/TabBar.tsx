import { Home, MessageCircle, User } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { borderWidths, colors, radii } from '@/design/tokens';

export type TabKey = 'chat' | 'home' | 'my';

const TABS: { key: TabKey; Icon: typeof Home; label: string }[] = [
  { key: 'chat', Icon: MessageCircle, label: '채팅' },
  { key: 'home', Icon: Home, label: '홈' },
  { key: 'my', Icon: User, label: '마이' },
];

export type TabBarProps = {
  active: TabKey;
  onTab?: (key: TabKey) => void;
};

export default function TabBar({ active, onTab }: TabBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 64,
        backgroundColor: colors.surface,
        borderTopWidth: borderWidths.normal,
        borderTopColor: colors.outline,
      }}
    >
      {TABS.map(({ key, Icon, label }) => {
        const isActive = key === active;
        return (
          <Pressable
            key={key}
            accessibilityLabel={label}
            onPress={() => onTab?.(key)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isActive && (
              <View
                style={{
                  position: 'absolute',
                  top: 8,
                  width: 6,
                  height: 6,
                  borderRadius: radii.pill,
                  backgroundColor: colors.primary,
                  borderWidth: 1,
                  borderColor: colors.outline,
                }}
              />
            )}
            <Icon
              size={isActive ? 28 : 24}
              color={colors.outline}
              strokeWidth={isActive ? 2.75 : 2}
            />
            <Text
              accessibilityElementsHidden
              style={{
                fontSize: 0,
                width: 0,
                height: 0,
                opacity: 0,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
