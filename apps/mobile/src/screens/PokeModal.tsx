import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import CoinBadge from '@/components/CoinBadge';
import StickerButton from '@/components/StickerButton';
import StickerInput from '@/components/StickerInput';
import { borderWidths, colors, radii, spacing } from '@/design/tokens';
import { type Companion } from '@/mock/companions';

export type PokeModalProps = {
  open: boolean;
  target: Companion | null;
  coinBalance?: number;
  onClose: () => void;
  onSend: (message: string) => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function PokeModal({ open, target, coinBalance = 12, onClose, onSend }: PokeModalProps) {
  const [message, setMessage] = useState('');
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scrimOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      setMessage('');
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scrimOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scrimOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open, scrimOpacity, translateY]);

  if (!target) return null;

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1 }}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: scrimOpacity,
            justifyContent: 'flex-end',
          }}
        >
          <Pressable onPress={() => undefined}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <Animated.View
                style={{
                  backgroundColor: colors.cream,
                  borderTopLeftRadius: radii.lg,
                  borderTopRightRadius: radii.lg,
                  borderTopWidth: borderWidths.normal,
                  borderLeftWidth: borderWidths.normal,
                  borderRightWidth: borderWidths.normal,
                  borderColor: colors.outline,
                  transform: [{ translateY }],
                }}
              >
                {/* Handle */}
                <View style={{ paddingTop: 12, paddingBottom: 4, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 48,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.outline,
                      opacity: 0.5,
                    }}
                  />
                </View>
                {/* X button */}
                <Pressable
                  onPress={onClose}
                  accessibilityLabel="닫기"
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 36,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} color={colors.outline} strokeWidth={2.5} />
                </Pressable>

                <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl, gap: spacing.lg }}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: colors.outline }}>
                    {target.nickname}님에게 콕 보내기
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <CoinBadge count={coinBalance} size="md" />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.outline }}>
                      잔액 {coinBalance} ·{' '}
                      <Text style={{ color: colors.accentRed }}>1코인 차감</Text>
                    </Text>
                  </View>

                  <StickerInput
                    label="한 줄 메시지 (선택)"
                    placeholder="여기서 만날래요?"
                    value={message}
                    onChangeText={setMessage}
                  />

                  <StickerButton variant="primary" fullWidth onPress={() => onSend(message)}>
                    콕 발사
                  </StickerButton>
                </View>
              </Animated.View>
            </KeyboardAvoidingView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
