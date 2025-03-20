
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				solo: {
					'dark': '#1A1F2C',
					'purple': '#9b87f5',
					'purple-dark': '#7E69AB',
					'purple-light': '#D6BCFA',
					'gray': '#8E9196',
					'charcoal': '#403E43',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'fade-out': {
                    '0%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                    '100%': {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    }
                },
                'scale-in': {
                    '0%': {
                        transform: 'scale(0.95)',
                        opacity: '0'
                    },
                    '100%': {
                        transform: 'scale(1)',
                        opacity: '1'
                    }
                },
                'pulse-blue': {
                    '0%, 100%': {
                        'box-shadow': '0 0 0 0 rgba(155, 135, 245, 0.4)'
                    },
                    '50%': {
                        'box-shadow': '0 0 0 15px rgba(155, 135, 245, 0)'
                    }
                },
                'shimmer': {
                    '0%': {
                        'background-position': '-500px 0'
                    },
                    '100%': {
                        'background-position': '500px 0'
                    }
                },
                'levitate': {
                    '0%, 100%': {
                        transform: 'translateY(0)'
                    },
                    '50%': {
                        transform: 'translateY(-10px)'
                    }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
                'fade-out': 'fade-out 0.4s ease-out',
                'scale-in': 'scale-in 0.3s ease-out',
                'pulse-blue': 'pulse-blue 2s infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'levitate': 'levitate 3s ease-in-out infinite'
			},
			backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-purple': 'linear-gradient(90deg, #9b87f5 0%, #7E69AB 100%)',
                'shimmer-gradient': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(155,135,245,0.2) 25%, rgba(155,135,245,0.5) 50%, rgba(155,135,245,0.2) 75%, rgba(255,255,255,0) 100%)'
            },
			boxShadow: {
                'blue-glow': '0 0 15px rgba(155, 135, 245, 0.5)',
                'inner-glow': 'inset 0 0 10px rgba(155, 135, 245, 0.5)'
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
