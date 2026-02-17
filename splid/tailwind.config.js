/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    // tailwind.config.js

   fontFamily: {
     'sans': ['ui-sans-serif', 'system-ui', 'sans-serif'],
     'serif': ['ui-serif', 'Georgia', 'serif'],
     'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
     'custom': ['"Custom Font"', 'sans-serif'],
   
 }
}
}