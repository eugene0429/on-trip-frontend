export type GenderMix = '남' | '여' | '혼성';

export type Companion = {
  id: number;
  nickname: string;
  intro: string;
  tags: string[];
  photoUrl?: string;
  groupSize: number;
  avgAge: number;
  genderMix: GenderMix;
  avatarBg: string;
};

export const companions: Companion[] = [
  {
    id: 1,
    nickname: '여행토끼',
    intro: '강남 맛집 같이 가실 분~',
    tags: ['맛집', '카페'],
    groupSize: 3,
    avgAge: 24,
    genderMix: '혼성',
    avatarBg: 'bg-accentPink',
  },
  {
    id: 2,
    nickname: '서울러버',
    intro: '술 한잔 어떠세요?',
    tags: ['술자리'],
    groupSize: 2,
    avgAge: 27,
    genderMix: '남',
    avatarBg: 'bg-primary',
  },
  {
    id: 3,
    nickname: 'mintchoco',
    intro: '액티비티 좋아하시면 콕!',
    tags: ['액티비티', '맛집'],
    groupSize: 4,
    avgAge: 22,
    genderMix: '여',
    avatarBg: 'bg-accentLime',
  },
  {
    id: 4,
    nickname: '제주촌놈',
    intro: '서울 처음이라 가이드해주실 분',
    tags: ['관광', '맛집'],
    groupSize: 1,
    avgAge: 29,
    genderMix: '남',
    avatarBg: 'bg-accentRed',
  },
  {
    id: 5,
    nickname: '월요병',
    intro: '늦은 밤 산책할 사람?',
    tags: ['산책'],
    groupSize: 2,
    avgAge: 25,
    genderMix: '혼성',
    avatarBg: 'bg-surface',
  },
];
