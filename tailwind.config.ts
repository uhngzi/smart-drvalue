import type { Config } from "tailwindcss";

const px0_100 = Object.fromEntries(
  Array.from(Array(101)).map((_, i) => [i, `${i}px`]),
);

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        'back': '#F5F6FA',
        'point1': '#4880FF',
        'point2': '#1814F3',
        'point3': '#1677FF',

        'orange': '#E99151',
        'rOrange': '#ffe6d2',
        'pink': '#E951BF',
        'rPink': '#f3d1ec',
        'mint': '#00B69B',
        'rMint': '#d9f1ec',
        'purple': '#7551E9',
        'rPurple': '#b8a9f0',

        'thead': '#F1F4F9',
        'line': '#D5D5D5',

        'devider': '#979797',
      },
      fontSize: {
        ...px0_100,
      },
      spacing: {
        ...px0_100,
      },
      borderRadius: {
        ...px0_100,
      },
      borderWidth: {
        ...px0_100,
      },
      padding: {
        ...px0_100,
      },
    },
  },
  plugins: [
    function ({
      addUtilities,
    }: {
      addUtilities: (components: Record<string, any>) => void;
    }) {
      // 유틸리티 클래스 추가
      addUtilities({
        '.h-center': {
          display: 'flex',
          'align-items': 'center',
        },
        '.v-h-center': {
          display: 'flex',
          'align-items': 'center',
          'justify-content' : 'center',
        },
      });

      addUtilities({
        '.children__pointer': {
          '> *': {
            cursor: 'pointer',
          },
        },
      });
    },
  ],
} satisfies Config;
