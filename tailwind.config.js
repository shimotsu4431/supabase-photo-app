const plugin = require('tailwindcss/plugin')

module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        // 'md': {'min': '560px', 'max': '960px'} 560 〜 960の間のスタイルが定義できる
        md: '560px', // min-width: 560px
        lg: '960px', // min-width: 960px
      },
      colors: {
        main: '#297a89',
        main_hover: '#4eb7ca',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.skew-5deg': {
          transform: 'skewY(-5deg)',
        },
      }
      addUtilities(newUtilities)
    }),
  ],
}
