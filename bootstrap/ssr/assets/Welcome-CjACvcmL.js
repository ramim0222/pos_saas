import { jsx, jsxs } from "react/jsx-runtime";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function GamingButton({
  children,
  variant = "primary",
  size = "default",
  className,
  ...props
}) {
  const variants = {
    primary: "bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground hover-lift neon-glow",
    secondary: "bg-secondary hover:bg-muted text-secondary-foreground hover-lift",
    accent: "bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground hover-lift neon-glow",
    ghost: "hover:bg-muted hover:text-foreground hover-lift"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      ),
      ...props,
      children
    }
  );
}
function Header() {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 glass-card border-b border-border/50", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-lg", children: "G" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-heading font-bold text-xl", children: "GameVault" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: "text-foreground hover:text-accent transition-colors",
            children: "Home"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: "text-foreground hover:text-accent transition-colors",
            children: "Categories"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: "text-foreground hover:text-accent transition-colors",
            children: "Deals"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: "text-foreground hover:text-accent transition-colors",
            children: "Support"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "search",
            placeholder: "Search vouchers...",
            className: "bg-input border border-border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary w-64"
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent", children: "🔍" })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "relative p-2 hover:bg-muted rounded-lg transition-colors", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🛒" }),
        /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center", children: "0" })
      ] }),
      /* @__PURE__ */ jsx(GamingButton, { variant: "ghost", size: "sm", children: "Sign In" }),
      /* @__PURE__ */ jsx(GamingButton, { variant: "primary", size: "sm", children: "Sign Up" })
    ] })
  ] }) }) });
}
function VoucherCard({
  title,
  price,
  originalPrice,
  discount,
  image,
  platform,
  rating,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "glass-card rounded-xl p-4 hover-lift group cursor-pointer",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-lg mb-4", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: image || `/placeholder.svg?height=200&width=300&query=${title} game voucher`,
              alt: title,
              className: "w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            }
          ),
          discount && /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm font-semibold", children: [
            "-",
            discount,
            "%"
          ] }),
          platform && /* @__PURE__ */ jsx("div", { className: "absolute top-2 left-2 bg-secondary/80 backdrop-blur-sm text-secondary-foreground px-2 py-1 rounded-md text-xs", children: platform })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-heading font-semibold text-lg leading-tight group-hover:text-accent transition-colors", children: title }),
          rating && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("div", { className: "flex text-accent", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(
              "span",
              {
                className: i < Math.floor(rating) ? "text-accent" : "text-muted",
                children: "★"
              },
              i
            )) }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground ml-1", children: [
              "(",
              rating,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-accent", children: [
                "$",
                price
              ] }),
              originalPrice && /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground line-through", children: [
                "$",
                originalPrice
              ] })
            ] }),
            /* @__PURE__ */ jsx(GamingButton, { size: "sm", variant: "primary", children: "Buy Now" })
          ] })
        ] })
      ]
    }
  );
}
function HomePage() {
  const featuredVouchers = [
    {
      title: "Steam Wallet $50",
      price: "45.99",
      originalPrice: "50.00",
      discount: 8,
      platform: "Steam",
      rating: 4.8,
      image: "/steam-voucher-card.png"
    },
    {
      title: "PlayStation Store $25",
      price: "22.99",
      originalPrice: "25.00",
      discount: 8,
      platform: "PlayStation",
      rating: 4.9,
      image: "/playstation-voucher-card.png"
    },
    {
      title: "Xbox Game Pass 3 Months",
      price: "29.99",
      originalPrice: "35.99",
      discount: 17,
      platform: "Xbox",
      rating: 4.7,
      image: "/placeholder-x1i2i.png"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("section", { className: "relative py-20 px-4 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-heading font-bold text-5xl md:text-7xl mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent", children: "Unlock Your Next Adventure" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-muted-foreground mb-8 max-w-2xl mx-auto", children: "Seamless purchases for gamers, by gamers. Get instant access to your favorite gaming platforms." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsx(GamingButton, { variant: "accent", size: "lg", children: "Explore Vouchers" }),
          /* @__PURE__ */ jsx(GamingButton, { variant: "secondary", size: "lg", children: "View Deals" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-16 px-4", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-heading font-bold text-3xl md:text-4xl mb-4", children: "Top Picks for You" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "Limited-time deals on the most popular gaming vouchers" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: featuredVouchers.map((voucher, index) => /* @__PURE__ */ jsx(VoucherCard, { ...voucher }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 px-4 bg-card/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-heading font-bold text-3xl md:text-4xl text-center mb-12", children: "Browse by Platform" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: ["Steam", "PlayStation", "Xbox", "Nintendo"].map(
        (platform) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-6 text-center hover-lift cursor-pointer group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-white", children: platform[0] }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-heading font-semibold text-lg group-hover:text-accent transition-colors", children: platform })
            ]
          },
          platform
        )
      ) })
    ] }) })
  ] });
}
export {
  HomePage as default
};
