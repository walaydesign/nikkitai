// tw-config.js — Tailwind CDN theme for Nikki Life (load right after the Tailwind CDN script)
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#312C29",
        inksoft: "#AD9B91",
        taupe: "#776B64",
        espresso: "#523800",
        cream: "#F8F4F2",
        greige: "#E6DDD7",
        mist: "#E3F2FD",
        porcelain: "#F8FAFC",
        paper: "#FFFDFA",
        white: "#FFFFFF",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ['"Noto Sans TC"', "sans-serif"],
        script: ['"Great Vibes"', "cursive"],
      },
      borderRadius: {
        blob: "60% 40% 70% 30% / 50% 60% 40% 50%",
      },
      animation: {
        morph: "morphing 8s ease-in-out infinite",
        float: "floating 6s ease-in-out infinite",
        "float-slow": "floating 10s ease-in-out infinite",
        "float-delayed": "floating 8s ease-in-out 2s infinite",
      },
      keyframes: {
        morphing: {
          "0%, 100%": {
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        floating: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(119,107,100,0.10)",
        card: "0 20px 40px -15px rgba(119,107,100,0.15)",
        cta: "0 10px 20px -5px rgba(119,107,100,0.30)",
        media: "0 25px 50px -12px rgba(49,44,41,0.18)",
      },
      letterSpacing: { eyebrow: "0.18em" },
    },
  },
};
