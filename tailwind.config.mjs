/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1792px',
        '4xl': '2048px',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#6E3AFF',
        secondary: '#FF3A8C',
        'light-purple': '#F2EEFF',
        dark: {
          bg: {
            primary: '#0D0D12',
            secondary: '#080812'
          },
          card: {
            primary: '#14141C'
          },
          border: {
            primary: "#2D2D3A"
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#A0A0B0'
          },
        },
        light: {
          bg: {
            primary: '#F8F9FA',
          },
          card: {
            primary: '#FFFFFF'
          },
          border: {
            primary: "#E9ECEF"
          },
          text: {
            primary: '#14141C',
            secondary: '#4A4A5A'
          },
        }
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 12px 28px rgba(0, 0, 0, 0.15)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s infinite ease-in-out',
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '30px' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8) translateY(-50px)', opacity: '0' },
          '50%': { transform: 'scale(1.05) translateY(0)', opacity: '0.8' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        "pulse-glow": {
          '0%, 100%': { boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" },
          '50%': { boxShadow: "0 0 30px rgba(247, 37, 133, 0.6)" },
        },

      }
    },
  },
  plugins: [],
};
