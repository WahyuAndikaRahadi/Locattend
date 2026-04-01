import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#eef7ff',
                    100: '#d9edff',
                    200: '#bce0ff',
                    300: '#8ecdff',
                    400: '#59b0ff',
                    500: '#338bff',
                    600: '#1b6af5',
                    700: '#1454e1',
                    800: '#1744b6',
                    900: '#193c8f',
                    950: '#142657',
                },
                accent: {
                    50: '#f0fdf5',
                    100: '#dcfce8',
                    200: '#bbf7d1',
                    300: '#86efad',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803c',
                    800: '#166533',
                    900: '#14532b',
                    950: '#052e14',
                },
                dark: {
                    50: '#f6f6f9',
                    100: '#ececf2',
                    200: '#d5d5e2',
                    300: '#b1b1c9',
                    400: '#8787ab',
                    500: '#686891',
                    600: '#545478',
                    700: '#454562',
                    800: '#3b3b53',
                    900: '#2d2d3f',
                    950: '#1a1a2e',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
        },
    },

    plugins: [forms],
};
