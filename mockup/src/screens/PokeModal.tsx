import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import StickerButton from '../components/StickerButton';
import StickerInput from '../components/StickerInput';
import CoinBadge from '../components/CoinBadge';
import { Companion } from '../data/companions';

export type PokeModalProps = {
  open: boolean;
  target: Companion | null;
  coinBalance?: number;
  onClose: () => void;
  onSend: (message: string) => void;
};

export default function PokeModal({ open, target, coinBalance = 12, onClose, onSend }: PokeModalProps) {
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
      setMessage('');
    }
  }, [open]);

  if (!open || !target) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end"
      onClick={onClose}
      style={{
        backgroundColor: mounted ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
        transition: 'background-color 250ms ease-out',
      }}
    >
      <div
        className="relative w-full bg-cream border-t-[2.5px] border-x-[2.5px] border-outline shadow-sticker-lg"
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: mounted ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 250ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-pill bg-outline opacity-50" />
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center"
        >
          <X size={20} color="#2A2A2A" strokeWidth={2.5} />
        </button>

        <div className="px-5 pb-6 pt-2 flex flex-col gap-4">
          <h2 className="text-[24px] font-extrabold text-outline">
            {target.nickname}님에게 콕 보내기
          </h2>

          <div className="flex items-center gap-3">
            <CoinBadge count={coinBalance} size="md" />
            <span className="text-[14px] text-outline font-semibold">
              잔액 {coinBalance} · <span className="text-accentRed">1코인 차감</span>
            </span>
          </div>

          <StickerInput
            label="한 줄 메시지 (선택)"
            placeholder="여기서 만날래요?"
            value={message}
            onChange={setMessage}
          />

          <StickerButton variant="primary" fullWidth onClick={() => onSend(message)}>
            콕 발사
          </StickerButton>
          <StickerButton variant="ghost" fullWidth onClick={onClose}>
            취소
          </StickerButton>
        </div>
      </div>
    </div>
  );
}
