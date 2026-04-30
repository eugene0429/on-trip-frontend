export type Region = {
  id: string;
  name: string;
  count: number;
  /** 정적 지도 이미지 위 % 좌표 */
  x: number;
  y: number;
};

export const regions: Region[] = [
  { id: 'gangnam', name: '강남역 9번 출구', count: 55, x: 60, y: 68 },
  { id: 'hongdae', name: '홍대입구역', count: 28, x: 22, y: 38 },
  { id: 'itaewon', name: '이태원역', count: 12, x: 50, y: 56 },
  { id: 'myeongdong', name: '명동성당', count: 8, x: 52, y: 36 },
  { id: 'sinchon', name: '신촌역', count: 45, x: 30, y: 30 },
  { id: 'jongno', name: '종로3가', count: 18, x: 56, y: 26 },
  { id: 'jamsil', name: '잠실역', count: 3, x: 78, y: 70 },
];
