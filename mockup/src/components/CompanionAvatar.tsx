type CompanionAvatarProps = {
  photoUrl?: string;
  fallbackBg: string;
  fallbackLetter: string;
  /** 가로 폭. 세로는 부모 flex 의 items-stretch 로 늘어남 (또는 height 명시). */
  width?: number;
  /** 세로 폭을 명시적으로 고정하고 싶을 때. */
  height?: number;
};

export default function CompanionAvatar({
  photoUrl,
  fallbackBg,
  fallbackLetter,
  width = 64,
  height,
}: CompanionAvatarProps) {
  const isFixed = height !== undefined;
  const sharedStyle: React.CSSProperties = {
    width,
    minHeight: width,
    ...(isFixed ? { height } : { height: '100%', alignSelf: 'stretch' }),
  };

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className="rounded-lg border-[2.5px] border-outline object-cover"
        style={sharedStyle}
      />
    );
  }
  return (
    <div
      className={`${fallbackBg} rounded-lg border-[2.5px] border-outline flex items-center justify-center font-extrabold text-outline`}
      style={{ ...sharedStyle, fontSize: Math.round(width * 0.42) }}
    >
      {fallbackLetter}
    </div>
  );
}
