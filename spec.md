# Ageless Living™ — Claude Code Build Prompt
## Phased execution. Start with Phase 0. Do not skip ahead.

---

## PROJECT CONTEXT

You are building the redesigned website for **Ageless Living™ Wellness Centre**, a medical aesthetics and longevity clinic with 3 locations in British Columbia, Canada (Langley, Victoria, Kelowna).

**Editor:** VS Code
**Runtime:** .NET 10 LTS
**Framework:** ASP.NET Core + Blazor (Static SSR for public pages, Interactive Server for dynamic components)
**Database:** SQL Server + Entity Framework Core
**Styling:** Tailwind CSS
**Background Jobs:** Hangfire
**Logging:** Serilog
**Payments:** Square .NET SDK
**Shipping:** Canada Post REST API
**Booking:** Jane App (NO API — embed codes and URLs only)
**AI/ML:** Local .NET ONNX Runtime (no cloud)
**Hosting:** IIS on Windows Server 2025

**Architecture:** Single-page scroll for main public site. Separate /shop page for Square storefront. Separate /admin and /client-portal authenticated areas. AI chatbot widget persistent on every page.

**All prices in CAD. All times in Pacific (America/Vancouver) for display, UTC internally.**

---

# ══════════════════════════════════════════════
# PHASE 0 — PROJECT SCAFFOLD
# ══════════════════════════════════════════════

> Set up the solution, install all packages, configure Tailwind, and verify it builds.

## 0.1 — Create solution and projects

```bash
mkdir AgelessLiving && cd AgelessLiving
dotnet new sln -n AgelessLiving

# Source projects
dotnet new blazor -n AgelessLiving.Web -o src/AgelessLiving.Web --interactivity Server
dotnet new classlib -n AgelessLiving.Core -o src/AgelessLiving.Core
dotnet new classlib -n AgelessLiving.Infrastructure -o src/AgelessLiving.Infrastructure
dotnet new classlib -n AgelessLiving.Booking -o src/AgelessLiving.Booking
dotnet new classlib -n AgelessLiving.Commerce -o src/AgelessLiving.Commerce
dotnet new classlib -n AgelessLiving.Content -o src/AgelessLiving.Content
dotnet new classlib -n AgelessLiving.AI -o src/AgelessLiving.AI
dotnet new classlib -n AgelessLiving.Marketing -o src/AgelessLiving.Marketing

# Add to solution
dotnet sln add src/AgelessLiving.Web src/AgelessLiving.Core src/AgelessLiving.Infrastructure src/AgelessLiving.Booking src/AgelessLiving.Commerce src/AgelessLiving.Content src/AgelessLiving.AI src/AgelessLiving.Marketing
```

## 0.2 — Wire project references

```bash
# Core has zero dependencies
# Infrastructure → Core
dotnet add src/AgelessLiving.Infrastructure reference src/AgelessLiving.Core
# Booking → Core + Infrastructure
dotnet add src/AgelessLiving.Booking reference src/AgelessLiving.Core
dotnet add src/AgelessLiving.Booking reference src/AgelessLiving.Infrastructure
# Commerce → Core + Infrastructure
dotnet add src/AgelessLiving.Commerce reference src/AgelessLiving.Core
dotnet add src/AgelessLiving.Commerce reference src/AgelessLiving.Infrastructure
# Content → Core + Infrastructure
dotnet add src/AgelessLiving.Content reference src/AgelessLiving.Core
dotnet add src/AgelessLiving.Content reference src/AgelessLiving.Infrastructure
# AI → Core + Infrastructure
dotnet add src/AgelessLiving.AI reference src/AgelessLiving.Core
dotnet add src/AgelessLiving.AI reference src/AgelessLiving.Infrastructure
# Marketing → Core + Infrastructure + Commerce + Booking
dotnet add src/AgelessLiving.Marketing reference src/AgelessLiving.Core
dotnet add src/AgelessLiving.Marketing reference src/AgelessLiving.Infrastructure
dotnet add src/AgelessLiving.Marketing reference src/AgelessLiving.Commerce
dotnet add src/AgelessLiving.Marketing reference src/AgelessLiving.Booking
# Web → everything
dotnet add src/AgelessLiving.Web reference src/AgelessLiving.Core
dotnet add src/AgelessLiving.Web reference src/AgelessLiving.Infrastructure
dotnet add src/AgelessLiving.Web reference src/AgelessLiving.Booking
dotnet add src/AgelessLiving.Web reference src/AgelessLiving.Commerce
dotnet add src/AgelessLiving.Web reference src/AgelessLiving.Content
dotnet add src/AgelessLiving.Web reference src/AgelessLiving.AI
dotnet add src/AgelessLiving.Web reference src/AgelessLiving.Marketing
```

## 0.3 — Install NuGet packages

```bash
# Infrastructure
dotnet add src/AgelessLiving.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add src/AgelessLiving.Infrastructure package Microsoft.EntityFrameworkCore.Tools
dotnet add src/AgelessLiving.Infrastructure package Microsoft.AspNetCore.Identity.EntityFrameworkCore

# Booking
dotnet add src/AgelessLiving.Booking package Ical.Net

# Commerce
dotnet add src/AgelessLiving.Commerce package Square

# AI
dotnet add src/AgelessLiving.AI package Microsoft.ML
dotnet add src/AgelessLiving.AI package Microsoft.ML.OnnxRuntime

# Marketing
dotnet add src/AgelessLiving.Marketing package MailKit

# Web
dotnet add src/AgelessLiving.Web package Hangfire.Core
dotnet add src/AgelessLiving.Web package Hangfire.SqlServer
dotnet add src/AgelessLiving.Web package Hangfire.AspNetCore
dotnet add src/AgelessLiving.Web package Serilog.AspNetCore
dotnet add src/AgelessLiving.Web package Serilog.Sinks.MSSqlServer
dotnet add src/AgelessLiving.Web package Serilog.Sinks.Console
dotnet add src/AgelessLiving.Web package Serilog.Enrichers.Environment
dotnet add src/AgelessLiving.Web package Microsoft.EntityFrameworkCore.Design
```

## 0.4 — Set up Tailwind CSS

```bash
cd src/AgelessLiving.Web
npm init -y
npm install -D tailwindcss @tailwindcss/forms @tailwindcss/typography
npx tailwindcss init
```

Create `src/AgelessLiving.Web/tailwind.config.js`:

```javascript
module.exports = {
  content: ["./**/*.{razor,cshtml,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#2A9D8F',
          'teal-dark': '#1E7A6E',
          'teal-light': '#E8F5F2',
          'teal-xlight': '#F2FAF8',
          gold: '#C8A951',
          'gold-dark': '#B89840',
          'gold-light': '#F5F0E0',
          cream: '#FAF8F5',
          dark: '#1D1D1D',
          muted: '#6B6B6B',
          'light-muted': '#9A9A9A',
          border: '#E8E5E0',
        },
        cat: {
          skin: '#C4918A',
          hormone: '#8AAEC4',
          bio: '#8AC4A8',
          weight: '#C4B88A',
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

Create `src/AgelessLiving.Web/Styles/app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Add to `AgelessLiving.Web.csproj` inside `<Project>`:

```xml
<Target Name="TailwindBuild" BeforeTargets="Build">
  <Exec Command="npx tailwindcss -i ./Styles/app.css -o ./wwwroot/css/site.css --minify" WorkingDirectory="$(ProjectDir)" />
</Target>
```

## 0.5 — Verify

```bash
cd ../..
dotnet build
```

✅ Must compile with 0 errors. `wwwroot/css/site.css` must exist.

---

# ══════════════════════════════════════════════
# PHASE 1 — UI LAYOUT: MAIN PUBLIC SITE
# ══════════════════════════════════════════════

> Build every visual component and page with hardcoded content first. No database, no services, no backend logic. Pure Blazor + Tailwind rendering. Get every pixel right before wiring data.

## DESIGN SYSTEM REFERENCE

**Fonts:** Google Fonts — Cormorant Garamond (display headings) + DM Sans (body/UI). Load via `<link>` in `App.razor` `<head>`.

**Colors (Tailwind classes):**
- Primary: `bg-brand-teal` / `text-brand-teal` / `hover:bg-brand-teal-dark`
- Accent: `text-brand-gold` / `bg-brand-gold`
- Background: `bg-brand-cream` (page), `bg-white` (cards, white bands)
- Text: `text-brand-dark` (headings), `text-brand-muted` (body), `text-brand-light-muted` (captions)
- Border: `border-brand-border`
- Categories: `bg-cat-skin`, `bg-cat-hormone`, `bg-cat-bio`, `bg-cat-weight`

**Typography pattern:**
- Section tag: `text-[11px] uppercase tracking-[3px] font-medium text-brand-gold`
- H2 heading: `font-display text-[38px] font-normal text-brand-dark`
- Body: `font-body text-[15px] leading-[1.7] text-brand-muted`
- Card title: `font-display text-[18px] font-medium`
- Price: `text-[14px] font-medium text-brand-teal`

**Spacing:** Sections use `py-20 px-12` desktop, `py-16 px-6` tablet, `py-12 px-4` mobile.

**Radii:** Buttons `rounded-md` (6px), cards `rounded-lg` (12px), large containers `rounded-2xl` (16px).

---

## FILE STRUCTURE TO CREATE

```
src/AgelessLiving.Web/Components/
├── App.razor                              (update <head> with fonts + site.css)
├── Routes.razor                           (already exists)
├── _Imports.razor                         (add project usings)
│
├── Layout/
│   └── MainLayout.razor                   (public site layout — nav + footer + AI bubble)
│
├── Pages/
│   ├── Home.razor                         (single-page scroll — route "/")
│   ├── Shop/
│   │   ├── ShopIndex.razor                (route "/shop")
│   │   └── ProductDetail.razor            (route "/shop/{Slug}")
│   ├── Auth/
│   │   ├── Login.razor                    (route "/login")
│   │   └── Register.razor                 (route "/register")
│   ├── Admin/
│   │   └── AdminDashboard.razor           (route "/admin" — placeholder for Phase 5)
│   └── Portal/
│       └── PortalOverview.razor           (route "/client-portal" — placeholder for Phase 5)
│
└── Shared/
    ├── NavBar.razor
    ├── Footer.razor
    ├── SectionHeader.razor
    ├── HeroSection.razor
    ├── TreatmentCategoryCard.razor
    ├── TreatmentGroupSection.razor
    ├── TreatmentCard.razor
    ├── ShopBanner.razor
    ├── LocationCard.razor
    ├── AboutSection.razor
    ├── StatCard.razor
    ├── TeamSection.razor
    ├── TeamCard.razor
    ├── BookingWizard.razor
    ├── ReviewCard.razor
    ├── BlogCard.razor
    ├── FaqSection.razor
    ├── FaqItem.razor
    ├── NewsletterSection.razor
    ├── ContactSection.razor
    ├── ChatWidget.razor                   (@rendermode InteractiveServer)
    └── ShoppingCart.razor                 (@rendermode InteractiveServer — placeholder)
```

---

## 1.1 — App.razor <head>

Update `App.razor` to include in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/site.css">
```

Set `<body class="font-body bg-brand-cream text-brand-dark">`.

---

## 1.2 — MainLayout.razor

The layout that wraps every public page. Contains:
1. `<NavBar />` at the top (sticky)
2. `@Body` in the middle
3. `<Footer />` at the bottom
4. `<ChatWidget />` (fixed position, always visible)

```razor
@inherits LayoutComponentBase

<NavBar />
<main>
    @Body
</main>
<Footer />
<ChatWidget />
```

---

## 1.3 — NavBar.razor

**Desktop (>1024px):**
- Height: 68px
- Background: `bg-white/[.97] backdrop-blur-sm`
- Border bottom: `border-b border-brand-border`
- Sticky: `sticky top-0 z-50`
- Left: Logo — "Ageless Living™" in `font-display text-[22px] font-medium text-brand-teal-dark`, below it "WELLNESS CENTRE" in `text-[10px] uppercase tracking-[3px] text-brand-muted`
- Right: Links row — Treatments · Locations · About · Team · Blog · FAQ · Contact (all `text-[13px] text-brand-muted hover:text-brand-dark`) + "Shop" (same size but `text-brand-gold font-medium`) + "Book Now" button (`bg-brand-teal text-white px-5 py-2 rounded-md text-[13px] font-medium`)

**Mobile (≤1024px):**
- Hamburger button (3 lines) on right
- Tapping it toggles a full-width dropdown below nav with links stacked vertically
- Implement toggle with a `bool isOpen` parameter, no JS needed in Interactive mode, or use a CSS-only checkbox hack for Static SSR

**The nav links anchor to sections on Home.razor:** `href="#treatments"`, `href="#locations"`, etc. "Shop" links to `/shop`. "Book Now" links to `#booking`.

---

## 1.4 — Home.razor (The Single-Page Scroll)

**Route:** `@page "/"`

This is the main page. It renders every section in order, top to bottom. Each section is its own shared component. Home.razor is just the orchestrator:

```razor
@page "/"

<HeroSection />

<section id="treatments" class="py-20 px-12 max-w-[1240px] mx-auto">
    <SectionHeader Tag="Our treatments" Heading="Picture your possible." Description="From skin rejuvenation to longevity medicine, our licensed medical staff offer personalized, holistic treatments designed around you." />

    <!-- 4 category cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <TreatmentCategoryCard Name="Skin Rejuvenation" Desc="Botox, fillers, laser, facials, and medical-grade peels for face and body." Color="cat-skin" Link="#treat-skin" />
        <TreatmentCategoryCard Name="Hormone Balancing" Desc="Bioidentical hormone therapy optimized for men and women of all ages." Color="cat-hormone" Link="#treat-hormone" />
        <TreatmentCategoryCard Name="Biohacking" Desc="IV therapy, NAD+, peptides, and advanced longevity protocols." Color="cat-bio" Link="#treat-bio" />
        <TreatmentCategoryCard Name="Healthy Weight" Desc="Physician-supervised programs for sustainable, holistic weight management." Color="cat-weight" Link="#treat-weight" />
    </div>

    <!-- Individual treatment groups -->
    <TreatmentGroupSection />  <!-- Contains all 4 groups with all treatments -->

    <ShopBanner />
</section>

<section id="locations" class="py-20 px-12 bg-white">
    <!-- 3 location cards inside -->
</section>

<section id="about" class="py-20 px-12 max-w-[1240px] mx-auto">
    <AboutSection />
</section>

<section id="team" class="py-20 px-12 bg-white">
    <TeamSection />
</section>

<section id="booking" class="py-20 px-12 max-w-[1240px] mx-auto">
    <BookingWizard />
</section>

<section id="testimonials" class="py-20 px-12 bg-white">
    <!-- 3 review cards -->
</section>

<section id="blog" class="py-20 px-12 max-w-[1240px] mx-auto">
    <!-- 3 blog cards -->
</section>

<section id="faq" class="py-20 px-12 bg-white">
    <FaqSection />
</section>

<NewsletterSection />

<section id="contact" class="py-20 px-12 max-w-[1240px] mx-auto">
    <ContactSection />
</section>
```

Now build each component. **Use hardcoded content for now.** Every treatment name, description, price, team member name, FAQ question — hardcode it all. We wire the database in Phase 3.

---

## 1.5 — HeroSection.razor

**Layout:** 2-column grid (`grid grid-cols-1 lg:grid-cols-2`), min-height 540px, white bg.

**Left column** (`p-20 flex flex-col justify-center`):

- Tag: "Longevity · Vitality · Wellness" — `text-[11px] uppercase tracking-[3px] font-medium text-brand-gold mb-6`
- H1: "Discover your best self, at any age." — `font-display text-[52px] font-normal leading-[1.08] mb-6`
  - The words "at any age." wrapped in `<em class="italic text-brand-teal">`
- Description: "Ageless Living brings together medical-grade treatments, cutting-edge technologies, and physician-led science to help you live better, longer." — `text-[15px] text-brand-muted max-w-[440px] mb-8 leading-[1.7]`
- Two buttons side by side (`flex gap-3.5`):
  - "Book a consultation" → `bg-brand-teal text-white px-7 py-3.5 rounded-md text-[14px] font-medium hover:bg-brand-teal-dark transition`
  - "Explore treatments" → `border border-brand-border px-7 py-3.5 rounded-md text-[14px] font-medium hover:border-brand-dark transition`
- Location badges row (`flex gap-6 mt-7`):
  - 3x: gold dot (`w-1.5 h-1.5 rounded-full bg-brand-gold`) + city name (`text-[12px] text-brand-muted`)

**Right column:** `bg-brand-teal-light flex items-center justify-center`
- Circular placeholder: 320px outer ring (1px teal border 15% opacity) → 240px inner circle (teal bg 7% opacity) → centered text "Hero video / lifestyle image"

**Responsive:** On mobile (`lg:grid-cols-1`), stack vertically, title drops to `text-[36px]`, buttons stack.

---

## 1.6 — SectionHeader.razor

Reusable component accepting parameters:

```razor
@code {
    [Parameter] public string Tag { get; set; } = "";
    [Parameter] public string Heading { get; set; } = "";
    [Parameter] public string Description { get; set; } = "";
    [Parameter] public bool Center { get; set; } = false;
}

<div class="@(Center ? "text-center" : "")">
    @if (!string.IsNullOrEmpty(Tag))
    {
        <p class="text-[11px] uppercase tracking-[3px] font-medium text-brand-gold mb-4">@Tag</p>
    }
    <h2 class="font-display text-[38px] font-normal leading-[1.15] text-brand-dark mb-4">@((MarkupString)Heading)</h2>
    @if (!string.IsNullOrEmpty(Description))
    {
        <p class="text-[15px] text-brand-muted max-w-[520px] mb-12 leading-[1.7] @(Center ? "mx-auto" : "")">@Description</p>
    }
</div>
```

---

## 1.7 — TreatmentCategoryCard.razor

```razor
@code {
    [Parameter] public string Name { get; set; } = "";
    [Parameter] public string Desc { get; set; } = "";
    [Parameter] public string Color { get; set; } = "cat-skin";  // cat-skin, cat-hormone, cat-bio, cat-weight
    [Parameter] public string Link { get; set; } = "#";
}
```

**Structure:**
- Container: `bg-white rounded-lg border border-brand-border hover:border-brand-teal hover:-translate-y-1 transition-all duration-300 overflow-hidden block`
- Image area: `h-[150px] bg-{Color} flex items-center justify-center` — placeholder text "Photo" in white
- Body: `p-5`
  - Name: `font-display text-[20px] font-medium mb-1.5`
  - Desc: `text-[13px] text-brand-muted leading-[1.5] mb-3.5`
  - Link: `text-[13px] text-brand-teal font-medium` → "View treatments →"

---

## 1.8 — TreatmentGroupSection.razor

Contains ALL 4 treatment groups, stacked vertically with `mt-14` between them.

**Each group has:**
1. Gold divider: `<div class="w-[60px] h-[2px] bg-brand-gold mb-5"></div>`
2. Group title: `font-display text-[26px] font-medium mb-1.5`
3. Group subtitle: `text-[13px] text-brand-muted mb-6`
4. Treatment grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
5. Inside the grid: multiple `<TreatmentCard />` components

**SKIN REJUVENATION — 8 cards:**

| Name | Description | Price | Duration | Locations |
|---|---|---|---|---|
| Botox / Dysport | Cosmetic injections to smooth wrinkles and take years off your appearance. Performed by certified clinical injectors. | From $299 CAD | 30 min | All |
| Cosmetic Dermal Filler | Smooth lines and restore volume with Restylane®, Revanesse®, PRP, and Sculptra®. Enhance cheeks, lips, chin, jawline. | From $449 CAD | 45 min | All |
| Customized UltraFacial | HydraFacial (Victoria & Langley) or AquaFirme (Kelowna) — customized for deep hydration and glow. | From $199 CAD | 60 min | All (varies) |
| Laser & IPL/BBL | Medical-grade laser for sun damage, redness, hair removal, texture. ICON® (Langley/Victoria) or Sciton® BBL (Kelowna). | From $249 CAD | 30–60 min | All (varies) |
| The Perfect Derma™ Peel | Powerful glutathione peel targeting stubborn acne, scarring, melasma, and deep hyperpigmentation. | From $349 CAD | 45 min | All |
| Medical Microneedling | Collagen Induction Therapy triggers growth factors. Dramatically improves skin texture with a series of treatments. | From $249 CAD | 45 min | All |
| Belkyra™ | Injectable using deoxycholic acid to reduce submental fat (double chin). Non-surgical with contoured result. | Consultation | 30 min | All |
| Dermaplaning | Manual exfoliation with stainless steel surgical tool to remove dead skin cells and fine vellus hair. | From $149 CAD | 30 min | All |

**HORMONE BALANCING — 3 cards:**

| Name | Description | Price | Duration | Locations |
|---|---|---|---|---|
| Bioidentical Hormone Therapy | Custom-compounded hormones identical to your body's own. Personalized protocols based on comprehensive bloodwork. | Complimentary consult | 60 min | All |
| Testosterone Optimization | Comprehensive testing and therapy for men with fatigue, decreased libido, brain fog, loss of muscle mass. | Complimentary consult | 45 min | All |
| Menopause & Perimenopause | Targeted relief from hot flashes, brain fog, fatigue, mood changes, sleep disruption using bioidentical protocols. | Complimentary consult | 60 min | All |

**BIOHACKING — 8 cards (IMPORTANT: locations vary per treatment):**

| Name | Description | Price | Duration | V | L | K |
|---|---|---|---|---|---|---|
| PBM / Red Light Therapy | Red and near-infrared light to stimulate healing, reduce inflammation, increase energy production. | From $99 CAD | 30 min | ✓ | ✓ | ✓ |
| IV Nutrient Therapy | Vitamins, minerals, amino acids directly to bloodstream for fatigue, stress, recovery. | From $199 CAD | 45 min | — | — | ✓ |
| HBOT (Hyperbaric Oxygen) | 100% oxygen in pressurized chamber. Enhances circulation, reduces inflammation, accelerates recovery. | From $149 CAD | 60 min | — | ✓ | ✓ |
| Neurointegrator | Neurofeedback system teaching brain optimal patterns. Helps ADHD, anxiety, insomnia, fatigue, depression. | From $149 CAD | 45 min | — | ✓ | — |
| Brain Tap | Light, sound, guided meditation for optimal brainwave states. Think better, sleep better, perform better. | From $49 CAD | 30 min | — | — | ✓ |
| Far Infrared Sauna | Burns ~600 cal/session, eliminates toxins, relieves muscle/joint pain. Used for 40+ years. | From $49 CAD | 30 min | — | ✓ | ✓ |
| NuCalm | Balances nervous system. Improves sleep, manages stress. Often combined with HBOT or PEMF. | From $49 CAD | 30 min | ✓ | ✓ | — |
| PEMF | Pulsed Electromagnetic Field brings cells into resonance. Activates body's repair system. | From $49 CAD | 30 min | ✓ | ✓ | ✓ |

**Each biohacking card MUST show location availability badges** — small pills showing which locations offer it (e.g., "Langley" "Kelowna" in small teal-light pills, or "—" for unavailable).

**HEALTHY WEIGHT — 3 cards:**

| Name | Description | Price | Duration | Locations |
|---|---|---|---|---|
| Medical Weight Program | Physician-led program: nutrition planning, lab monitoring, metabolic optimization, ongoing support. Includes GLP-1 protocols. | Complimentary consult | 60 min | All |
| Metabolic Testing | Understand your unique metabolism for a sustainable, science-backed plan tailored to your body. | From $149 CAD | 30 min | All |
| Body Composition Analysis | Precision measurement of lean mass, body fat, hydration, visceral fat for data-driven progress. | From $99 CAD | 20 min | All |

---

## 1.9 — TreatmentCard.razor

**Parameters:**

```razor
@code {
    [Parameter] public string Name { get; set; } = "";
    [Parameter] public string Description { get; set; } = "";
    [Parameter] public string Price { get; set; } = "";
    [Parameter] public string Duration { get; set; } = "";
    [Parameter] public string Locations { get; set; } = "All";
    [Parameter] public bool ShowLocationBadges { get; set; } = false;
    [Parameter] public bool Victoria { get; set; } = true;
    [Parameter] public bool Langley { get; set; } = true;
    [Parameter] public bool Kelowna { get; set; } = true;
}
```

**Structure:**
- Container: `bg-white border border-brand-border rounded-[10px] p-6 flex flex-col hover:border-brand-teal transition`
- Name: `font-display text-[18px] font-medium mb-2`
- Description: `text-[13px] text-brand-muted leading-[1.55] mb-4 flex-1`
- Location badges (if `ShowLocationBadges`): row of small pills — for each true location show `bg-brand-teal-light text-brand-teal-dark text-[10px] px-2 py-0.5 rounded-full`, for false show `bg-gray-100 text-gray-400 line-through`
- Meta row: `flex justify-between items-center mb-3.5`
  - Price: `text-[14px] font-medium text-brand-teal`
  - Duration + location: `text-[11px] text-brand-light-muted`
- Book button: `block text-center bg-brand-teal-xlight text-brand-teal-dark py-2.5 rounded-md text-[13px] font-medium hover:bg-brand-teal hover:text-white transition`
  - Text: "Book this treatment" (or "Book consultation" if price is "Complimentary consult" or "Consultation")

---

## 1.10 — ShopBanner.razor

- Container: `mt-14 bg-brand-gold-light rounded-lg border border-brand-border p-8 flex items-center justify-between gap-6 flex-wrap`
- Left: "Shop Ageless Living" in `font-display text-[24px] font-medium` + "Browse 117+ skincare products, supplements, and wellness essentials." in `text-[14px] text-brand-muted`
- Right: "Visit our shop →" link → `bg-brand-gold text-brand-dark px-7 py-3 rounded-md text-[14px] font-medium hover:opacity-90 transition` linking to `/shop`

---

## 1.11 — LocationCard.razor

**Parameters:** Name, Address, Phone, Email, Hours (hardcoded rows), BookingUrl

**Structure:**
- Container: `bg-brand-cream rounded-lg border border-brand-border p-7 hover:border-brand-gold transition`
- City: `font-display text-[26px] font-medium mb-1.5`
- Address: `text-[13px] text-brand-muted leading-[1.6] mb-3.5`
- Phone: `text-[13px] font-medium mb-0.5`
- Email: `text-[13px] text-brand-teal block mb-4`
- Hours block: `py-3.5 border-t border-b border-brand-border mb-4.5`
  - Rows: `flex justify-between text-[12px] py-0.5` — day in `font-medium text-brand-dark`, time in `text-brand-muted`
- Book button: `block w-full text-center bg-brand-teal text-white py-3 rounded-md text-[13px] font-medium hover:bg-brand-teal-dark transition`

**Render 3 cards in `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`:**

| City | Address | Phone | Email | Hours |
|---|---|---|---|---|
| Langley | 415-20178 96th Ave, Langley, BC V1M 0B2 | +1 (236) 326-6830 | langley@agelessliving.ca | M-F 9-5, Sat 10-4, Sun Closed |
| Victoria | 1-101 Burnside Rd W, Victoria, BC V9A 1B7 | +1 (250) 590-5787 | wellness@agelessliving.ca | M-F 9-5, Sat 10-3, Sun Closed |
| Kelowna | 102-3320 Richter St, Kelowna, BC V1W 4V5 | +1 (778) 760-9827 | kelowna@agelessliving.ca | M-F 9-5, Sat By appt, Sun Closed |

---

## 1.12 — AboutSection.razor

**Layout:** `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`

**Left:** Placeholder image area — `bg-brand-teal-light rounded-2xl h-[400px] flex items-center justify-center text-brand-teal-dark text-[14px] opacity-60` → "Clinic photography"

**Right:**
- SectionHeader: Tag "About Ageless Living", Heading "Founded by physicians.<br>Driven by science."
- Paragraph 1: "Co-founded by pharmacist Michael Forbes (BSc Pharm, MBA) and Dr. Jean-Paul Lim (MD Internal Medicine), Ageless Living blends the best of traditional medicine with groundbreaking wellness therapies."
- Paragraph 2: "We promote an innovative shift in health care: moving past conventional approaches of suppressing symptoms to treat root causes with multidisciplinary, solutions-based programs."
- Paragraph 3: "Evidence suggests as much as 80% of health is influenced by how we live each day. The upshot? Wellbeing is in our hands."
- Stat grid (`grid grid-cols-2 gap-3.5 mt-7`):
  - 10+ → Years in BC
  - 3 → Clinic locations
  - 14+ → Licensed professionals
  - 4 → Treatment categories

**StatCard.razor:** `bg-white border border-brand-border rounded-[10px] p-5` → number in `font-display text-[36px] font-medium text-brand-teal` → label in `text-[12px] text-brand-muted mt-0.5`

---

## 1.13 — TeamSection.razor

**Group by location.** Each location gets a sub-header and its own grid.

For each location group:
- Location name: `font-display text-[22px] font-medium mb-4 mt-10 first:mt-0`
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`

**TeamCard.razor:**
- Container: `bg-white rounded-lg border border-brand-border overflow-hidden hover:border-brand-teal transition`
- Photo: `h-[200px] flex items-center justify-center font-display text-[36px] font-medium text-white` + background color placeholder (e.g., `bg-[#9ABFB5]`)
- Body: `p-5`
  - Name: `font-display text-[18px] font-medium mb-0.5`
  - Title: `text-[12px] text-brand-teal font-medium mb-2`
  - Bio: `text-[12px] text-brand-muted leading-[1.55]`

**FULL TEAM DATA:**

**Langley:** Shelley McBride (MOA, Clinic Manager), Yvonne Ng (Certified Medical Aesthetician), Avnit Bhullar (Medical Aesthetician), Michael Forbes BSc Pharm (Owner, Pharmacist, Certified in Hormone Restoration), Dr. Jean Paul Lim MD FRCPC (Owner, Internal Medicine, Complex Care, Longevity Specialist)

**Victoria:** Sarita Hutton (Owner, Aesthetic Nurse Specialist, Director of Aesthetic Medicine), Lucy Watson (Clinic Manager), Madison Allen (Clinic Administrator, MOA), Jenny Hwang RN (Aesthetic Nurse Mentee), Dr. Jason Boxtart ND (Men's Health Specialist), Dr. Tracey Lotze MD (Hormone and Sexual Health Specialist)

**Kelowna:** Constanza Moraga Herrera (Certified Nutritional Practitioner, Lifestyle Medicine & Microbiota Specialist), Rachel Bowman Fassio BSc CN RHN (Clinical and Holistic Nutritionist), Melissa Zitterer (Clinic Manager, MOA), Dr. Jason Boxtart ND, Dr. Tracey Lotze MD, Michael Forbes BSc Pharm, Dr. Jean Paul Lim MD FRCPC

---

## 1.14 — BookingWizard.razor

**Header:** Centered SectionHeader — Tag "Book your visit", Heading "Start your wellness journey."

**Container:** `bg-brand-teal-dark rounded-2xl p-12 grid grid-cols-1 lg:grid-cols-3 gap-6`

**Each step:**
- Step number: `font-display text-[48px] font-light text-white`
- Label: `text-[13px] text-white/60`
- Divider: `w-full h-px bg-white/[.12] my-4`
- Description: `text-[13px] text-white/80 leading-[1.6]`

**Step 1:** "Choose location" — description + 3 pill buttons (Langley, Victoria, Kelowna) styled `bg-white/10 text-white border border-white/20 rounded-full px-4 py-1.5 text-[12px] hover:bg-white/20 transition`

**Step 2:** "Pick treatment" — description + 4 category pills (Skin, Hormones, Bio, Weight)

**Step 3:** "Confirm on Jane" — description + gold CTA button `bg-brand-gold text-brand-dark px-7 py-3 rounded-md text-[14px] font-medium`

---

## 1.15 — Testimonials Section (in Home.razor)

SectionHeader: Tag "What our clients say", Heading "Real results, real people."

Grid: `grid grid-cols-1 lg:grid-cols-3 gap-6`

**ReviewCard.razor:**
- Container: `bg-white rounded-lg border border-brand-border p-7`
- Stars: `text-brand-gold text-[16px] tracking-[2px] mb-3.5` → "★★★★★"
- Quote: `text-[14px] text-brand-dark italic leading-[1.65] mb-5`
- Author row: `flex items-center gap-2.5`
  - Avatar: `w-[38px] h-[38px] rounded-full bg-brand-teal-light flex items-center justify-center text-[13px] font-medium text-brand-teal-dark`
  - Name: `text-[13px] font-medium`
  - Meta: `text-[11px] text-brand-muted`

**3 reviews:**
1. Karen M. (KM) — Victoria · UltraFacial — "The team at Ageless Living Victoria made me feel so comfortable. My HydraFacial results were incredible — my skin hasn't looked this good in years."
2. David L. (DL) — Langley · Hormone Balancing — "After struggling with fatigue for years, the hormone optimization program changed everything. I have more energy now than I did at 30."
3. Jennifer P. (JP) — Kelowna · Healthy Weight — "The healthy weight program is unlike any diet I've tried. It's physician-supervised, personalized, and actually sustainable. Down 30 lbs and keeping it off."

---

## 1.16 — Blog Section (in Home.razor)

SectionHeader: Tag "From our blog", Heading "Insights on wellness and longevity."

Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**BlogCard.razor:**
- Container: `bg-white rounded-lg border border-brand-border overflow-hidden hover:border-brand-teal hover:-translate-y-0.5 transition-all`
- Image: `h-[180px] flex items-center justify-center text-[14px] font-medium text-white` + category color bg
- Body: `p-6`
  - Category: `text-[11px] text-brand-teal font-medium uppercase tracking-[.5px] mb-2`
  - Title: `font-display text-[19px] font-medium leading-[1.3] mb-2`
  - Excerpt: `text-[13px] text-brand-muted leading-[1.55] mb-3.5`
  - Date: `text-[11px] text-brand-light-muted`

**3 posts:**
1. "Understanding GLP-1 Agonists: The Science Behind Medical Weight Loss" — Medical Weight Loss — Dr. Jean Paul Lim — bg-cat-hormone
2. "A wellness revolution" — Press Feature — Boulevard Magazine, Nov 2024 — bg-cat-bio
3. "Spring skin reset: top 3 treatments for sun-damaged skin" — Skin Rejuvenation — Sarita Hutton, RN — bg-cat-skin

---

## 1.17 — FaqSection.razor

Centered SectionHeader: Tag "FAQ", Heading "Common questions."

Container: `max-w-[720px] mx-auto`

**FaqItem.razor:**
- Container: `border-b border-brand-border`
- Question button: `w-full flex justify-between items-center py-5.5 text-left font-display text-[20px] font-medium gap-4`
  - Text on left
  - "+" icon on right (`text-[22px] text-brand-muted transition-transform duration-300`) — rotates 45° when open
- Answer: hidden by default, slides open. `text-[14px] text-brand-muted leading-[1.7] pb-5.5`
- Toggle via `bool isOpen` on click

**20 FAQ items organized by category. Render ALL of them:**

**Biohacking (10):**
1. What is biohacking? → "Biohacking refers to the process of achieving better health through groundbreaking modern therapies, from advanced medical technologies to natural treatments, that enables us to treat or reverse damage done to our bodies over time."
2. What aspects of my life will improve? → "Depends on your treatment regimen. Targeting inflammation: more energetic, less achy, improved mood, mental clarity."
3. Can Infrared help me lose weight? → "Yes. FIR saunas release feel-good chemicals, eliminate toxins, increase glutathione, aid detoxification. Burns ~600 calories per session."
4. What does the Neurointegrator do? → "A neurofeedback device that corrects unhealthy brain signalling using personalized training regimens to develop healthier patterns."
5. Is Biohacking backed by research? → "Yes, plethora of studies on stress, inflammation, mental wellness, sleep, and gene expression (epigenetics)."
6. Does BHC help with insomnia? → "Yes. Our bodies depend on healthy sleep. Correcting insomnia involves a multi-system approach."
7. Does BHC help with inflammation? → "Yes. Inflammation is linked to autoimmune disorders, depression, fibromyalgia, chronic fatigue, insulin resistance, obesity, hormonal imbalances."
8. Are there negative side effects? → "Depends on treatment. Important to get treatments from a trained professional. Your specialist can speak to risks."
9. How does HBOT work? → "Oxygen at higher pressures improves oxygenated blood flow, reduces free radicals, combats infections, improves recovery."
10. How do I know which service is right? → "Our staff are trained to identify your needs. We have packages for fatigue, inflammation, insomnia, and anxiety/stress."

**Health Weight (3):**
11. Can you guarantee weight loss? → "We offer a refund within 3 months if unhappy. We're confident our protocol works for weight loss and overall wellness."
12. Does it include meal planning? → "Yes. We educate and guide — no processed prepared meals. We equip you with skills for lasting lifestyle changes."
13. What makes it different from diets? → "We focus on optimizing health, not just weight. Medically designed, assesses mental health factors too. Tiered pricing."

**Hormone (3):**
14. What to expect at initial hormone consultation? → "Complete online questionnaire, baseline blood work, saliva test before appointment. Therapy may begin immediately."
15. What to expect at Health Weight assessment? → "Series of online questionnaires. Baseline blood work if not already a member."
16. Benefits of annual membership? → "Affordable, worry-free medical team access based on need, not finances. Flexible payments — annual or monthly."

**Skin (4):**
17. When can I get filler after COVID vaccine? → "Wait 4 weeks before and after for filler. BOTOX is fine anytime if symptom free."
18. Are consultations mandatory? → "Yes, to determine candidacy. Often same-day treatment possible. Some need preparation (laser, IPL)."
19. I'm new — where do I start? → "Think about how your appearance makes you feel. Consultation designs a custom plan collaboratively."
20. How to minimize wrinkles? → "Botox, fillers, laser, collagen stimulation, peels, cosmeceutical skincare. Combination approach recommended."

---

## 1.18 — NewsletterSection.razor

- Container: `py-20 px-12 bg-brand-teal-dark text-center`
- Heading: `font-display text-[34px] font-normal text-white mb-2`  → "Stay in the loop."
- Description: `text-[15px] text-white/70 mb-8` → "Sign up for wellness tips, exclusive offers, and updates from our medical team."
- Form: `flex gap-3 justify-center max-w-[500px] mx-auto flex-wrap`
  - Email input: `flex-1 min-w-[200px] px-5 py-3.5 rounded-md border border-white/20 bg-white/10 text-white text-[14px] placeholder:text-white/50 focus:border-white/50 outline-none`
  - Submit: `bg-brand-gold text-brand-dark px-7 py-3.5 rounded-md text-[14px] font-medium hover:opacity-90 transition`

---

## 1.19 — ContactSection.razor

SectionHeader: Tag "Get in touch", Heading "We'd love to hear from you."

**Layout:** `grid grid-cols-1 lg:grid-cols-2 gap-12`

**Left — Form:**
- Row 1: First name + Last name (2-col grid)
- Row 2: Email
- Row 3: Phone (optional)
- Row 4: Location dropdown (Langley / Victoria / Kelowna)
- Row 5: Interest dropdown (Skin / Hormone / Bio / Weight / General)
- Row 6: Textarea message
- Submit button

Input style: `w-full px-4 py-3 border border-brand-border rounded-lg text-[14px] bg-white focus:border-brand-teal outline-none transition`

**Right — Two stacked cards:**

Card 1 — Direct Contact: `bg-brand-teal-light rounded-lg p-7`
- Title: "Direct contact" (font-display 20px medium)
- 3 location blocks: bold city name + phone + email

Card 2 — Follow Us: `bg-brand-gold-light rounded-lg p-7`
- Title: "Follow us"
- Social links: Instagram · Facebook · YouTube (teal, font-medium)

---

## 1.20 — Footer.razor

- Container: `bg-brand-dark text-white/70 pt-16 pb-7 px-12`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-[1240px] mx-auto mb-11`

**Column 1:** Logo "Ageless Living™" (font-display 22px white) + brand desc (13px, max-w-260px)
**Column 2:** Treatments heading (11px uppercase tracking-[2px] white/35 mb-4) + 4 links (13px white/65)
**Column 3:** Company — About, Team, Blog, FAQ, Careers, Privacy (same link style)
**Column 4:** Locations — 3 cities as links + addresses below each (12px white/35)

**Bottom bar:** `border-t border-white/[.08] pt-5.5 flex justify-between text-[11px] text-white/25 max-w-[1240px] mx-auto`

---

## 1.21 — ChatWidget.razor (Interactive Server)

**This component uses `@rendermode InteractiveServer`** because it needs real-time state.

**Collapsed state (bubble):**
- `fixed bottom-6 right-6 z-[200]`
- `w-[60px] h-[60px] rounded-full bg-brand-teal text-white shadow-[0_4px_20px_rgba(42,157,143,.3)] cursor-pointer hover:bg-brand-teal-dark hover:scale-105 transition flex items-center justify-center`
- Chat bubble SVG icon (26px)
- Gold notification badge: `absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-brand-gold border-2 border-white`

**Expanded state (panel):**
- `fixed bottom-6 right-6 z-[200] w-[380px] max-h-[min(580px,calc(100vh-100px))] bg-white rounded-2xl border border-brand-border shadow-[0_8px_40px_rgba(0,0,0,.12)] flex flex-col overflow-hidden`
- Animate in: opacity + translateY + scale transition

**Header:** `px-4.5 py-3.5 bg-brand-teal flex items-center justify-between`
- Left: Avatar circle + "Ageless AI" (white 14px medium) + "Your wellness concierge" (white/65 11px)
- Right: Close button (× icon)

**Body:** `flex-1 overflow-y-auto p-4 flex flex-col gap-2.5`
- Bot messages: left-aligned, `bg-brand-cream rounded-[2px_12px_12px_12px] px-3.5 py-2.5 text-[13px]`
- User messages: right-aligned, `bg-brand-teal text-white rounded-[12px_2px_12px_12px] px-3.5 py-2.5 text-[13px]`
- Quick action buttons: `bg-white border border-brand-border rounded-full px-3 py-1.5 text-[12px] text-brand-teal-dark hover:border-brand-teal hover:bg-brand-teal-light transition cursor-pointer`

**Input area:** `px-3.5 py-2.5 border-t border-brand-border flex gap-2 items-center`
- Input: `flex-1 border border-brand-border rounded-full px-4 py-2.5 text-[13px] bg-brand-cream focus:border-brand-teal outline-none`
- Send button: `w-[34px] h-[34px] rounded-full bg-brand-teal text-white flex items-center justify-center hover:bg-brand-teal-dark transition`

**Chat logic (hardcoded responses for Phase 1):**

On open, show welcome message + quick action buttons: "Recommend a treatment" · "Book a consultation" · "See pricing" · "Find a location"

Intent matching (keyword-based):
- "recommend/suggest/best/which" → List top 3 treatments with prices
- "book/appointment/schedule" → Ask location → show 3 location buttons → show booking CTA
- "price/cost/how much" → Price overview by category
- "location/where/address/hours" → All 3 addresses and phones
- "skin/botox/filler/facial/laser" → Skin treatment details
- "hormone/testosterone/menopause" → Hormone program details
- "biohack/NAD/IV/peptide/HBOT" → Biohacking details
- "weight/metabol/diet" → Health Weight details
- Default → Friendly fallback offering help categories

---

## 1.22 — ShopIndex.razor (placeholder)

**Route:** `@page "/shop"`

For Phase 1, create a placeholder page with:
- Same NavBar and Footer
- Hero: "Shop Ageless Living" + "Browse our collection of skincare, supplements, and wellness products."
- Placeholder grid: 8 empty product cards with "Product coming soon" text
- Note: "Products will be synced from Square in Phase 4"

---

## 1.23 — Verify Phase 1

```bash
dotnet build
dotnet run --project src/AgelessLiving.Web
```

Open browser → `https://localhost:5001`

✅ **Phase 1 is complete when:**
- [ ] Homepage scrolls through all 18 sections smoothly
- [ ] Sticky nav works, all anchor links scroll to correct sections
- [ ] All 22 treatments render with name, description, price, duration, location
- [ ] Biohacking cards show per-location availability badges
- [ ] All 3 location cards show full data + hours
- [ ] Team section shows all 14 staff grouped by location
- [ ] Booking wizard shows 3 steps with interactive pills
- [ ] FAQ accordion opens/closes all 20 items
- [ ] AI chatbot opens/closes, shows welcome message, responds to typed input
- [ ] Newsletter and contact forms render (submission is wired in Phase 3)
- [ ] Footer shows all content
- [ ] Mobile responsive: hamburger nav, stacked grids, full-width chat panel
- [ ] /shop shows placeholder page
- [ ] No JavaScript files except what Blazor requires (Tailwind is pre-compiled CSS)

---

# ══════════════════════════════════════════════
# PHASE 2 — DATABASE & DOMAIN MODELS
# ══════════════════════════════════════════════

> Create all entities in AgelessLiving.Core, the DbContext in Infrastructure, run migrations, seed data.

**Entities to create (see full build prompt for property definitions):**
- Location, Provider, Treatment, LocationTreatment, ProviderTreatment
- Product, Order, OrderItem
- BlogPost, BookingEvent, ClientProfile, ContactSubmission, Review, CampaignMessage
- Enums: OrderStatus, BookingSource, BookingStatus, CampaignType, CampaignChannel, MessageStatus

**Seed data:** All 3 locations with real addresses/phone/email, all 22 treatments, all 14 providers, all location-treatment assignments, all provider-treatment assignments.

**End state:** `dotnet ef database update` creates all tables. `SELECT * FROM Locations` returns 3 rows. `SELECT * FROM Treatments` returns 22 rows.

---

# ══════════════════════════════════════════════
# PHASE 3 — WIRE UI TO DATABASE
# ══════════════════════════════════════════════

> Replace all hardcoded content in Phase 1 components with data from AppDbContext. Create services for each domain area.

- Home.razor injects services, loads treatments/locations/team/blog/reviews from DB
- Each component receives entity objects instead of string parameters
- Contact form saves to ContactSubmission table
- Newsletter saves to ClientProfile with OptInMarketing = true
- Booking wizard click-throughs log to BookingEvent table
- Blog cards pull from BlogPost table
- Reviews pull from Review table (approved + featured only)

---

# ══════════════════════════════════════════════
# PHASE 4 — INTEGRATIONS
# ══════════════════════════════════════════════

> Wire Jane App booking, Square shop, Canada Post shipping.

**4A — Jane App:** Store booking URLs per location in DB. Every "Book" button constructs the correct Jane URL and opens in new tab. Log click-throughs. Admin can edit URLs.

**4B — Square Shop:** Build /shop and /shop/{slug} pages. SquareCatalogSyncService pulls products. SquareInventorySyncService tracks stock. Cart component (Interactive Server). Checkout with Square Web Payments SDK. Order creation.

**4C — Canada Post:** Rate calculation at checkout. Label generation on order processing. Tracking number storage.

---

# ══════════════════════════════════════════════
# PHASE 5 — ADMIN DASHBOARD & CLIENT PORTAL
# ══════════════════════════════════════════════

> Build the 12 admin pages and 4 client portal pages.

**Admin:** Dashboard home, booking/order/product/treatment/provider/location/blog/client/review/campaign management, settings.

**Portal:** Overview with AI recommendations, booking history, order history, profile.

**Auth:** Login, register, email verification, password reset. Roles: Manager, FrontDesk, Clinician, Client.

---

# ══════════════════════════════════════════════
# PHASE 6 — AI/ML & MARKETING AUTOMATION
# ══════════════════════════════════════════════

> Replace the hardcoded chatbot with ONNX-powered RAG. Add recommender, sentiment analysis, content generation. Set up automated email/SMS campaigns.

**AI:** Knowledge base indexing, vector similarity search, local ONNX inference for chat. ML.NET recommender. Sentiment on reviews.

**Marketing:** Email templates (9), automated campaigns (welcome series, post-visit, rebooking, abandoned cart, review request). Hangfire jobs for all.

---

# ══════════════════════════════════════════════
# PHASE 7 — SEO, QA & DEPLOYMENT
# ══════════════════════════════════════════════

> JSON-LD structured data on every section. Sitemap.xml. Robots.txt. Meta tags. Load testing. Security audit. IIS deployment to Windows Server 2025.

---

**START WITH PHASE 0. When it builds clean, move to Phase 1. Build every component in Phase 1 before touching Phase 2.**
