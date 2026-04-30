import { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { borderWidths, colors, radii, shadowOffsets } from '@/design/tokens';

export type ChipProps = {
  bg?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function Chip({ bg = colors.surface, size = 'md', style, children }: ChipProps) {
  const isSm = size === 'sm';
  const offset = shadowOffsets.xs;

  return (
    <View style={[{ alignSelf: 'flex-start' }, style]}>
      <View
        style={{
          position: 'absolute',
          top: offset,
          left: offset,
          right: -offset,
          bottom: -offset,
          backgroundColor: colors.outline,
          borderRadius: radii.pill,
        }}
      />
      <View
        style={{
          backgroundColor: bg,
          borderWidth: borderWidths.chip,
          borderColor: colors.outline,
          borderRadius: radii.pill,
          paddingHorizontal: isSm ? 8 : 12,
          paddingVertical: isSm ? 2 : 4,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {typeof children === 'string' ? (
          <Text
            style={{
              fontSize: isSm ? 11 : 12,
              fontWeight: '600',
              color: colors.outline,
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}
