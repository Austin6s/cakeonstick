/* @ds-bundle: {"format":4,"namespace":"CakeOnStickDesignSystem_a9f058","components":[{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/commerce/ProductCard.jsx":"eec7da2852e2","components/core/Badge.jsx":"379b91c64c95","components/core/Button.jsx":"429cb7721eb6","components/core/SectionHeading.jsx":"3790c7983e65","components/forms/Input.jsx":"3f2b253c1652","components/forms/Textarea.jsx":"631d146c4770","components/navigation/Footer.jsx":"12b6213f4a4a","components/navigation/NavBar.jsx":"1941b4e989e1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CakeOnStickDesignSystem_a9f058 = window.CakeOnStickDesignSystem_a9f058 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
/**
 * Small pill label — flavor tags, dietary notes ("Nut-Free"), collection badges ("New", "Limited").
 */
function Badge({
  children,
  tone = "coral"
}) {
  const tones = {
    coral: {
      background: "var(--coral-100)",
      color: "var(--coral-700)"
    },
    charcoal: {
      background: "var(--charcoal-100)",
      color: "var(--charcoal-700)"
    },
    dark: {
      background: "var(--charcoal-700)",
      color: "var(--white)"
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-default)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-semibold)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding: "5px 12px",
      borderRadius: "var(--radius-pill)",
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
/**
 * Product/collection card — used in shop grids and homepage collection previews.
 */
function ProductCard({
  image,
  name,
  price,
  badge,
  alt = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      background: "var(--white)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      border: "1px solid var(--border-subtle)",
      transition: "box-shadow var(--duration-base) var(--ease-out-soft), transform var(--duration-base) var(--ease-out-soft)",
      cursor: "pointer"
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
      e.currentTarget.style.transform = "translateY(-3px)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.transform = "translateY(0)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 3",
      background: "var(--coral-50)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }), badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "12px",
      left: "12px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "dark"
  }, badge))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-semibold)",
      fontSize: "16px",
      color: "var(--text-primary)",
      marginBottom: "4px"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "14px",
      color: "var(--brand-primary)",
      fontWeight: 600
    }
  }, price)));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
/**
 * Primary CTA component across the site — "Order Now", "Start Custom Order", "Add to Cart".
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  onDark = false
}) {
  const base = {
    fontFamily: "var(--font-body)",
    fontWeight: "var(--weight-semibold)",
    fontSize: size === "sm" ? "13px" : "var(--size-button)",
    letterSpacing: "0.01em",
    border: "1.5px solid transparent",
    borderRadius: "var(--radius-pill)",
    padding: size === "sm" ? "8px 18px" : size === "lg" ? "16px 32px" : "12px 24px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    opacity: disabled ? 0.5 : 1
  };
  const variants = {
    primary: {
      background: "var(--brand-primary)",
      color: "var(--text-on-coral)",
      borderColor: "var(--brand-primary)"
    },
    secondary: onDark ? {
      background: "transparent",
      color: "var(--white)",
      borderColor: "var(--white)"
    } : {
      background: "transparent",
      color: "var(--text-primary)",
      borderColor: "var(--charcoal-700)"
    },
    ghost: onDark ? {
      background: "transparent",
      color: "var(--white)",
      borderColor: "transparent"
    } : {
      background: "transparent",
      color: "var(--text-primary)",
      borderColor: "transparent"
    },
    dark: {
      background: "var(--charcoal-700)",
      color: "var(--white)",
      borderColor: "var(--charcoal-700)"
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant]
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === "primary") e.currentTarget.style.background = "var(--brand-primary-hover)";
      if (variant === "secondary") e.currentTarget.style.background = onDark ? "rgba(255,255,255,0.12)" : "var(--charcoal-50)";
      if (variant === "ghost") e.currentTarget.style.background = onDark ? "rgba(255,255,255,0.12)" : "var(--coral-50)";
      if (variant === "dark") e.currentTarget.style.background = "var(--charcoal-800)";
    },
    onMouseLeave: e => {
      if (disabled) return;
      e.currentTarget.style.background = variants[variant].background;
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(1)";
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
/**
 * Eyebrow + heading pairing used above every major section of the site.
 */
function SectionHeading({
  eyebrow,
  title,
  align = "left",
  onDark = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: "560px",
      margin: align === "center" ? "0 auto" : 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--size-eyebrow)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-eyebrow)",
      textTransform: "uppercase",
      color: "var(--brand-primary)",
      marginBottom: "10px"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-semibold)",
      fontSize: "var(--size-display-md)",
      lineHeight: "var(--leading-display)",
      color: onDark ? "var(--white)" : "var(--text-primary)",
      margin: 0
    }
  }, title));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
/**
 * Text input for contact/custom-order forms.
 */
function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontFamily: "var(--font-body)"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "13px",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-primary)",
      marginBottom: "6px"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--brand-primary)"
    }
  }, " *")), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    required: required,
    style: {
      width: "100%",
      boxSizing: "border-box",
      font: "inherit",
      fontSize: "15px",
      padding: "12px 16px",
      borderRadius: "var(--radius-sm)",
      border: "1.5px solid var(--border-default)",
      background: "var(--white)",
      color: "var(--text-primary)",
      outline: "none",
      transition: "border-color var(--duration-fast) var(--ease-standard)"
    },
    onFocus: e => e.target.style.borderColor = "var(--brand-primary)",
    onBlur: e => e.target.style.borderColor = "var(--border-default)"
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
/**
 * Multi-line text area — used for "tell us about your event" custom order requests.
 */
function Textarea({
  label,
  placeholder,
  rows = 4,
  value,
  onChange,
  required = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontFamily: "var(--font-body)"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "13px",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-primary)",
      marginBottom: "6px"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--brand-primary)"
    }
  }, " *")), /*#__PURE__*/React.createElement("textarea", {
    placeholder: placeholder,
    rows: rows,
    value: value,
    onChange: onChange,
    required: required,
    style: {
      width: "100%",
      boxSizing: "border-box",
      font: "inherit",
      fontSize: "15px",
      padding: "12px 16px",
      borderRadius: "var(--radius-sm)",
      border: "1.5px solid var(--border-default)",
      background: "var(--white)",
      color: "var(--text-primary)",
      outline: "none",
      resize: "vertical",
      transition: "border-color var(--duration-fast) var(--ease-standard)"
    },
    onFocus: e => e.target.style.borderColor = "var(--brand-primary)",
    onBlur: e => e.target.style.borderColor = "var(--border-default)"
  }));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
/**
 * Site footer — brand blurb, nav columns, social links, newsletter.
 */
function Footer() {
  const col = (title, items) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "13px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--charcoal-300)",
      marginBottom: "14px"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }
  }, items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      color: "var(--charcoal-100)",
      fontSize: "14px",
      textDecoration: "none"
    }
  }, i))));
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--charcoal-700)",
      color: "var(--white)",
      fontFamily: "var(--font-body)",
      padding: "56px clamp(20px, 5vw, 64px) 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: "32px",
      marginBottom: "40px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "18px",
      letterSpacing: "var(--tracking-wordmark)",
      textTransform: "uppercase",
      marginBottom: "12px"
    }
  }, "Cake on Stick"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--charcoal-200)",
      fontSize: "14px",
      lineHeight: 1.6,
      maxWidth: "260px",
      margin: 0
    }
  }, "Handmade cakesicles, custom party packages & gift sets \u2014 made to order.")), col("Shop", ["Gift Sets", "Party Packages", "Everyday Treats", "Custom Orders"]), col("Company", ["About", "FAQ", "Contact"]), col("Follow", ["Instagram", "TikTok", "Pinterest"])), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--charcoal-500)",
      paddingTop: "20px",
      fontSize: "12px",
      color: "var(--charcoal-300)"
    }
  }, "\xA9 2026 Cake on Stick. All rights reserved."));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
/**
 * Site header — logo wordmark, primary nav links, cart/CTA.
 */
function NavBar({
  links = ["Shop", "Custom Orders", "Party Packages", "About"],
  cartCount = 0
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px clamp(20px, 5vw, 64px)",
      background: "var(--white)",
      borderBottom: "1px solid var(--border-subtle)",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-semibold)",
      fontSize: "18px",
      letterSpacing: "var(--tracking-wordmark)",
      textTransform: "uppercase",
      color: "var(--text-primary)"
    }
  }, "Cake on Stick"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: "32px"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontSize: "14px",
      fontWeight: 500,
      color: "var(--text-primary)",
      textDecoration: "none"
    },
    onMouseEnter: e => e.currentTarget.style.color = "var(--brand-primary)",
    onMouseLeave: e => e.currentTarget.style.color = "var(--text-primary)"
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontSize: "20px",
      cursor: "pointer"
    }
  }, "\uD83D\uDECD\uFE0F", cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "-6px",
      right: "-8px",
      background: "var(--brand-primary)",
      color: "var(--white)",
      fontSize: "10px",
      fontWeight: 700,
      borderRadius: "var(--radius-pill)",
      width: "16px",
      height: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, cartCount)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm"
  }, "Order Now")));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
