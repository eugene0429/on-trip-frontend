import { Bell, Crosshair, Megaphone, Rocket, Store } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '@/components/Chip';
import PinMarker from '@/components/PinMarker';
import StickerButton from '@/components/StickerButton';
import StickerCard from '@/components/StickerCard';
import { colors, spacing } from '@/design/tokens';
import { regions } from '@/mock/regions';

export type MapScreenProps = {
  onPinPress?: (regionId: string) => void;
};

export default function MapScreen({ onPinPress }: MapScreenProps) {
  const insets = useSafeAreaInsets();
  const [pinArea, setPinArea] = useState({ width: 0, height: 0 });

  const onPinAreaLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setPinArea({ width, height });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Top header (logo chip + action chips) */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 12,
          left: 16,
          right: 16,
          zIndex: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Chip bg={colors.primary}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.outline, letterSpacing: -0.3 }}>
            On-Trip
          </Text>
        </Chip>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <StickerCard offset="xs" rounded="pill" pressable style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={18} color={colors.outline} />
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.accentRed,
                borderWidth: 1.5,
                borderColor: colors.outline,
              }}
            />
          </StickerCard>
          <StickerCard offset="xs" rounded="pill" pressable style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Store size={18} color={colors.outline} />
          </StickerCard>
          <StickerCard offset="xs" rounded="pill" pressable style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Megaphone size={18} color={colors.outline} />
          </StickerCard>
        </View>
      </View>

      {/* Map placeholder + pin area */}
      <View
        style={{ flex: 1, position: 'relative' }}
        onLayout={onPinAreaLayout}
      >
        {/* TODO(S2): 카카오맵 SDK 통합. 현재는 cream 배경 + 핀만 표시. */}
        {pinArea.width > 0 &&
          regions.map((r) => (
            <PinMarker
              key={r.id}
              count={r.count}
              name={r.name}
              position={{ x: r.x, y: r.y }}
              parentSize={pinArea}
              onPress={() => onPinPress?.(r.id)}
            />
          ))}

        {/* My location button */}
        <View style={{ position: 'absolute', right: 16, bottom: 80, zIndex: 20 }}>
          <StickerCard offset="sm" rounded="pill" pressable style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Crosshair size={20} color={colors.outline} strokeWidth={2.5} />
          </StickerCard>
        </View>
      </View>

      {/* Bottom CTA */}
      <View
        style={{
          position: 'absolute',
          bottom: spacing.lg,
          left: spacing.lg,
          right: spacing.lg,
          zIndex: 20,
        }}
      >
        <StickerButton variant="primary" fullWidth>
          <Rocket size={20} color={colors.outline} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.outline }}>여행 왔어요</Text>
        </StickerButton>
      </View>
    </View>
  );
}
