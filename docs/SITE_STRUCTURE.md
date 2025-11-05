# Next Gen Med Prep - Site Structure Diagram

```
nextgenmedprep.com
│
├── 🏠 Home (/)
│   Priority: 1.0 | Weekly
│
├── ℹ️ About (/about)
│   Priority: 0.8 | Monthly
│   └── 👥 Join The Team (/about/join-the-team)
│       Priority: 0.6 | Monthly
│
├── 🚀 Get Started (/get-started)
│   Priority: 0.9 | Weekly
│
├── 🧠 Prometheus Question Bank (/prometheus)
│   Priority: 0.9 | Weekly
│   └── 🛰️ Prometheus Satellite (/prometheus-2)
│       Priority: 0.9 | Weekly
│
├── 💬 Interview Preparation (/interviews)
│   Priority: 0.8 | Weekly
│   ├── 👥 MMI Practice (/interviews/mmis)
│   │   Priority: 0.7 | Weekly
│   ├── 👨‍⚖️ Panel Interviews (/interviews/panel-interviews)
│   │   Priority: 0.7 | Weekly
│   └── 💳 Payment (/interviews/payment)
│       Priority: 0.5 | Monthly
│
├── 📝 Personal Statements (/personal-statements)
│   Priority: 0.8 | Weekly
│   └── 💳 Payment (/personal-statements/payment)
│       Priority: 0.5 | Monthly
│
├── 🔬 UCAT Preparation (/ucat)
│   Priority: 0.8 | Weekly
│   └── 💳 Payment (/ucat/payment)
│       Priority: 0.5 | Monthly
│
├── 📅 Events (/events)
│   Priority: 0.7 | Weekly
│   ├── 💳 Event Booking (/event-pay)
│   │   Priority: 0.5 | Monthly
│   └── 💳 Career Consultation (/career-consultation-pay)
│       Priority: 0.5 | Monthly
│
├── 📚 Resources & Guides (/resources)
│   Priority: 0.7 | Monthly
│   ├── 🩺 Medicine Application Guide
│   │   (/resources/ultimate-medicine-application-guide)
│   │   Priority: 0.7 | Monthly
│   ├── 🦷 Dentistry Application Guide
│   │   (/resources/ultimate-dentistry-application-guide)
│   │   Priority: 0.7 | Monthly
│   ├── ⚖️ Ethics Guide
│   │   (/resources/ultimate-ethics-guide)
│   │   Priority: 0.7 | Monthly
│   ├── 📰 Medical Hot Topics
│   │   (/resources/ultimate-medical-hot-topics)
│   │   Priority: 0.7 | Weekly
│   ├── 🔬 UCAT Prep Guide
│   │   (/resources/ultimate-ucat-prep-guide)
│   │   Priority: 0.7 | Monthly
│   ├── 💬 MMI Resources
│   │   (/resources/mmi)
│   │   Priority: 0.6 | Monthly
│   └── 👨‍⚖️ Panel Interview Resources
│       (/resources/panel-interviews)
│       Priority: 0.6 | Monthly
│
├── 🗺️ Site Map (/sitemap)
│   [Visual, Interactive Sitemap]
│
├── 📄 XML Sitemap (/sitemap.xml)
│   [SEO - For Search Engines]
│
└── 🤖 Robots.txt (/robots.txt)
    [Crawler Instructions]
```

## Page Count Summary

| Category | Pages | Priority Range |
|----------|-------|----------------|
| **Main Navigation** | 3 | 0.8 - 1.0 |
| **Core Services** | 8 | 0.7 - 0.9 |
| **Events & Bookings** | 3 | 0.5 - 0.7 |
| **Resources & Guides** | 7 | 0.6 - 0.7 |
| **Utility Pages** | 2 | - |
| **Total** | **23** | - |

## Update Frequency Distribution

| Frequency | Page Count | Examples |
|-----------|------------|----------|
| **Weekly** | 10 | Prometheus, Interviews, Hot Topics |
| **Monthly** | 13 | Guides, Resources, Payment pages |

## Traffic Priority Groups

### 🔴 Critical (Priority 1.0)
- Homepage

### 🟠 High (Priority 0.9)
- Get Started
- Prometheus (both versions)

### 🟡 Medium (Priority 0.7-0.8)
- Core Services (Interviews, UCAT, Personal Statements)
- All Resource Guides

### 🟢 Standard (Priority 0.5-0.6)
- Payment/Checkout pages
- Sub-resources
- Join Team page

## User Journey Map

```
Entry Points → Core Services → Supporting Resources → Conversion
    ↓              ↓                   ↓                    ↓
  Home        Interviews         Resources           Payment
Get Started   Prometheus     Ethics Guide         Event Booking
  About          UCAT        Hot Topics          Consultation
                             MMI Resources
```

## SEO Optimization Strategy

### Primary Keywords
- Medical school interview preparation
- UCAT preparation
- Medical school personal statements
- MMI practice questions

### Content Depth by Section
1. **Prometheus**: 3500+ questions (Deepest)
2. **Resources**: 7 comprehensive guides (Deep)
3. **Services**: 4 main offerings (Medium)
4. **Events**: Dynamic content (Variable)

## Mobile Navigation Flow

```
Mobile Menu
├── Home
├── Get Started 📱
├── Services ▼
│   ├── Prometheus
│   ├── Interviews
│   ├── Personal Statements
│   └── UCAT
├── Resources ▼
│   ├── Guides
│   └── Practice Materials
├── Events
├── About
└── Site Map 🗺️
```

## Search Engine Visibility

**Indexed Pages**: 23 main pages
**Priority Distribution**:
- 1× Priority 1.0 (Home)
- 3× Priority 0.9 (Key services)
- 4× Priority 0.8 (Main categories)
- 8× Priority 0.7 (Resources)
- 3× Priority 0.6 (Support pages)
- 4× Priority 0.5 (Checkout)

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Sitemap**: XML + HTML
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **SEO**: Built-in Next.js optimization
