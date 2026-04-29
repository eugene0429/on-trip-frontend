import { useState } from 'react';

export type StickerInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

export default function StickerInput({
  label,
  placeholder,
  value,
  onChange,
}: StickerInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      {label && (
        <div className="text-[14px] font-semibold text-outline mb-1">{label}</div>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full h-12 px-4 bg-surface rounded-md text-[15px] text-outline placeholder:text-textMuted outline-none border-[2.5px] ${
          focused ? 'border-accentRed' : 'border-outline'
        }`}
      />
    </label>
  );
}
