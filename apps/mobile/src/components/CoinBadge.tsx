import { Text, View } from 'react-native';
import { borderWidths, colors, radii, shadowOffsets } from '@/design/tokens';

type Size = 'sm' | 'md' | 'lg';

const SIZE_PX: Record<Size, number> = { sm: 32, md: 40, lg: 56 };
const FONT_SIZE: Record<Size, number> = { sm: 12, md: 14, lg: 20 };

export type CoinBadgeProps = {
  count: number;
  size?: Size;
};

export default function CoinBadge({ count, size = 'md' }: CoinBadgeProps) {
  const px = SIZE_PX[size];
  const offset = shadowOffsets.sm;
  return (
    <View style={{ width: px, height: px }}>
      <View
        style={{
          position: 'absolute',
          top: offset,
          left: offset,
          width: px,
          height: px,
          backgroundColor: colors.outline,
          borderRadius: radii.pill,
        }}
      />
      <View
        style={{
          width: px,
          height: px,
          backgroundColor: colors.primary,
          borderWidth: borderWidths.normal,
          borderColor: colors.outline,
          borderRadius: radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: FONT_SIZE[size],
            fontWeight: '700',
            color: colors.outline,
            fontVariant: ['tabular-nums'],
          }}
        >
          {count}
        </Text>
      </View>
    </View>
  );
}
