import { jsxs, jsx } from "react/jsx-runtime";
import { A as ApplicationLogo } from "./ApplicationLogo-xMpxFOcX.js";
import { Link } from "@inertiajs/react";
function GuestLayout({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0 font-[family-name:var(--font-sans)]", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-20 w-20 fill-current text-primary hover:text-accent transition-colors" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 w-full overflow-hidden glass-card px-6 py-4 shadow-lg sm:max-w-md sm:rounded-lg border border-border", children: /* @__PURE__ */ jsx("div", { className: "font-[family-name:var(--font-heading)] text-foreground", children }) })
  ] });
}
export {
  GuestLayout as G
};
