import { colors } from '@/design/tokens';

export type ChatPreview = {
  id: number;
  nickname: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unread?: number;
};

export const chatPreviews: ChatPreview[] = [
  { id: 1, nickname: '여행토끼', avatarBg: colors.accentPink, lastMessage: '내일 오후 7시 어때요?', time: '12:34', unread: 2 },
  { id: 2, nickname: '서울러버', avatarBg: colors.primary, lastMessage: '담주에 보러 갈게요!', time: '어제' },
  { id: 3, nickname: 'mintchoco', avatarBg: colors.accentLime, lastMessage: '액티비티 추천 감사해요 ㅎㅎ', time: '월요일', unread: 1 },
  { id: 4, nickname: '제주촌놈', avatarBg: colors.accentRed, lastMessage: '서울 지하철 어렵네요…', time: '4/25' },
];
