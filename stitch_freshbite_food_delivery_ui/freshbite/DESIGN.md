---
name: FreshBite
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#5c403c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#906f6b'
  outline-variant: '#e5bdb8'
  surface-tint: '#bb1615'
  primary: '#b81313'
  on-primary: '#ffffff'
  primary-container: '#dc3129'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4aa'
  secondary: '#006d37'
  on-secondary: '#ffffff'
  secondary-container: '#6bfe9c'
  on-secondary-container: '#00743a'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cea700'
  on-tertiary-container: '#4e3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930006'
  secondary-fixed: '#6bfe9c'
  secondary-fixed-dim: '#4ae183'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#ffe084'
  tertiary-fixed-dim: '#eec209'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  display-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is centered on high-velocity convenience and appetite appeal. It targets a mobile-first audience that values efficiency and visual clarity. The emotional response is one of energy and reliability, achieved through a vibrant primary palette and a clean, spacious interface.

The design style is a hybrid of **Modern-Corporate** and **Soft-Tactile**. It utilizes high-quality imagery, generous whitespace, and subtle glassmorphism to create a premium, "fresh" feeling. Interactions are designed to be low-friction, using micro-animations to provide instant tactile feedback during the ordering process.

## Colors
The palette is dominated by the primary accent, a warm "Crave Red" (#FF4B3E), designed to stimulate appetite and urgency. 

- **Primary:** Used for call-to-actions, price points, and active states.
- **Success/Warning:** Functional colors for delivery status (#2ECC71) and low-stock/limited-time offers (#F1C40F).
- **Backgrounds:** The interface uses a systematic light-gray (#F8F9FA) to differentiate the canvas from white (#FFFFFF) surface cards. 
- **Dark Mode:** Inverted surfaces use a deep charcoal (#121212) with light-gray text for high legibility in low-light environments.

## Typography
The design system utilizes **Inter** exclusively to maintain a clean, systematic look that stays out of the way of food photography. 

Headlines use tight tracking and heavy weights to create a sense of urgency and brand presence. Body text is optimized for readability with a generous line height. Label styles are used for metadata like delivery times, ratings, and nutritional info, often employing slightly heavier weights to ensure visibility at smaller sizes.

## Layout & Spacing
This design system follows a **4px base grid**. Layouts are primarily fluid to accommodate the vast range of mobile device widths. 

- **Mobile:** A single-column or 2-column grid with 16px side margins. 
- **Desktop:** A max-width fixed container (1200px) with a 12-column grid and 24px gutters.
- **Rhythm:** Vertical spacing between cards and sections should follow the `lg` (24px) or `xl` (32px) tokens to prevent the UI from feeling cluttered.

## Elevation & Depth
Hierarchy is established through **Ambient Shadows** and **Glassmorphism**. 

- **Surface Level (0dp):** The background color (#F8F9FA).
- **Card Level (1dp):** White cards with a 12% opacity shadow, 16px blur, and 4px vertical offset.
- **Floating Level (2dp):** Used for "Add to Cart" sticky bars and floating action buttons. These use a more pronounced 18% opacity shadow.
- **Overlays:** Modals and bottom sheets utilize a `backdrop-filter: blur(12px)` with a 70% white tint to maintain context while focusing the user.

## Shapes
The shape language is friendly and modern. 
- **Large Components:** Cards and main containers use a 16px (`rounded-lg`) radius.
- **Medium Components:** Buttons and input fields use an 8px (`rounded-md`) radius.
- **Small Components:** Badges and chips use a 100px pill shape to distinguish them from interactive buttons.
- **Imagery:** Food photography should always follow the container's 16px radius to maintain a consistent silhouette.

## Components

### Buttons
- **Primary:** Solid #FF4B3E with white text. High-contrast, 8px radius. On press, scales down to 98% for tactile feedback.
- **Secondary:** Ghost style with a 1px border or subtle gray background for "Order History" or "Filter" actions.

### Cards
- Standardized at 16px radius. For restaurant listings, the image occupies the top 60% of the card with a subtle gradient overlay to ensure legibility of text badges (e.g., "Sponsored" or "Free Delivery").

### Inputs & Search
- Search bars should be prominent, using a white background even on gray canvases, with a 12px blur shadow to draw focus. Use an 8px radius.

### Chips & Tags
- Used for cuisine types (e.g., "Italian", "Vegan"). These are low-profile, using a light gray fill and small-label typography to keep the focus on the primary CTA.

### Bottom Sheets
- The primary vessel for mobile interaction. They must include a "grab handle" at the top and utilize the glassmorphism effect on the header for a premium feel.