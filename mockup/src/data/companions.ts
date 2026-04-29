export type Companion = {
  id: number;
  nickname: string;
  age: number;
  gender: 'F' | 'M';
  intro: string;
  tags: string[];
  avatarBg: string;
};

export const companions: Companion[] = [
  { id: 1, nickname: '여행토끼',  age: 24, gender: 'F', intro: '강남 맛집 같이 가실 분~',     tags: ['맛집', '카페'],            avatarBg: 'bg-accentPink' },
  { id: 2, nickname: '서울러버',  age: 26, gender: 'M', intro: '술 한잔 어떠세요?',           tags: ['술자리'],                  avatarBg: 'bg-primary' },
  { id: 3, nickname: 'mintchoco', age: 22, gender: 'F', intro: '액티비티 좋아하시면 콕!',     tags: ['액티비티', '맛집'],         avatarBg: 'bg-accentLime' },
  { id: 4, nickname: '제주촌놈',  age: 29, gender: 'M', intro: '서울 처음이라 가이드해주실 분', tags: ['관광', '맛집'],            avatarBg: 'bg-accentRed' },
  { id: 5, nickname: '월요병',    age: 25, gender: 'F', intro: '늦은 밤 산책할 사람?',         tags: ['산책'],                    avatarBg: 'bg-surface' },
];
