import { ScrollView, Text, View } from 'react-native';
import CompanionAvatar from '@/components/CompanionAvatar';
import StickerCard from '@/components/StickerCard';
import { borderWidths, colors, radii, spacing } from '@/design/tokens';
import { chatPreviews } from '@/mock/chats';

export default function ChatListScreen() {
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
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.outline }}>채팅</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl, gap: 12 }}
      >
        {chatPreviews.map((c) => (
          <StickerCard
            key={c.id}
            offset="sm"
            rounded="lg"
            pressable
            style={{ padding: 12 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <CompanionAvatar
                fallbackBg={c.avatarBg}
                fallbackLetter={c.nickname[0]}
                width={52}
                height={52}
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <Text
                    numberOfLines={1}
                    style={{ flexShrink: 1, fontSize: 15, fontWeight: '800', color: colors.outline }}
                  >
                    {c.nickname}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted, fontVariant: ['tabular-nums'] }}>
                    {c.time}
                  </Text>
                </View>
                <Text numberOfLines={1} style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                  {c.lastMessage}
                </Text>
              </View>
              {c.unread !== undefined && (
                <View
                  style={{
                    minWidth: 22,
                    height: 22,
                    paddingHorizontal: 6,
                    borderRadius: radii.pill,
                    borderWidth: 2,
                    borderColor: colors.outline,
                    backgroundColor: colors.accentRed,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.surface, fontVariant: ['tabular-nums'] }}>
                    {c.unread}
                  </Text>
                </View>
              )}
            </View>
          </StickerCard>
        ))}
      </ScrollView>
    </View>
  );
}
