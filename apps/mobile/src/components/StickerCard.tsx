import { ReactNode, useState } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { borderWidths, colors, radii, shadowOffsets, type ShadowKey } from '@/design/tokens';

type Rotate = -2 | -1 | 0 | 1 | 2;
type Rounded = keyof typeof radii;
type Border = 'normal' | 'thin' | 'none';

export type StickerCardProps = {
  offset?: ShadowKey;
  rotate?: Rotate;
  bg?: string;
  border?: Border;
  rounded?: Rounded;
  pressable?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function StickerCard({
  offset = 'md',
  rotate = 0,
  bg = colors.surface,
  border = 'normal',
  rounded = 'lg',
  pressable = false,
  onPress,
  style,
  children,
}: StickerCardProps) {
  const [pressed, setPressed] = useState(false);
  const offsetPx = shadowOffsets[offset];
  const radius = radii[rounded];
  const borderWidth =
    border === 'normal' ? borderWidths.normal : border === 'thin' ? borderWidths.thin : 0;

  const cardBaseStyle: ViewStyle = {
    backgroundColor: bg,
    borderWidth,
    borderColor: colors.outline,
    borderRadius: radius,
    transform: [
      { translateX: pressed ? offsetPx : 0 },
      { translateY: pressed ? offsetPx : 0 },
    ],
  };

  const wrapperStyle: ViewStyle = {
    transform: [{ rotate: `${rotate}deg` }],
  };

  const shadowStyle: ViewStyle = {
    position: 'absolute',
    top: offsetPx,
    left: offsetPx,
    right: -offsetPx,
    bottom: -offsetPx,
    backgroundColor: colors.outline,
    borderRadius: radius,
  };

  if (pressable) {
    return (
      <View style={wrapperStyle}>
        <View style={shadowStyle} />
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={onPress}
          style={[cardBaseStyle, style]}
        >
          {children}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={wrapperStyle}>
      <View style={shadowStyle} />
      <View style={[cardBaseStyle, style]}>{children}</View>
    </View>
  );
}
