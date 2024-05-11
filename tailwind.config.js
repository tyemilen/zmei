/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				'snake-second': '#89a669',
			},
			animation: {
				reveal: 'reveal 1s ease-out infinite' 
			},
			keyframes: {
				reveal: {
					'0%': {
						'opacity': '0',
						'bottom': '1rem'
					},
					'20%': {
						'opacity': '0'
					},
					'50%': {
						'opacity': '1'
					},
					'70%': {
						'opacity': '1'
					},
					'100%': {
						'opacity': '0'
					}
				}
			},
			fontFamily: {
				orbitron: 'Orbitron',
				vt323: 'VT323'
			}
		},
	},
	plugins: [],
}