# Design Guidelines: 4E Store Discord-Integrated Platform

## Design Approach

**Reference-Based Hybrid**: Drawing inspiration from modern gaming/tech stores (Discord's interface, Steam, Epic Games Store) combined with sleek e-commerce patterns (Stripe checkout, Shopify product grids). The purple glow aesthetic establishes a premium, tech-forward brand identity.

## Core Visual Language

### Typography
- **Primary Font**: Inter (via Google Fonts CDN) - clean, modern, excellent readability
- **Accent Font**: Space Grono or Orbitron (for headers/logos) - tech/gaming aesthetic
- **Hierarchy**:
  - Hero headlines: 3xl-5xl, font-bold
  - Section headers: 2xl-3xl, font-semibold
  - Product titles: xl, font-medium
  - Body text: base, font-normal
  - Metadata/labels: sm, font-medium, uppercase tracking-wide

### Spacing System
Use Tailwind units: **4, 6, 8, 12, 16, 24** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8
- Tight spacing for related elements: space-y-2 to space-y-4

### Layout Architecture
- **Container**: max-w-7xl mx-auto px-6
- **Product Grid**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- **Dashboard Layout**: Sidebar (w-64) + Main content area
- **Responsive breakpoints**: Mobile-first, emphasize md: and lg: transitions

## Website Structure

### Navigation
- Sticky header with logo left, nav center, Discord login/user avatar right
- Glassmorphic background (backdrop-blur-lg with semi-transparent purple tint)
- Subtle purple glow on active nav items
- Cart icon with badge counter (top-right)

### Hero Section
- **Height**: 70vh minimum
- **Background**: Gradient mesh or abstract geometric pattern with purple/violet tones
- **Image**: Feature a stylized 3D render or abstract tech visualization (NOT a photo)
- **Content**: Centered, with main CTA "Browse Store" and secondary "Login with Discord"
- **Glow effect**: Soft purple glow (shadow-2xl shadow-purple-500/50) around CTA buttons

### Product Catalog
- **Card Design**: 
  - Rounded corners (rounded-xl)
  - Border with subtle purple glow on hover (border border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30)
  - Product image (aspect-square)
  - Title, price (text-2xl font-bold), "Add to Cart" button
- **Grid spacing**: gap-8
- **Filters**: Sidebar or top bar with category chips

### Shopping Cart & Checkout
- **Cart Overlay**: Slide-in from right (w-96)
- **Checkout Flow**: 
  1. Cart review
  2. Discord username input (pre-filled if logged in via OAuth)
  3. Join server prompt with embedded widget
  4. Order confirmation with generated code (4e-XXXX in large, monospace font)

### User Dashboard (Post-Login)
- **Two-column layout**: 
  - Left: User info card with Discord avatar, username, total orders
  - Right: Order history cards with status badges
- **Order cards**: 
  - Order code (prominent, purple glow)
  - Products list
  - Status indicator (pill badges with different colors per status)
  - Timestamps

## Purple Glow Theme Implementation

### Glow Effects
- **Primary glow**: box-shadow with purple-500/30 to purple-500/50
- **Intensity levels**:
  - Subtle: shadow-lg shadow-purple-500/20
  - Medium: shadow-xl shadow-purple-500/40
  - Strong: shadow-2xl shadow-purple-500/60
- **Apply to**: Buttons, cards on hover, active navigation, order codes, notification badges

### Glassmorphic Elements
- Navigation bar: backdrop-blur-lg bg-gray-900/80 border-b border-purple-500/20
- Modal overlays: backdrop-blur-md bg-gray-900/90
- Product cards: backdrop-blur-sm bg-gray-800/50 (for layered effects)

### Gradient Accents
- Hero background: Linear gradient from purple-900 via violet-800 to indigo-900
- Button gradients: from-purple-600 to-violet-600
- Status indicators: Different purple-to-pink gradients based on status

## Component Library

### Buttons
- **Primary**: Solid purple gradient with strong glow, rounded-lg, px-6 py-3
- **Secondary**: Outlined purple with subtle glow, hover fills
- **Ghost**: Transparent with purple text, glow on hover
- **On-image buttons**: backdrop-blur-md bg-purple-600/30 border border-purple-400/50

### Cards
- **Product**: Vertical layout, image top, content below, hover lift effect
- **Order**: Horizontal on desktop (image left, details right), stacked on mobile
- **Dashboard stat**: Compact square with large number, icon, label

### Forms
- **Input fields**: Dark background (bg-gray-800), purple border on focus, rounded-lg
- **Labels**: Uppercase, text-sm, text-purple-300
- **Error states**: Red glow instead of purple

### Badges & Status Indicators
- **Shape**: Pill (rounded-full px-3 py-1)
- **Status colors**: 
  - Pending: Yellow/amber glow
  - In Progress: Blue/cyan glow
  - Payment Pending: Orange glow
  - Completed: Green/emerald glow
  - Cancelled: Red glow

### Icons
Use **Heroicons** (outline for navigation, solid for actions)
- Cart, user, login/logout, search, filter
- Order status icons (clock, truck, check, x)
- Discord logo from Font Awesome or custom SVG

## Animations

### Sparingly Applied
- **Page transitions**: Fade-in on route change (300ms)
- **Card hover**: Gentle lift (translateY -2px) + glow intensify (200ms)
- **Button interactions**: Scale 98% on press, glow pulse on hover
- **Loading states**: Subtle purple pulse animation
- **NO**: Scroll animations, parallax, complex sequences

### Micro-interactions
- Ripple effect on button clicks (optional subtle purple ripple)
- Cart badge bounce when item added
- Success checkmark animation on order placement

## Images

### Hero Section
**Description**: Abstract 3D composition featuring geometric shapes (cubes, spheres) floating in a purple-violet space with glowing edges and particle effects. Style similar to modern SaaS/tech landing pages.
**Placement**: Full-width background with gradient overlay

### Product Images
Square aspect ratio placeholders with category-appropriate graphics or product mockups

### User Avatars
Discord profile pictures (circular, border with subtle purple glow when active)

## Accessibility & Polish
- Maintain WCAG AA contrast despite purple theme (use lighter purples for text on dark backgrounds)
- Focus states: 2px purple outline (ring-2 ring-purple-500)
- Consistent spacing and alignment across all breakpoints
- Smooth responsive behavior without jarring layout shifts

This design creates a cohesive, premium tech aesthetic that aligns with Discord's modern interface while establishing 4E Store as a forward-thinking, well-integrated platform.