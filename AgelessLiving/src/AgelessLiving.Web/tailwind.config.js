module.exports = {
  content: ["./**/*.{razor,cshtml,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#2A9D8F',
          'teal-dark': '#1E7A6E',
          'teal-light': '#E8F5F2',
          'teal-xlight': '#F2FAF8',
          gold: '#C8A951',
          'gold-dark': '#B89840',
          'gold-light': '#F5F0E0',
          cream: '#FAF8F5',
          dark: '#1D1D1D',
          muted: '#6B6B6B',
          'light-muted': '#9A9A9A',
          border: '#E8E5E0',
        },
        cat: {
          skin: '#C4918A',
          hormone: '#8AAEC4',
          bio: '#8AC4A8',
          weight: '#C4B88A',
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
