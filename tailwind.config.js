/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          teal: '#00a884',
          'teal-dark': '#008f6f',
          'light-green': '#d9fdd3',
          'message-out': '#d9fdd3',
          'message-in': '#ffffff',
          background: '#efeae2',
          'sidebar-bg': '#ffffff',
          'chat-bg': '#efeae2',
          'header-bg': '#f0f2f5',
          'input-bg': '#f0f2f5',
        }
      },
      backgroundImage: {
        'chat-pattern': "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
      }
    },
  },
  plugins: [],
}
