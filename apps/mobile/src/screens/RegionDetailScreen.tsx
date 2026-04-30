import { ArrowLeft, Calendar, ChevronDown, Hand, Users } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Chip from '@/components/Chip';
import CompanionAvatar from '@/components/CompanionAvatar';
import StickerCard from '@/components/StickerCard';
import { borderWidths, colors, radii, spacing } from '@/design/tokens';
import { type Companion, type GenderMix, companions } from '@/mock/companions';
import { regions } from '@/mock/regions';

const GENDER_BG: Record<GenderMix, string> = {
  남: colors.surface,
  여: colors.accentPink,
  혼성: colors.accentLime,
};

const FILTERS = ['여행 일정', '성별', '일행 수'] as const;

function rotateForId(id: number): -1 | 0 | 1 {
  const m = id % 3;
  return (m === 0 ? -1 : m === 1 ? 0 : 1) as -1 | 0 | 1;
}

export type RegionDetailScreenProps = {
  regionId: string;
  onBack?: () => void;
  onPokePress?: (companion: Companion) => void;
};

export default function RegionDetailScreen({ regionId, onBack, onPokePress }: RegionDetailScreenProps) {
  const region = regions.find((r) => r.id === regionId) ?? regions[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          borderBottomWidth: borderWidths.thin,
          borderBottomColor: colors.outline,
        }}
      >
        <Pressable onPress={onBack} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="뒤로">
          <ArrowLeft size={22} color={colors.outline} strokeWidth={2.5} />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 20, fontWeight: '800', color: colors.outline }}>
          {region.name}
        </Text>
        <Chip bg={colors.primary}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.outline, fontVariant: ['tabular-nums'] }}>
            {region.count}명
          </Text>
        </Chip>
      </View>

      {/* Filter chips */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 4 }}>
        {FILTERS.map((label) => (
          <FilterChip key={label} label={label} />
        ))}
      </View>

      {/* Hint */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: 8,
          paddingBottom: 4,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Hand size={13} color={colors.textMuted} strokeWidth={2.25} />
        <Text style={{ fontSize: 12, color: colors.textMuted }}>
          카드를 탭하면 콕을 보낼 수 있어요
        </Text>
      </View>

      {/* Companion list */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: 20 }}
      >
        {companions.map((c) => (
          <StickerCard
            key={c.id}
            offset="md"
            rotate={rotateForId(c.id)}
            rounded="lg"
            pressable
            onPress={() => onPokePress?.(c)}
            style={{ padding: 14 }}
          >
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'stretch' }}>
              <CompanionAvatar
                photoUrl={c.photoUrl}
                fallbackBg={c.avatarBg}
                fallbackLetter={c.nickname[0]}
                width={96}
                stretch
              />
              <View style={{ flex: 1, justifyContent: 'center', gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <Text
                    numberOfLines={1}
                    style={{ flexShrink: 1, fontSize: 17, fontWeight: '800', color: colors.outline }}
                  >
                    {c.nickname}
                  </Text>
                  <Chip size="sm" bg={GENDER_BG[c.genderMix]}>
                    {c.genderMix}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Users size={12} color={colors.outline} strokeWidth={2.5} />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.outline, fontVariant: ['tabular-nums'] }}>
                    {c.groupSize}명
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.outline, opacity: 0.3 }}>·</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.outline, fontVariant: ['tabular-nums'] }}>
                    평균 {c.avgAge}세
                  </Text>
                </View>
                <Text numberOfLines={2} style={{ fontSize: 13.5, color: colors.outline, lineHeight: 18 }}>
                  {c.intro}
                </Text>
              </View>
            </View>

            {/* Footer band */}
            <View
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTopWidth: borderWidths.thin,
                borderTopColor: 'rgba(42,42,42,0.3)',
                borderStyle: 'dashed',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {c.tags.map((t) => (
                  <Chip key={t} size="sm" bg={colors.surfaceMuted}>
                    {t}
                  </Chip>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Calendar size={12} color={colors.outline} strokeWidth={2.25} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.outline, fontVariant: ['tabular-nums'] }}>
                  {c.travelPeriod}
                </Text>
              </View>
            </View>
          </StickerCard>
        ))}
      </ScrollView>
    </View>
  );
}

function FilterChip({ label }: { label: string }) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: colors.surface,
        borderWidth: borderWidths.normal,
        borderColor: colors.outline,
        borderRadius: radii.pill,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        transform: [
          { translateX: pressed ? 2 : 0 },
          { translateY: pressed ? 2 : 0 },
        ],
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.outline }}>{label}</Text>
      <ChevronDown size={14} color={colors.outline} strokeWidth={2.5} />
    </Pressable>
  );
}
