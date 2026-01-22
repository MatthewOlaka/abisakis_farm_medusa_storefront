// tailwind.config.js (ESM)
import medusaUiPreset from '@medusajs/ui-preset';
import radix from 'tailwindcss-radix';
// import animate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class', 'class'],
	presets: [medusaUiPreset],
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx}',
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/modules/**/*.{js,ts,jsx,tsx}',
		'./src/lib/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			transitionProperty: {
				width: 'width margin',
				height: 'height',
				bg: 'background-color',
				display: 'display opacity',
				visibility: 'visibility',
				padding: 'padding-top padding-right padding-bottom padding-left',
			},
			fontFamily: {
				sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				serif: ['var(--font-judson)', 'ui-serif', 'Georgia', 'serif'],
			},
			// if you want duration-800, add it:
			transitionDuration: { 800: '800ms' },
			// if you really want border-b-1, add it (but `border-b` is already 1px):
			borderWidth: { 1: '1px' },
			// if you used z-100 anywhere, either switch to z-[100] or add:
			zIndex: { 100: '100' },
			// extend scale so large blobText scales work (e.g., scale-400, scale-470)
			scale: {
				40: '0.4',
				150: '1.5',
				200: '2',
				250: '2.5',
				300: '3',
				350: '3.5',
				400: '4',
				470: '4.7',
			},
			colors: {
				grey: {
					0: '#FFFFFF',
					5: '#F9FAFB',
					10: '#F3F4F6',
					20: '#E5E7EB',
					30: '#D1D5DB',
					40: '#9CA3AF',
					50: '#6B7280',
					60: '#4B5563',
					70: '#374151',
					80: '#1F2937',
					90: '#111827',
				},
				yellow: {
					50: '#FFF7E6',
					100: '#FFFDEE',
					200: '#E6DFAD',
					300: '#7B6708',
					500: '#E7C931',
				},
				green: {
					// 900: '#043332',
					900: '#0d3d28',
				},
				brown: { 200: '#E6BA5E', 400: '#E59B00', 700: '#957024' },
				brandGreen: {
					50: '#D5D0AC',
					100: '#C9D3BF',
					800: '#2E5604',
					900: '#043332',
				}, // use brandGreen-*
				// grey: { 50: '#E6E6E6', 100: '#6A6A6A', 600: '#4A4A4A', 800: '#232323' },
				cream: '#FFF8EC',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					1: 'hsl(var(--chart-1))',
					2: 'hsl(var(--chart-2))',
					3: 'hsl(var(--chart-3))',
					4: 'hsl(var(--chart-4))',
					5: 'hsl(var(--chart-5))',
				},
			},
			borderRadius: {
				none: '0px',
				soft: '2px',
				base: '4px',
				rounded: '8px',
				large: '16px',
				circle: '9999px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			maxWidth: {
				'8xl': '100rem',
			},
			screens: {
				'2xsmall': '320px',
				xs: '480px',
				xsmall: '512px',
				small: '1024px',
				medium: '1280px',
				large: '1440px',
				'3xl': '1600px',
				xlarge: '1680px',
				'2xlarge': '1920px',
			},
			fontSize: {
				'3xl': '2rem',
			},

			keyframes: {
				ring: {
					'0%': {
						transform: 'rotate(0deg)',
					},
					'100%': {
						transform: 'rotate(360deg)',
					},
				},
				'fade-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(10px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)',
					},
				},
				'fade-in-top': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-10px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
				'fade-out-top': {
					'0%': {
						height: '100%',
					},
					'99%': {
						height: '0',
					},
					'100%': {
						visibility: 'hidden',
					},
				},
				'accordion-slide-up': {
					'0%': {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1',
					},
					'100%': {
						height: '0',
						opacity: '0',
					},
				},
				'accordion-slide-down': {
					'0%': {
						'min-height': '0',
						'max-height': '0',
						opacity: '0',
					},
					'100%': {
						'min-height': 'var(--radix-accordion-content-height)',
						'max-height': 'none',
						opacity: '1',
					},
				},
				// enter: {
				// 	'0%': {
				// 		transform: 'scale(0.9)',
				// 		opacity: 0
				// 	},
				// 	'100%': {
				// 		transform: 'scale(1)',
				// 		opacity: 1
				// 	}
				// },
				leave: {
					'0%': {
						transform: 'scale(1)',
						opacity: 1,
					},
					'100%': {
						transform: 'scale(0.9)',
						opacity: 0,
					},
				},
				'slide-in': {
					'0%': {
						transform: 'translateY(-100%)',
					},
					'100%': {
						transform: 'translateY(0)',
					},
				},
				'scroll-dot': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-8px)',
					},
					'20%': {
						opacity: '1',
					},
					'60%': {
						opacity: '1',
						transform: 'translateY(10px)',
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(18px)',
					},
				},
			},
			animation: {
				ring: 'ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
				'fade-in-right': 'fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards',
				'fade-in-top': 'fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
				'fade-out-top': 'fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
				'accordion-open': 'accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards',
				'accordion-close': 'accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards',
				enter: 'enter 200ms ease-out',
				'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
				leave: 'leave 150ms ease-in forwards',
				'scroll-dot': 'scroll-dot 1.5s ease-in-out infinite',
			},
		},
	},
	plugins: [
		radix({}), // needs an options object
		// animate,       // ESM import – don't call it
		// require("tailwindcss-animate")
	],
};

export default config;
