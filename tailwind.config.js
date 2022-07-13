module.exports = {
   important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
     "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    screens: {
      'phone': '0px',
      'tablet': '576px',
      // => @media (min-width: 640px) { ... }
       'tabletlg': '768px',

      'laptop': '992px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1200px',
      // => @media (min-width: 1280px) { ... }
    },
    extend: {},
  },
  plugins: [
      require('./node_modules/flowbite/plugin')
  ],
  
}