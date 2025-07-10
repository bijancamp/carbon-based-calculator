# Application Design

## Overview

Carbon-Based Calculator is a responsive, static web application designed to help
magicians practice mental math for rapid calculation effects. The app allows
users to select a drill type (e.g., "Multiply Two-Digit Number by 11") and
practice with randomly generated problems from that category.

The app is optimized for both desktop and mobile use, with a clean, intuitive
interface built using Material UI components.

---

## Layout and Component Structure

### Global Design

- **Framework:** React (with Material UI)
- **Theme:** Ability to toggle between dark (default) and light modes
- **Responsiveness:** Using Material components which are responsive by default
- **Typography:** Consistent use of `Typography` for headings, problems, etc.

---

### Navigation

- **AppBar**
  - Fixed at the top
  - Displays app title: "Carbon-Based Calculator"
  - Clicking the title returns the user to the home page
  - Has button icon on right that lets user toggle theme
  - If the screen is too small, then hamburger menu should be shown
  - Order of elements:
    1. Hamburger menu (if present)
    2. Logo
    3. Home
    4. About
    5. Theme toggle
  - Hamburger menu (when shown) item order:
    1. Home
    2. About
- **Footer**
  - Fixed at the bottom (on larger screens)
  - Displays copyright:
    - `© 2025 Bijan Camp. All rights reserved.`
  - Short in height

---

## Pages

### 1. Home Page (`/`)

#### Purpose
Allows users to select a drill type.

#### Layout
- **Heading:** `Typography` – "Select a Drill Type" (desktop) or "Tap a Drill
  Type" (mobile)
- **Drill Cards Grid:**
  - Each card (`Card`) contains:
    - Title: Drill name
    - Description: Short explanation
    - Hover on desktop:
      - Show "Start Drill" message
      - Animate to slightly different color:
        - In dark mode, transition to slightly lighter color
        - In light mode, transition to slightly darker color
    - Whole card is clickable
    - On click, go to drill page
- **Responsive Grid Layout:**
  - Uses Material UI `Grid` to display cards in a column on mobile and row/grid
    layout on larger screens

---

### 2. Drill Page (`/drills/:drillType`)

#### Purpose
Displays one math problem at a time for the selected drill type.

#### Layout
- **Heading:** `Typography` – Drill name
- **Problem Display:** `Paper` with elevated styling
  - Large text (`Typography`) for visibility
- **Action Buttons (Vertical Stack on mobile):**
  - "Next Problem" – refreshes with a new randomly generated problem
  - "Change Drill" – returns to the home page

---

### 3. About Page (`/about`)

#### Purpose
Explains the purpose of the app and gives creator info.

#### Layout
- **Heading:** "About Carbon-Based Calculator"
- **Body Text:** Description of the app's purpose
- **Creator Info:** Simple footer note or text block

---

## Mobile Responsiveness

- Drill cards stack vertically on mobile
- Buttons are spaced for finger taps
- Typography and Paper components scale based on screen width
- AppBar and footer remain visible and do not interfere with core content
