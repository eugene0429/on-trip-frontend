type CompanionAvatarProps = {
  photoUrl?: string;
  fallbackBg: string;
  fallbackLetter: string;
  size?: number;
};

export default function CompanionAvatar({
  photoUrl,
  fallbackBg,
  fallbackLetter,
  size = 64,
}: CompanionAvatarProps) {
  const dim = { width: size, height: size };
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className="rounded-lg border-[2.5px] border-outline object-cover"
        style={dim}
      />
    );
  }
  return (
    <div
      className={`${fallbackBg} rounded-lg border-[2.5px] border-outline flex items-center justify-center font-extrabold text-outline`}
      style={{ ...dim, fontSize: Math.round(size * 0.4) }}
    >
      {fallbackLetter}
    </div>
  );
}
