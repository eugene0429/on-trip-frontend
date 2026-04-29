import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFCEB',
        surface: '#FFFFFF',
        surfaceMuted: '#F4F0E0',
        outline: '#2A2A2A',
        textMuted: '#6B6B6B',
        primary: '#FFE066',
        primaryPressed: '#F0CD3F',
        accentRed: '#FF5A5A',
        accentLime: '#B5E48C',
        accentPink: '#FFB3D9',
        success: '#52B788',
        danger: '#E63946',
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        pill: '999px',
      },
      boxShadow: {
        'sticker-xs': '2px 2px 0 0 #2A2A2A',
        'sticker-sm': '4px 4px 0 0 #2A2A2A',
        'sticker-md': '6px 6px 0 0 #2A2A2A',
        'sticker-lg': '8px 8px 0 0 #2A2A2A',
        'sticker-xl': '10px 10px 0 0 #2A2A2A',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
