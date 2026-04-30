import { Image, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { borderWidths, colors, radii } from '@/design/tokens';

export type CompanionAvatarProps = {
  photoUrl?: string;
  fallbackBg: string;
  fallbackLetter: string;
  width?: number;
  height?: number;
  /** parent flex 의 cross-axis 에 맞춰 늘어나야 하는 경우 true */
  stretch?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function CompanionAvatar({
  photoUrl,
  fallbackBg,
  fallbackLetter,
  width = 96,
  height,
  stretch = false,
  style,
}: CompanionAvatarProps) {
  const fixed = height !== undefined;
  const containerStyle: ViewStyle = fixed
    ? { width, height }
    : stretch
      ? { width, alignSelf: 'stretch', minHeight: width }
      : { width, height: width };

  return (
    <View
      style={[
        {
          borderRadius: radii.lg,
          borderWidth: borderWidths.normal,
          borderColor: colors.outline,
          overflow: 'hidden',
          backgroundColor: photoUrl ? colors.surface : fallbackBg,
        },
        containerStyle,
        style,
      ]}
    >
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: Math.round(width * 0.5), fontWeight: '800', color: colors.outline }}>
            {fallbackLetter}
          </Text>
        </View>
      )}
    </View>
  );
}
