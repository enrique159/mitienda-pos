import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "brand-orange": "#FF7270",
        "brand-pink": "#E15B73",
        "brand-blue": "#6A81FB",
        "brand-black": "#1D1D1D",
        "brand-white": "#FFF4ED",
        "success": "#5EE3A5",
        "warning": "#F1CF58",
        "info": "#8D6BFB",
        "white-1": "#F8F6F4",
        "white-2": "#EEECEA",
        "white-3": "#E3DEDA",
        "black-1": "#3D3C3C",
        "black-2": "#5A5A5A",
        "black-3": "#8E8E8E",
        "table-row": "#FBFCFC",
      },
      boxShadow: {
        card: '0 35px 60px -15px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light'],
  },
}

