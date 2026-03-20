# Ageless Living - Development Handoff

## Project Overview

Building the redesigned website for **Ageless Living™ Wellness Centre**, a medical aesthetics and longevity clinic with 3 locations in British Columbia, Canada (Langley, Victoria, Kelowna).

**Spec file location:** `c:\Users\ejsaant\Ageless\Ageless\spec.md`

**Tech Stack:**
- Runtime: .NET 10 LTS
- Framework: ASP.NET Core + Blazor (Static SSR for public pages, Interactive Server for dynamic components)
- Database: SQL Server + Entity Framework Core
- Styling: Tailwind CSS v4
- Background Jobs: Hangfire
- Logging: Serilog
- Payments: Square .NET SDK
- Shipping: Canada Post REST API
- Booking: Jane App (embed codes/URLs only - no API)
- AI/ML: Local .NET ONNX Runtime
- Hosting: IIS on Windows Server 2025

---

## Phase 0 - COMPLETED ✅

### What Was Done

#### 0.1 - Solution and Projects Created
Created the solution at `c:\Users\ejsaant\Ageless\Ageless\AgelessLiving\`

```
AgelessLiving/
├── AgelessLiving.sln
└── src/
    ├── AgelessLiving.Web/           # Blazor Web App (main entry point)
    ├── AgelessLiving.Core/          # Domain models, entities, enums
    ├── AgelessLiving.Infrastructure/ # EF Core DbContext, Identity, data access
    ├── AgelessLiving.Booking/       # Jane App integration
    ├── AgelessLiving.Commerce/      # Square SDK integration
    ├── AgelessLiving.Content/       # CMS, blog, static content
    ├── AgelessLiving.AI/            # ML.NET, ONNX Runtime, chatbot
    └── AgelessLiving.Marketing/     # MailKit, email campaigns
```

#### 0.2 - Project References Wired
- Core has zero dependencies
- Infrastructure → Core
- Booking → Core + Infrastructure
- Commerce → Core + Infrastructure
- Content → Core + Infrastructure
- AI → Core + Infrastructure
- Marketing → Core + Infrastructure + Commerce + Booking
- Web → All projects

#### 0.3 - NuGet Packages Installed

**Infrastructure:**
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Tools
- Microsoft.AspNetCore.Identity.EntityFrameworkCore

**Booking:**
- Ical.Net

**Commerce:**
- Square (v43.0.0)

**AI:**
- Microsoft.ML (v5.0.0)
- Microsoft.ML.OnnxRuntime (v1.24.3)

**Marketing:**
- MailKit (v4.15.1)

**Web:**
- Hangfire.Core, Hangfire.SqlServer, Hangfire.AspNetCore (v1.8.23)
- Serilog.AspNetCore (v10.0.0)
- Serilog.Sinks.MSSqlServer (v9.0.3)
- Serilog.Sinks.Console (v6.1.1)
- Serilog.Enrichers.Environment (v3.0.1)
- Microsoft.EntityFrameworkCore.Design (v10.0.5)

#### 0.4 - Tailwind CSS v4 Setup

**IMPORTANT:** Tailwind CSS v4 was installed (not v3). This has a different configuration approach:

- Config is CSS-based, not JS-based
- Uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities`
- Uses `@theme {}` block for custom colors/fonts
- Required `@tailwindcss/cli` package for the build command

**Custom theme defined in Styles/app.css:**
```css
@theme {
  --color-brand-teal: #2A9D8F;
  --color-brand-teal-dark: #1E7A6E;
  --color-brand-teal-light: #E8F5F2;
  --color-brand-teal-xlight: #F2FAF8;
  --color-brand-gold: #C8A951;
  --color-brand-gold-dark: #B89840;
  --color-brand-gold-light: #F5F0E0;
  --color-brand-cream: #FAF8F5;
  --color-brand-dark: #1D1D1D;
  --color-brand-muted: #6B6B6B;
  --color-brand-light-muted: #9A9A9A;
  --color-brand-border: #E8E5E0;
  --color-cat-skin: #C4918A;
  --color-cat-hormone: #8AAEC4;
  --color-cat-bio: #8AC4A8;
  --color-cat-weight: #C4B88A;
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "DM Sans", system-ui, sans-serif;
}
```

#### 0.5 - Build Verified
- `dotnet build` completes with 0 errors, 0 warnings
- `wwwroot/css/site.css` is generated (26KB)

---

## Phase 1 - COMPLETED ✅

### What Was Done

Built ALL visual components with hardcoded content. No database, no services, no backend logic. Pure Blazor + Tailwind rendering.

#### 1.1 - App.razor Updated
- Added Google Fonts (Cormorant Garamond + DM Sans)
- Linked Tailwind CSS (`css/site.css`)
- Set body classes: `font-body bg-brand-cream text-brand-dark`
- Removed Bootstrap

#### 1.2 - Layout Components
- **MainLayout.razor** - Contains NavBar, @Body, Footer, ChatWidget
- **NavBar.razor** - Sticky nav with desktop links and mobile hamburger menu

#### 1.3 - Shared Components Created (18 components)

| Component | Description |
|-----------|-------------|
| `SectionHeader.razor` | Reusable tag/heading/description with optional centering |
| `HeroSection.razor` | 2-column hero with headline, CTA buttons, location badges |
| `TreatmentCategoryCard.razor` | Category card with image, name, description, link |
| `TreatmentCard.razor` | Treatment details with price, duration, location badges |
| `TreatmentGroupSection.razor` | All 22 treatments organized in 4 groups |
| `ShopBanner.razor` | CTA banner linking to /shop |
| `LocationCard.razor` | Location details with hours and booking CTA |
| `AboutSection.razor` | 2-column about with stats grid |
| `StatCard.razor` | Single stat display (number + label) |
| `TeamSection.razor` | All 14 staff grouped by location |
| `TeamCard.razor` | Team member card with photo placeholder |
| `BookingWizard.razor` | 3-step booking flow UI |
| `ReviewCard.razor` | Testimonial card with stars, quote, author |
| `BlogCard.razor` | Blog post preview card |
| `FaqSection.razor` | All 20 FAQ items organized by category |
| `FaqItem.razor` | Accordion FAQ with toggle |
| `NewsletterSection.razor` | Email signup form |
| `ContactSection.razor` | Contact form + direct contact cards |
| `Footer.razor` | 4-column footer with links |
| `ChatWidget.razor` | Interactive AI chatbot (InteractiveServer) |
| `ShoppingCart.razor` | Placeholder for Phase 4 |

#### 1.4 - Pages Created

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home.razor | Single-page scroll with all sections |
| `/shop` | ShopIndex.razor | Shop placeholder with product grid |
| `/shop/{Slug}` | ProductDetail.razor | Product detail placeholder |
| `/login` | Login.razor | Login form placeholder |
| `/register` | Register.razor | Registration form placeholder |
| `/admin` | AdminDashboard.razor | Admin dashboard placeholder |
| `/client-portal` | PortalOverview.razor | Client portal placeholder |

#### 1.5 - AI Chatbot Features (Hardcoded)
- Toggle open/close with notification badge
- Welcome message with quick action buttons
- Quick actions: Recommend treatment, Book, Pricing, Locations
- Keyword-based intent matching for responses
- Styled chat bubbles for bot/user messages

#### 1.6 - Treatments Data (All 22 hardcoded)

**Skin Rejuvenation (8):** Botox/Dysport, Cosmetic Filler, UltraFacial, Laser/IPL, Perfect Derma Peel, Microneedling, Belkyra, Dermaplaning

**Hormone Balancing (3):** Bioidentical HRT, Testosterone Optimization, Menopause Support

**Biohacking (8):** PBM/Red Light, IV Therapy, HBOT, Neurointegrator, Brain Tap, Infrared Sauna, NuCalm, PEMF
- Location availability badges showing V/L/K availability

**Healthy Weight (3):** Medical Weight Program, Metabolic Testing, Body Composition

#### 1.7 - Team Data (All 14 staff)
- Langley: 5 staff
- Victoria: 6 staff
- Kelowna: 7 staff (some shared with other locations)

#### 1.8 - FAQ Data (All 20 questions)
- Biohacking: 10 questions
- Healthy Weight: 3 questions
- Hormone Therapy: 3 questions
- Skin Rejuvenation: 4 questions

#### 1.9 - Build Verified
- `dotnet build` completes with 0 errors
- `wwwroot/css/site.css` generated (44KB with all component styles)

### File Structure Created

```
src/AgelessLiving.Web/Components/
├── App.razor                    ✅ Updated
├── Routes.razor                 (unchanged)
├── _Imports.razor               ✅ Added Shared namespace
│
├── Layout/
│   └── MainLayout.razor         ✅ Created
│
├── Pages/
│   ├── Home.razor               ✅ Created
│   ├── Error.razor              (unchanged)
│   ├── NotFound.razor           (unchanged)
│   ├── Shop/
│   │   ├── ShopIndex.razor      ✅ Created
│   │   └── ProductDetail.razor  ✅ Created
│   ├── Auth/
│   │   ├── Login.razor          ✅ Created
│   │   └── Register.razor       ✅ Created
│   ├── Admin/
│   │   └── AdminDashboard.razor ✅ Created
│   └── Portal/
│       └── PortalOverview.razor ✅ Created
│
└── Shared/
    ├── NavBar.razor             ✅ Created
    ├── Footer.razor             ✅ Created
    ├── SectionHeader.razor      ✅ Created
    ├── HeroSection.razor        ✅ Created
    ├── TreatmentCategoryCard.razor ✅ Created
    ├── TreatmentGroupSection.razor ✅ Created
    ├── TreatmentCard.razor      ✅ Created
    ├── ShopBanner.razor         ✅ Created
    ├── LocationCard.razor       ✅ Created
    ├── AboutSection.razor       ✅ Created
    ├── StatCard.razor           ✅ Created
    ├── TeamSection.razor        ✅ Created
    ├── TeamCard.razor           ✅ Created
    ├── BookingWizard.razor      ✅ Created
    ├── ReviewCard.razor         ✅ Created
    ├── BlogCard.razor           ✅ Created
    ├── FaqSection.razor         ✅ Created
    ├── FaqItem.razor            ✅ Created
    ├── NewsletterSection.razor  ✅ Created
    ├── ContactSection.razor     ✅ Created
    ├── ChatWidget.razor         ✅ Created (InteractiveServer)
    └── ShoppingCart.razor       ✅ Created (placeholder)
```

---

## How to Run the App

From the solution root (`c:\Users\ejsaant\Ageless\Ageless\AgelessLiving`):

```bash
dotnet run --project src/AgelessLiving.Web
```

**URLs:**
- http://localhost:5000
- https://localhost:5001 (may show certificate warning)
- Or per launchSettings.json: http://localhost:5050, https://localhost:7296

**Available Routes:**
- `/` - Homepage with all sections
- `/shop` - Shop placeholder
- `/shop/{slug}` - Product detail placeholder
- `/login` - Login placeholder
- `/register` - Registration placeholder
- `/admin` - Admin dashboard placeholder
- `/client-portal` - Client portal placeholder

---

## Known Issues / Quirks

1. **npx doesn't work** on this Windows system - use direct path to node_modules/.bin instead
2. **Tailwind v4 was installed** instead of v3 - configuration is CSS-based, not JS-based
3. **Developer certificate not trusted** - https URLs will show browser warning (normal for dev)

---

## Next Step: Phase 2 - Database & Domain Models

Phase 2 creates all entities in AgelessLiving.Core, the DbContext in Infrastructure, runs migrations, and seeds data.

### Entities to Create
- Location, Provider, Treatment, LocationTreatment, ProviderTreatment
- Product, Order, OrderItem
- BlogPost, BookingEvent, ClientProfile, ContactSubmission, Review, CampaignMessage
- Enums: OrderStatus, BookingSource, BookingStatus, CampaignType, CampaignChannel, MessageStatus

### Seed Data
- All 3 locations with real addresses/phone/email
- All 22 treatments
- All 14 providers
- All location-treatment assignments
- All provider-treatment assignments

### End State
- `dotnet ef database update` creates all tables
- `SELECT * FROM Locations` returns 3 rows
- `SELECT * FROM Treatments` returns 22 rows

---

## Subsequent Phases (Summary)

- **Phase 2:** Database & Domain Models (EF Core entities, migrations, seed data)
- **Phase 3:** Wire UI to Database (replace hardcoded content with DB data)
- **Phase 4:** Integrations (Jane App booking, Square shop, Canada Post shipping)
- **Phase 5:** Admin Dashboard & Client Portal (12 admin pages, 4 portal pages, auth)
- **Phase 6:** AI/ML & Marketing Automation (ONNX chatbot, ML.NET recommender, email campaigns)
- **Phase 7:** SEO, QA & Deployment (JSON-LD, sitemap, IIS deployment)

---

## Commands Reference

```bash
# Build solution
cd c:\Users\ejsaant\Ageless\Ageless\AgelessLiving
dotnet build

# Run web app
dotnet run --project src/AgelessLiving.Web

# Build Tailwind manually (from Web project dir)
cd src/AgelessLiving.Web
node_modules\.bin\tailwindcss.cmd -i ./Styles/app.css -o ./wwwroot/css/site.css --minify
```

---

*Last updated: Phase 1 completed successfully*
