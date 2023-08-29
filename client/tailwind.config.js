export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            screens: {
                xs: '470px',
            },

            fontFamily: {
                'league-spartan': ['League Spartan', 'sans-serif'],
            },

            colors: {
                'app-white': '#f4f4f4',
                'app-black': '#121212',
                theme: '#EF6344',
                'gray-color': '#828282',
            },

            padding: {
                18: '72px',
            },

            backgroundImage: () => {
                return {
                    gradient:
                        'var(--gradient, linear-gradient(270deg, #EF6344 0%, #D15258 95.31%))',
                    'gradient-hover':
                        'var(--gradient-hover, linear-gradient(180deg, #EB836C 0%, #D08F92 100%))',
                };
            },

            boxShadow: {
                gradient: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                header: '0px 1px 2px -1px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
                'file-upload':
                    '0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px #D1D5DB inset, 0px 0px 0px 0px #FFF inset',
                input: '0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px #D1D5DB inset, 0px 0px 0px 0px #FFF inset',
                'input-focus':
                    '0px 1px 2px 0px #EF6344, 0px 0px 0px 1px #EF6344 inset, 0px 0px 0px 0px #EF6344 inset',
            },

            width: {
                app: '1440px',
            },

            maxWidth: {
                app: '1440px',
            },
        },
    },
    plugins: [],
};
