import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}'
    ],
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'collapsible-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-collapsible-content-height)' }
                },
                'collapsible-up': {
                    from: { height: 'var(--radix-collapsible-content-height)' },
                    to: { height: '0' }
                },
                'rotate-in': {
                    '0%': {
                        transform: 'rotate(0deg) scale(0.2)',
                        opacity: '0'
                    },
                    '100%': {
                        transform: 'rotate(360deg)  scale(1)',
                        opacity: '1'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'collapsible-down': 'collapsible-down 0.2s ease-out',
                'collapsible-up': 'collapsible-up 0.2s ease-out',
                '404': 'rotate-in 0.5s ease-out'
            },
            maxHeight: {
                nav: 'calc(100vh - 4rem)'
            },
            backgroundImage: {
                404: "url('@/img/404.png')",
                'bottom-shadow':
                    'linear-gradient(180deg,rgba(22,22,26,0),rgb(17,19,25) 100%)'
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
};

export default config;
