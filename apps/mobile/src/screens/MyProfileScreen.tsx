import { ChevronRight, Flag, LogOut, Settings } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import Chip from '@/components/Chip';
import CoinBadge from '@/components/CoinBadge';
import StickerCard from '@/components/StickerCard';
import { borderWidths, colors, radii, spacing } from '@/design/tokens';

const MENU = [
  { key: 'settings', label: '설정', Icon: Settings },
  { key: 'reports', label: '신고 내역', Icon: Flag },
  { key: 'logout', label: '로그아웃', Icon: LogOut },
] as const;

export default function MyProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          borderBottomWidth: borderWidths.thin,
          borderBottomColor: colors.outline,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.outline }}>마이</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl, gap: spacing.lg }}
      >
        {/* Profile card */}
        <StickerCard offset="md" rounded="lg" style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 64,
                height: 64,
                backgroundColor: colors.accentPink,
                borderRadius: radii.lg,
                borderWidth: borderWidths.normal,
                borderColor: colors.outline,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 26, fontWeight: '800', color: colors.outline }}>나</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.outline }}>서울여행자</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>@onTrip_2026</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                <Chip size="sm" bg={colors.primary}>콕 12회</Chip>
                <Chip size="sm" bg={colors.accentLime}>매칭 4회</Chip>
              </View>
            </View>
          </View>
        </StickerCard>

        {/* Coin balance */}
        <StickerCard offset="md" rounded="lg" style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <CoinBadge count={12} size="md" />
              <View>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>내 코인 잔액</Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: colors.outline, fontVariant: ['tabular-nums'] }}>
                  12 코인
                </Text>
              </View>
            </View>
            <Chip bg={colors.primary}>충전</Chip>
          </View>
        </StickerCard>

        {/* Menu */}
        {MENU.map(({ key, label, Icon }) => (
          <StickerCard key={key} offset="sm" rounded="md" pressable style={{ padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon size={20} color={colors.outline} strokeWidth={2.25} />
              <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: colors.outline }}>
                {label}
              </Text>
              <ChevronRight size={18} color={colors.textMuted} />
            </View>
          </StickerCard>
        ))}
      </ScrollView>
    </View>
  );
}
