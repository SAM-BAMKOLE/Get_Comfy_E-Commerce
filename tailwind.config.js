/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./js/script.js"],
    theme: {
        screens: {
            sm: "640px",
            // => @media (min-width: 640px) { ... }

            md: "768px",
            // => @media (min-width: 768px) { ... }

            lg: "1024px",
            // => @media (min-width: 1024px) { ... }

            xl: "1280px",
            // => @media (min-width: 1280px) { ... }

            "2xl": "1536px",
            // => @media (min-width: 1536px) { ... }
        },
        extend: {
            fontFamily: {
                raleway: [' "Raleway", sans-serif; '],
                rochester: [" 'Rochester', cursive; "],
            },
            fontSize: {
                sm: "13px",
                base: "1rem",
                xl: "1.25rem",
                "2xl": "1.563rem",
                "3xl": "1.953rem",
                "4xl": "2.441rem",
                "5xl": "3.052rem",
            },
            gridTemplateColumns: {
                cartItem: "auto 1fr auto",
            },
        },
    },
    plugins: [],
};
