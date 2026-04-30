import { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/design/tokens';
import StickerCard from './StickerCard';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'disabled';
type Size = 'lg' | 'md' | 'sm';

const VARIANT_BG: Record<Variant, string> = {
  primary: colors.primary,
  secondary: colors.surface,
  danger: colors.accentRed,
  ghost: 'transparent',
  disabled: colors.surfaceMuted,
};

const VARIANT_TEXT_COLOR: Record<Variant, string> = {
  primary: colors.outline,
  secondary: colors.outline,
  danger: colors.surface,
  ghost: colors.outline,
  disabled: colors.textMuted,
};

const SIZE_HEIGHT: Record<Size, number> = { lg: 56, md: 48, sm: 36 };

export type StickerButtonProps = {
  variant?: Variant;
  size?: Size;
  onPress?: () => void;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function StickerButton({
  variant = 'primary',
  size = 'lg',
  onPress,
  fullWidth = false,
  style,
  children,
}: StickerButtonProps) {
  const disabled = variant === 'disabled';
  const offset = size === 'sm' ? 'sm' : 'md';
  const border = variant === 'ghost' || disabled ? 'thin' : 'normal';

  const inner = (
    <View
      style={{
        height: SIZE_HEIGHT[size],
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {typeof children === 'string' ? (
        <Text style={{ fontSize: 16, fontWeight: '700', color: VARIANT_TEXT_COLOR[variant] }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );

  return (
    <View style={[fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }, style]}>
      <StickerCard
        offset={offset}
        bg={VARIANT_BG[variant]}
        rounded="xl"
        border={border}
        pressable={!disabled}
        onPress={disabled ? undefined : onPress}
      >
        {inner}
      </StickerCard>
    </View>
  );
}
