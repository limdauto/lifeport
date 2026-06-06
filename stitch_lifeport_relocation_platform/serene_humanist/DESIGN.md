---
name: Serene Humanist
colors:
  surface: '#f6faff'
  surface-dim: '#d6dadf'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f9'
  surface-container: '#eaeef3'
  surface-container-high: '#e4e9ee'
  surface-container-highest: '#dfe3e8'
  on-surface: '#171c20'
  on-surface-variant: '#42474d'
  inverse-surface: '#2c3135'
  inverse-on-surface: '#edf1f6'
  outline: '#72787e'
  outline-variant: '#c2c7ce'
  surface-tint: '#3f627e'
  primary: '#3c5f7b'
  on-primary: '#ffffff'
  primary-container: '#557895'
  on-primary-container: '#fcfcff'
  inverse-primary: '#a7cbeb'
  secondary: '#5f5e5a'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2dc'
  on-secondary-container: '#656460'
  tertiary: '#555d63'
  on-tertiary: '#ffffff'
  tertiary-container: '#6d767c'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cbe6ff'
  primary-fixed-dim: '#a7cbeb'
  on-primary-fixed: '#001e30'
  on-primary-fixed-variant: '#254a65'
  secondary-fixed: '#e5e2dc'
  secondary-fixed-dim: '#c9c6c1'
  on-secondary-fixed: '#1c1c18'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#dbe3ea'
  tertiary-fixed-dim: '#bfc8ce'
  on-tertiary-fixed: '#151d22'
  on-tertiary-fixed-variant: '#40484e'
  background: '#f6faff'
  on-background: '#171c20'
  surface-variant: '#dfe3e8'
typography:
  display:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 80px
---

## Brand & Style
The design system shifts from a technical, utility-focused aesthetic toward a warm, editorial, and human-centric experience. The personality is approachable yet refined, evoking a sense of calm reliability. The target audience values clarity and a soft touch over raw data density.

The style is a blend of **Soft Minimalism** and **Organic Professionalism**. It utilizes generous whitespace, subtle tonal shifts rather than harsh dividers, and a focus on tactile, rounded elements. The emotional response should be one of "quiet confidence"—organized and efficient, but presented with a gentle, inviting hand.

## Colors
The palette moves away from high-contrast "deep ink" dominance toward a more organic and breathable spectrum. 

- **Primary (Muted Blue):** Used for key actions and subtle brand accents. It provides a professional anchor without the aggressiveness of a standard navy.
- **Secondary (Warm Stone/Ivory):** This is the foundation of the UI. Use this for main backgrounds to create a softer, more editorial feel compared to stark white.
- **Tertiary (Cloud Blue):** Used for subtle UI elements like hover states, active chips, or secondary backgrounds to provide gentle differentiation.
- **Neutral (Graphite):** Used sparingly for text and iconography to ensure legibility while maintaining a softer contrast than pure black.

## Typography
Manrope is retained but executed with a softer hierarchy to feel more editorial. 

Avoid "Extra Bold" or "Black" weights which feel too technical. Headlines should favor Medium and Semi-Bold weights to maintain a sophisticated, human touch. Body copy utilizes a generous 1.6 line height to ensure maximum breathability and an easy reading rhythm. All-caps styling should be used very sparingly, reserved only for small, high-weight labels to maintain a gentle tone.

## Layout & Spacing
The layout philosophy is centered on **Generous Padding** and **Fluid Harmony**. By increasing margins and gutters, the design avoids the "cramped" feel of technical dashboards.

- **Grid:** A 12-column fluid grid is used for desktop, but elements should rarely span the full width to keep line lengths readable.
- **Rhythm:** An 8px linear scale is used, but for structural gaps, favor the higher end of the scale (e.g., 32px, 48px, 64px) to emphasize the sense of "air."
- **Mobile:** On mobile, margins reduce to 24px, and vertical spacing between cards increases to ensure a clear vertical rhythm that doesn't feel cluttered.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layering** and **Soft Ambient Shadows**. We avoid harsh borders and heavy shadows.

- **Surfaces:** Main backgrounds use the "Warm Stone" tone. Secondary containers (like cards) use pure White (#FFFFFF) to subtly lift them off the page.
- **Shadows:** Use extremely diffused, low-opacity shadows (e.g., Blur: 20px, Y: 4px, Opacity: 4%) with a hint of the primary blue in the shadow color to keep it from looking "dirty."
- **Soft Outlines:** Instead of solid borders, use 1px strokes in a slightly darker shade of the "Warm Stone" (approx 5-8% darkness) to define shapes without creating visual "noise."

## Shapes
The shape language is defined by **Organic Curves**. Sharp corners are eliminated to remove the "technical" edge.

A base roundedness of `0.5rem` is applied to standard components like inputs and small buttons. Larger elements, such as cards and containers, utilize `rounded-lg` (1rem) or `rounded-xl` (1.5rem) to create a soft, friendly silhouette. For specific interactive elements like chips or pill-buttons, use full corner rounding for a tactile, pebble-like quality.

## Components
Consistent styling across components reinforces the human-centric narrative.

- **Buttons:** Use Semi-Bold Manrope. Primary buttons have the muted blue background and white text; secondary buttons use the warm stone background with a soft border. Avoid "ghost" buttons with thin outlines; favor subtle fills.
- **Input Fields:** These should feel spacious. Use a 16px internal padding and a soft stone background that turns white on focus. Labels should be placed above the field in a slightly smaller, semi-bold font.
- **Cards:** Cards are the primary vessel for information. They feature 32px of internal padding, 1rem corner radius, and a soft ambient shadow. No heavy borders.
- **Chips & Tags:** Fully rounded "pill" shapes. Use the "Cloud Blue" (Tertiary) as a background for a soft, low-contrast appearance.
- **Lists:** Increase the vertical padding between list items. Use soft horizontal dividers that fade out toward the edges rather than spanning the full width of the container.
- **Modals/Sheets:** These should have high roundedness (1.5rem) at the top corners to feel "tucked in" and less like abrupt technical pop-ups.