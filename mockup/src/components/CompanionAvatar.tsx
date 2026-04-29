import React from 'react';

type CompanionAvatarProps = {
  photoUrl?: string;
  fallbackBg: string;
  fallbackLetter: string;
  /** 가로 폭. 세로는 height 미지정 시 부모 flex 의 cross-axis 에 맞춰 늘어남. */
  width?: number;
  /** 세로 폭을 명시적으로 고정하고 싶을 때 (예: 채팅 리스트 썸네일). */
  height?: number;
};

export default function CompanionAvatar({
  photoUrl,
  fallbackBg,
  fallbackLetter,
  width = 96,
  height,
}: CompanionAvatarProps) {
  const isFixed = height !== undefined;
  const containerStyle: React.CSSProperties = isFixed
    ? { width, height, flexShrink: 0 }
    : {
        width,
        minHeight: width,
        alignSelf: 'stretch',
        flexShrink: 0,
      };

  return (
    <div
      className={`relative rounded-lg border-[2.5px] border-outline overflow-hidden ${photoUrl ? 'bg-surface' : fallbackBg}`}
      style={containerStyle}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center font-extrabold text-outline"
          style={{ fontSize: Math.round(width * 0.5) }}
        >
          {fallbackLetter}
        </div>
      )}
    </div>
  );
}
