import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { borderWidths, colors, radii } from '@/design/tokens';

export type StickerInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
};

export default function StickerInput({ label, placeholder, value, onChangeText }: StickerInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.outline, marginBottom: 4 }}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: 48,
          paddingHorizontal: 16,
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          borderWidth: borderWidths.normal,
          borderColor: focused ? colors.accentRed : colors.outline,
          fontSize: 15,
          color: colors.outline,
        }}
      />
    </View>
  );
}
