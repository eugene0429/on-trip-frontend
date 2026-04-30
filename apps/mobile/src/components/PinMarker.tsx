import { Pressable, Text, View } from 'react-native';
import { borderWidths, colors, radii, shadowOffsets } from '@/design/tokens';

type PinColor = { bg: string; textColor: string };

function colorForCount(count: number): PinColor {
  if (count <= 9) return { bg: colors.surface, textColor: colors.outline };
  if (count <= 29) return { bg: colors.primary, textColor: colors.outline };
  if (count <= 69) return { bg: colors.accentPink, textColor: colors.outline };
  return { bg: colors.accentRed, textColor: colors.surface };
}

function sizeForCount(count: number): number {
  return 32 + Math.min(count / 3, 32);
}

export type PinMarkerProps = {
  count: number;
  name: string;
  /** 부모 (relative 컨테이너) 기준 % 좌표 */
  position: { x: number; y: number };
  /** 부모 컨테이너의 폭/높이 — % 좌표를 픽셀로 환산 */
  parentSize: { width: number; height: number };
  onPress?: () => void;
};

export default function PinMarker({ count, name, position, parentSize, onPress }: PinMarkerProps) {
  const { bg, textColor } = colorForCount(count);
  const size = sizeForCount(count);
  const x = (position.x / 100) * parentSize.width;
  const y = (position.y / 100) * parentSize.height;
  const offset = shadowOffsets.sm;

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        alignItems: 'center',
      }}
    >
      <View style={{ width: size, height: size }}>
        <View
          style={{
            position: 'absolute',
            top: offset,
            left: offset,
            width: size,
            height: size,
            backgroundColor: colors.outline,
            borderRadius: radii.pill,
          }}
        />
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: bg,
            borderWidth: borderWidths.normal,
            borderColor: colors.outline,
            borderRadius: radii.pill,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: Math.max(11, size * 0.32),
              fontWeight: '700',
              color: textColor,
              fontVariant: ['tabular-nums'],
            }}
          >
            {count}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 4,
          backgroundColor: colors.surface,
          borderWidth: borderWidths.thin,
          borderColor: colors.outline,
          borderRadius: radii.pill,
          paddingHorizontal: 8,
          paddingVertical: 1,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '600', color: colors.outline }}>{name}</Text>
      </View>
    </Pressable>
  );
}
