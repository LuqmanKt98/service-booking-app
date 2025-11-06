# 🎨 Visual Guide - Service Booking Wizard

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    BOOKING WIZARD FLOW                       │
└─────────────────────────────────────────────────────────────┘

                          START
                            │
                            ▼
                    ┌──────────────┐
                    │   STEP 1     │
                    │   BRANCHES   │
                    └──────────────┘
                            │
                    (Auto-skip if 1)
                            │
                            ▼
                    ┌──────────────┐
                    │   STEP 2     │
                    │  SERVICES    │
                    └──────────────┘
                            │
                    (Filter by branch)
                            │
                            ▼
                    ┌──────────────┐
                    │   STEP 3     │
                    │    STAFF     │
                    └──────────────┘
                            │
                    (Filter by service)
                            │
                            ▼
                    ┌──────────────┐
                    │   STEP 4     │
                    │ DATE & TIME  │
                    └──────────────┘
                            │
                    (Generate slots)
                            │
                            ▼
                        COMPLETE
                            │
                    (Save to Firebase)
                            │
                            ▼
                      CONFIRMATION
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BookingWizard.tsx                         │
│                   (Main Orchestrator)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ProgressBar Component                   │   │
│  │         Shows: Step 1 of 4 (25% complete)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Step Component (Dynamic)                     │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Step1BranchSelection / Step2Service... etc     │  │   │
│  │  │                                                │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │  │   │
│  │  │  │  Card    │  │  Card    │  │  Card    │    │  │   │
│  │  │  │ Branch 1 │  │ Branch 2 │  │ Branch 3 │    │  │   │
│  │  │  └──────────┘  └──────────┘  └──────────┘    │  │   │
│  │  │                                                │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Navigation Buttons                            │  │   │
│  │  │  [Back] [Continue to Services]                │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    FIRESTORE DATABASE                         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  BRANCHES    │  │  SERVICES    │  │    STAFF     │        │
│  │              │  │              │  │              │        │
│  │ • id         │  │ • id         │  │ • id         │        │
│  │ • name       │  │ • name       │  │ • name       │        │
│  │ • address    │  │ • duration   │  │ • email      │        │
│  │ • status     │  │ • price      │  │ • services[] │        │
│  │ • phone      │  │ • branches[] │  │ • workingHrs │        │
│  │              │  │ • staffIds[] │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│         ▲                  ▲                  ▲               │
│         │                  │                  │               │
└─────────┼──────────────────┼──────────────────┼───────────────┘
          │                  │                  │
          │                  │                  │
    ┌─────┴──────────────────┴──────────────────┴─────┐
    │                                                   │
    │         useBookingData.ts (Custom Hooks)        │
    │                                                   │
    │  • useBranches()                                │
    │  • useServices(branchId)                        │
    │  • useStaff(serviceId)                          │
    │                                                   │
    └─────┬──────────────────┬──────────────────┬─────┘
          │                  │                  │
          │                  │                  │
    ┌─────┴──────────────────┴──────────────────┴─────┐
    │                                                   │
    │         Step Components (Consumers)             │
    │                                                   │
    │  • Step1BranchSelection                         │
    │  • Step2ServiceSelection                        │
    │  • Step3StaffSelection                          │
    │  • Step4DateTimeSelection                       │
    │                                                   │
    └───────────────────────────────────────────────────┘
```

## UI Layout - Desktop View

```
┌─────────────────────────────────────────────────────────────┐
│                    BOOKING WIZARD                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Progress: ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│            Step 1 of 4 (25%)                                 │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SELECT YOUR BRANCH                                 │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐                │   │
│  │  │ ◉ Downtown   │  │ ○ Uptown     │                │   │
│  │  │ 123 Main St  │  │ 456 Park Ave │                │   │
│  │  │ (555)123-456 │  │ (555)234-567 │                │   │
│  │  └──────────────┘  └──────────────┘                │   │
│  │                                                      │   │
│  │  ┌──────────────┐                                   │   │
│  │  │ ○ Brooklyn   │                                   │   │
│  │  │ 789 Atlantic │                                   │   │
│  │  │ (555)345-678 │                                   │   │
│  │  └──────────────┘                                   │   │
│  │                                                      │   │
│  │  [Back]  [Continue to Services →]                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## UI Layout - Date & Time Selection

```
┌─────────────────────────────────────────────────────────────┐
│                    BOOKING WIZARD                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Progress: ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│            Step 4 of 4 (100%)                                │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SELECT DATE & TIME                                 │   │
│  │                                                      │   │
│  │  ┌──────────────────┐  ┌──────────────────────────┐ │   │
│  │  │  DATES           │  │  TIMES                   │ │   │
│  │  │                  │  │                          │ │   │
│  │  │ Today            │  │ 09:00 AM                 │ │   │
│  │  │ Tomorrow         │  │ 09:15 AM                 │ │   │
│  │  │ ◉ Oct 31         │  │ 09:30 AM                 │ │   │
│  │  │ Nov 1            │  │ ◉ 10:00 AM               │ │   │
│  │  │ Nov 2            │  │ 10:15 AM                 │ │   │
│  │  │ ...              │  │ 10:30 AM                 │ │   │
│  │  │                  │  │ ...                      │ │   │
│  │  └──────────────────┘  └──────────────────────────┘ │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  BOOKING SUMMARY                            │   │   │
│  │  │  Branch: Downtown                           │   │   │
│  │  │  Service: Haircut (30 min) - $45            │   │   │
│  │  │  Staff: John Doe                            │   │   │
│  │  │  Date: Oct 31, 2025                         │   │   │
│  │  │  Time: 10:00 AM                             │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │  [Back]  [Complete Booking →]                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Animation Flow

```
Step Transition Animation:
┌─────────────┐
│  Current    │  (Fade Out)
│   Step      │  ─────────→  (Slide Out)
└─────────────┘

                    ↓ (Delay 200ms)

┌─────────────┐
│   Next      │  (Slide In)
│   Step      │  ←─────────  (Fade In)
└─────────────┘

Duration: 300ms (smooth, not jarring)
Easing: ease-in-out
```

## Responsive Breakpoints

```
Mobile (< 640px)
┌─────────────────────┐
│  BOOKING WIZARD     │
├─────────────────────┤
│ Progress Bar        │
├─────────────────────┤
│ Single Column       │
│ Full Width Cards    │
│ Stacked Layout      │
├─────────────────────┤
│ Navigation Buttons  │
└─────────────────────┘

Tablet (640px - 1024px)
┌──────────────────────────────────┐
│      BOOKING WIZARD              │
├──────────────────────────────────┤
│ Progress Bar                     │
├──────────────────────────────────┤
│ Two Column Layout                │
│ ┌──────────────┐ ┌────────────┐ │
│ │   Content    │ │  Sidebar   │ │
│ └──────────────┘ └────────────┘ │
├──────────────────────────────────┤
│ Navigation Buttons               │
└──────────────────────────────────┘

Desktop (> 1024px)
┌────────────────────────────────────────────┐
│           BOOKING WIZARD                   │
├────────────────────────────────────────────┤
│ Progress Bar                               │
├────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │   Main Content   │ │  Booking Summary │ │
│ │   (3 columns)    │ │   (Sidebar)      │ │
│ └──────────────────┘ └──────────────────┘ │
├────────────────────────────────────────────┤
│ Navigation Buttons                         │
└────────────────────────────────────────────┘
```

## Color Scheme (Light Mode)

```
Primary Colors:
  • Background: #FFFFFF (White)
  • Text: #171717 (Dark Gray)
  • Accent: #3B82F6 (Blue)

Secondary Colors:
  • Border: #E5E7EB (Light Gray)
  • Hover: #F3F4F6 (Very Light Gray)
  • Success: #10B981 (Green)
  • Error: #EF4444 (Red)

Gradients:
  • Progress Bar: Blue to Cyan
  • Buttons: Subtle shadows
```

## File Organization

```
service-booking-app/
│
├── 📄 Documentation (9 files)
│   ├── INDEX.md
│   ├── README.md
│   ├── QUICK_START.md
│   ├── SETUP_GUIDE.md
│   ├── FIREBASE_SETUP_CHECKLIST.md
│   ├── IMPLEMENTATION_NOTES.md
│   ├── PROJECT_COMPLETION_SUMMARY.md
│   ├── FIRESTORE_RULES.txt
│   └── SAMPLE_DATA.json
│
├── 📦 Application
│   └── app/
│       ├── components/
│       │   ├── booking/ (5 files)
│       │   └── ui/ (4 files)
│       ├── hooks/ (1 file)
│       ├── lib/ (1 file)
│       ├── types/ (1 file)
│       ├── utils/ (1 file)
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
│
└── ⚙️ Configuration (5 files)
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    └── postcss.config.mjs
```

---

**This visual guide helps you understand the structure and flow of the Service Booking Wizard!**

