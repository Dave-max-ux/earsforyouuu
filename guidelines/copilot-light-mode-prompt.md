# EarsForYou — Light Mode Theme Override Prompt

---

## 🎯 Scope

**Only** update the global light mode color system and background. Do **not** modify any layout, component logic, or functionality. This is a pure visual token replacement.

---

## 🎨 New Light Mode Color Tokens

Replace or override the existing CSS variables / theme object with the following:

```
:root {
  /* Base backgrounds */
  --color-bg-base:         #F2F8F4;   /* Soft whitish-green page background */
  --color-bg-surface:      #F7FBF8;   /* Card / panel surface */
  --color-bg-elevated:     #FFFFFF;   /* Modals, dropdowns, input fields */

  /* Green palette */
  --color-green-primary:   #3D8B6E;   /* CTAs, send button, active states */
  --color-green-soft:      #E6F4ED;   /* AI bubble background */
  --color-green-mid:       #B2D9C8;   /* Borders, dividers, outlines */
  --color-green-deep:      #2A6652;   /* Hover states, header accents */
  --color-green-wash:      #EDF7F1;   /* Section backgrounds, sidebar fills */

  /* Text */
  --color-text-primary:    #1A2E25;   /* Body text — green-tinted dark */
  --color-text-secondary:  #4A6B5A;   /* Subtext, placeholders */
  --color-text-muted:      #8AA898;   /* Timestamps, labels */

  /* Borders & shadows */
  --color-border-subtle:   #D4EAE0;
  --color-shadow:          rgba(42, 102, 82, 0.07);
}
```

---

## 🖼️ Background Treatment

Apply this to the root `<body>` and main layout wrapper:

```
body, #root, .app-wrapper {
  background-color: #F2F8F4;
  background-image:
    radial-gradient(ellipse at 20% 10%, rgba(178,217,200,0.18) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 90%, rgba(61,139,110,0.10) 0%, transparent 55%);
  min-height: 100vh;
}
```

This gives a very subtle ambient green warmth without looking painted or heavy.

---

## 📋 Surface-by-Surface Mapping

Surface
Old Value
New Value

Page background
`#F8FAF7`
`#F2F8F4`

Chat screen bg
`#FFFFFF`
`#F7FBF8`

AI message bubble
`#EAF4EF`
`#E6F4ED`

User message bubble
`#FFFFFF`
`#FAFCFB`

InputBar background
`rgba(255,255,255,0.85)`
`rgba(242,248,244,0.90)`

Header background
`#FFFFFF`
`#F0F7F3`

Sidebar / panels
`#F8FAF7`
`#EDF7F1`

Dividers / borders
`#E5EDE9`
`#D4EAE0`

---

## ✅ Constraints

- **Light mode only** — do not touch dark mode variables if they exist
- All changes must go through the token system — no hardcoded hex values in component files
- No layout shifts, no size changes, no font changes
- The result must feel **whitish-green** — not mint, not lime, not sage. Calm, clinical, and clean
