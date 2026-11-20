import { useEffect, useRef, useState } from "react"

type Screenshot = { src: string; alt: string; label: string }

function assetUrl(path: string) {
  const assetPath = path.replace(/^\/+/, "")
  if (import.meta.env.PROD) {
    return `https://raw.githubusercontent.com/ikhlasmohammed/mohammed-ikhlas-portfolio/gh-pages/${assetPath}`
  }
  return `${import.meta.env.BASE_URL}${assetPath}`
}

type Project = {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  description: string
  tools: string[]
  problem: string
  built: string
  result: string
  caseStudy: string
  subject: string
  role: string
  preview: Screenshot
  externalLink?: string
  externalLabel?: string
  screenshots?: Screenshot[]
}

const projects: Project[] = [
  {
    id: "01",
    slug: "calory",
    title: "Calory.AI",
    category: "Computer vision",
    summary: "I built a cloud-based meal tracker around food image recognition.",
    description:
      "I built the AWS workflow behind a meal photo classifier, calorie tracker and daily-goal system.",
    tools: ["AWS", "Rekognition", "Lambda", "Cognito", "RDS", "DynamoDB", "API Gateway", "SNS", "CloudFront", "S3"],
    problem:
      "I wanted to reduce the effort of logging meals, but the app still needed to keep each user’s goal and meal history consistent.",
    built:
      "I connected S3, CloudFront, Cognito, API Gateway, Lambda, Rekognition Custom Labels, RDS, DynamoDB and SNS into one workflow.",
    result:
      "I fixed the goal-persistence and Singapore-time bugs, and built a working flow from signup to food recognition, meal logging and goal notifications.",
    caseStudy:
      "I built Calory.AI for my Cloud Technologies for AI module. The main flow starts when a user uploads a meal photo. Rekognition Custom Labels identifies whether it is pizza, a burger or crispy chicken, RDS provides the calorie and macro information, and Lambda saves the meal through API Gateway.\n\nI used Cognito for signup, email verification and login, S3 and CloudFront for the frontend, DynamoDB for daily goal status, and SNS to notify a user when the goal is reached.\n\nThe difficult part was not just connecting the services; it was tracing bugs across them. The calorie goal collected during signup was silently dropped because it was never sent to the backend, while login replaced it with a hardcoded value. I fixed this by adding a Cognito custom attribute and changing both signup and login to persist and return it.\n\nI also corrected date calculations because Lambda runs in UTC and was producing the wrong 'today' total near midnight in Singapore. API Gateway changes also needed a manual stage redeploy and an explicit Lambda permission for apigateway.amazonaws.com. I used curl to separate backend problems from browser CORS errors.\n\nFinally, I learned to start Rekognition Custom Labels only when testing and stop it immediately afterwards because it bills hourly.",
    subject: "Cloud Technologies for AI",
    role: "Cloud application developer",
    preview: {
      src: "/images/calory/analysis.png",
      alt: "Calory.AI meal analysis screen",
      label: "Meal analysis",
    },
    externalLink: "https://youtu.be/g3XfARyloAE",
    externalLabel: "Watch demo",
    screenshots: [
      {
        src: "/images/calory/home.png",
        alt: "Calory.AI home dashboard",
        label: "Dashboard",
      },
      {
        src: "/images/calory/dashboard.png",
        alt: "Calory.AI dashboard showing daily nutrition summary",
        label: "Daily overview",
      },
      {
        src: "/images/calory/profile.png",
        alt: "Calory.AI profile and login screen",
        label: "Account",
      },
      {
        src: "/images/calory/snap-meal.png",
        alt: "Calory.AI Snap Your Meal upload screen",
        label: "Snap a meal",
      },
      {
        src: "/images/calory/analysis.png",
        alt: "Calory.AI meal analysis results",
        label: "Analysis results",
      },
      {
        src: "/images/calory/diary.png",
        alt: "Calory.AI food diary showing logged meals",
        label: "Food diary",
      },
    ],
  },
  {
    id: "02",
    slug: "valu",
    title: "Valu.AI",
    category: "Machine learning",
    summary: "I built an HDB resale estimator and tested which model actually worked best.",
    description:
      "A machine learning project where I handled the data, model comparison and Streamlit app myself.",
    tools: ["Python", "scikit-learn", "Pandas", "Random Forest"],
    problem:
      "HDB prices depend on several connected factors, and a model can look accurate while still being inconsistent when it is used inside an app.",
    built:
      "I filtered 2025-2026 data, sampled 5,000 rows by town, engineered features, compared three models and reproduced the preprocessing in Streamlit.",
    result:
      "Log-transformed Linear Regression reached an R-squared of 0.908 and an RMSE of $59,812, so I chose it over the more complex alternatives.",
    caseStudy:
      "I built Valu.AI from start to finish for my Machine Learning for Developers module. I filtered the HDB resale data to 2025 and 2026, kept 3-, 4- and 5-room flats, and took a stratified sample of 5,000 rows by town. I removed block and street name because their high number of unique values did not give the model useful general patterns.\n\nI converted the remaining lease to months, encoded storey as an ordered number, and split the data before encoding so the test set stayed clean. The biggest improvement came from log-transforming price: RMSE fell from $70,402 to $59,812.\n\nI compared Linear Regression, a Random Forest tuned with RandomizedSearchCV, and Gradient Boosting. Linear Regression on log price won with an R-squared of 0.908. I chose it even though Random Forest had a slightly better MAE because RMSE penalises large mistakes more heavily and the simpler model was easier to deploy.\n\nIn the Streamlit app, I built the input form, prediction display, market-context chart and comparable-sales list. I found a bug where pd.get_dummies on one row produced all-zero columns when drop_first=True, so I set the app columns explicitly. I also had to keep the lease-date calculation and log1p/expm1 steps identical between the notebook and app.\n\nThe main lesson was that a good notebook result is not enough; the deployed preprocessing must match exactly.",
    subject: "Machine Learning for Developers",
    role: "Machine learning developer",
    preview: {
      src: "/images/valu/estimate.png",
      alt: "Valu.AI estimated resale price screen",
      label: "Price estimate",
    },
    externalLink:
      "https://hdb-resale-price-predictor-ff6xhp8c2v6xa6xgf2qxtv.streamlit.app",
    externalLabel: "Live demo",
    screenshots: [
      {
        src: "/images/valu/estimator.png",
        alt: "Valu.AI HDB resale estimator form",
        label: "Property inputs",
      },
      {
        src: "/images/valu/estimate.png",
        alt: "Valu.AI estimated resale price and market context",
        label: "Price estimate",
      },
      {
        src: "/images/valu/comparables.png",
        alt: "Valu.AI comparable resale transactions and estimate explanation",
        label: "Market comparables",
      },
    ],
  },
  {
    id: "03",
    slug: "audit",
    title: "AuditXpress",
    category: "Process automation",
    summary: "I built an unattended expense-auditing workflow with clear records.",
    description:
      "An end-to-end UiPath robot that extracts claims, applies policy rules and separates approved and rejected outcomes.",
    tools: ["UiPath", "OCR", "Regex", "Python", "Outlook", "Excel"],
    problem:
      "Expense claims arrived in different formats, so the robot had to extract reliable values before it could apply any policy.",
    built:
      "I routed native PDFs and receipt images through different extraction paths, validated the fields in Python, and wrote the results to Outlook and Excel.",
    result:
      "The robot can complete an unattended run, reject invalid claims with a dynamic email, and keep both a payment batch and master audit log.",
    caseStudy:
      "I implemented the entire AuditXpress architecture, from email ingestion to the final Excel reports, for my Robotic Process Automation module. Because claims arrived as both PDFs and physical receipt images, I created a dual-path workflow: native PDFs went through a text reader, while images went through AI-powered OCR.\n\nOCR output was inconsistent, so I spent time tuning Regex patterns for the transaction date, amount and merchant. I kept the policy logic in audit_logic.py instead of putting every rule inside UiPath, then converted UiPath strings into floats and datetime values before calling evaluate_claim.\n\nOffice 365 authentication caused problems for unattended execution, so I switched to classic email activities to avoid manual login interruptions. I also used nested Try-Catch blocks so one invalid claim could trigger a rejection email and update the Master Audit Log without stopping the Payment Batch process.\n\nUiPath Orchestrator then ran the workflow unattended and confirmed the completed job.",
    subject: "Robotic Process Automation",
    role: "Automation developer",
    preview: {
      src: "/images/audit/python-evaluation.png",
      alt: "AuditXpress policy evaluation workflow",
      label: "Policy evaluation",
    },
    externalLink: "https://www.youtube.com/watch?v=rDhw6yME-uc&feature=youtu.be",
    externalLabel: "Watch demo",
    screenshots: [
      {
        src: "/images/audit/pdf-extraction.png",
        alt: "AuditXpress UiPath PDF extraction workflow",
        label: "PDF extraction",
      },
      {
        src: "/images/audit/ocr-extraction.png",
        alt: "AuditXpress OCR extraction workflow for image receipts",
        label: "OCR fallback",
      },
      {
        src: "/images/audit/python-evaluation.png",
        alt: "AuditXpress Python evaluation workflow",
        label: "Policy evaluation",
      },
      {
        src: "/images/audit/rejection-email.png",
        alt: "AuditXpress automated rejection email configuration",
        label: "Outcome notification",
      },
      {
        src: "/images/audit/audit-log.png",
        alt: "AuditXpress master audit log Excel workflow",
        label: "Master audit log",
      },
      {
        src: "/images/audit/payment-batch.png",
        alt: "AuditXpress payment batch Excel workflow",
        label: "Payment batch",
      },
      {
        src: "/images/audit/orchestrator.png",
        alt: "AuditXpress process successfully completed in UiPath Orchestrator",
        label: "Orchestrator run",
      },
    ],
  },
  {
    id: "04",
    slug: "overload",
    title: "Overload.AI",
    category: "Mobile product",
    summary: "I built a Flutter fitness app with deterministic training advice.",
    description:
      "A Flutter app where I built workout logging, progress analysis, recommendations, authentication and navigation.",
    tools: ["Flutter", "Dart", "Firebase", "Riverpod", "Groq API", "NETS QR"],
    problem:
      "The app needed to feel personalised without allowing an unreliable AI response to decide the actual workout numbers.",
    built:
      "I separated Flutter UI from business logic with Riverpod, added Firebase services, and calculated progressive overload in Dart before requesting AI explanations.",
    result:
      "The app continues to give mathematically valid recommendations when Groq is slow, rate-limited or unavailable.",
    caseStudy:
      "I worked on Overload.AI for my Mobile App Development module. I built the main Flutter experience, including onboarding, authentication, navigation, workout sessions, set logging, rest timers, charts, progress analysis and recommendations.\n\nRiverpod keeps workout logs in providers so adding, editing or deleting a set refreshes the relevant screens without manually passing data around. I put Firestore operations in service classes such as WorkoutLogService instead of placing them directly in screens, which made it easier to support real-time streams, filtered queries, sorting and aggregate queries.\n\nThe main technical challenge was the progressive-overload system. Dart calculates estimated one-rep max values and decides whether to add weight or one repetition based on the user’s recent best set. Groq only explains those results in natural language; it never decides the numbers.\n\nI also batched exercises into one request to reduce API calls and added a fallback when the service fails. For realistic recommendations, I select the best set from the latest training day rather than blindly using the last set, since later sets may be lower because of fatigue.",
    subject: "Mobile App Development",
    role: "Mobile application developer",
    preview: {
      src: "/images/overload/home.png",
      alt: "Overload.AI mobile training dashboard",
      label: "Training dashboard",
    },
    externalLink: "https://youtu.be/6-4HeU2RPnE",
    externalLabel: "Watch demo",
    screenshots: [
      {
        src: "/images/overload/login.png",
        alt: "Overload.AI login screen",
        label: "Welcome",
      },
      {
        src: "/images/overload/verification-email.png",
        alt: "Overload.AI email verification screen",
        label: "Email verification",
      },
      {
        src: "/images/overload/onboarding.png",
        alt: "Overload.AI fitness onboarding form",
        label: "Personal setup",
      },
      {
        src: "/images/overload/home.png",
        alt: "Overload.AI home dashboard with workout and progress summary",
        label: "Training dashboard",
      },
      {
        src: "/images/overload/workout-session.png",
        alt: "Overload.AI push day workout session with logged sets",
        label: "Workout session",
      },
      {
        src: "/images/overload/exercise-picker.png",
        alt: "Overload.AI exercise picker",
        label: "Exercise picker",
      },
      {
        src: "/images/overload/calendar.png",
        alt: "Overload.AI workout calendar",
        label: "Workout calendar",
      },
      {
        src: "/images/overload/ai-analysis.png",
        alt: "Overload.AI coaching analysis dashboard",
        label: "AI analysis",
      },
      {
        src: "/images/overload/ai-recommendations.png",
        alt: "Overload.AI recommended next-session exercises",
        label: "AI recommendations",
      },
    ],
  },
  {
    id: "05",
    slug: "adoption",
    title: "Animal Adoption Portal",
    category: "Full-stack web application",
    summary: "I built a public adoption listing and a protected admin management portal.",
    description:
      "A full-stack portal for browsing animals, viewing adoption details and managing listings with authenticated administrator access.",
    tools: ["HTML", "CSS", "JavaScript", "Node.js", "REST APIs", "MySQL", "JWT", "bcryptjs"],
    problem:
      "The portal needed an easy public browsing experience while keeping animal listing changes restricted to authorised administrators.",
    built:
      "I built CRUD REST endpoints, SQL database queries, public and admin pages, JWT authentication and bcrypt password hashing.",
    result:
      "Users can browse and inspect available animals, while administrators can add, update and delete listings from a separate protected dashboard.",
    caseStudy:
      "I built the Animal Adoption Portal for my ADEV/DBAV module. The public website presents animal listings and opens a detail view with the species, breed, age, status and personality of each animal.\n\nI created a Node.js REST API backed by SQL and implemented create, retrieve, update and delete operations for animal records. The frontend uses HTML, CSS and JavaScript to call those endpoints and display the results.\n\nThe admin area includes a login flow, protected dashboard and listing management pages. I used JWT for authenticated requests and bcryptjs for password hashing. Database query failures and authentication or authorisation errors return clear HTTP responses without stopping the server.",
    subject: "Application / Database Development",
    role: "Full-stack application developer",
    preview: {
      src: "/images/adoption/home.png",
      alt: "Animal Adoption Portal public homepage",
      label: "Public homepage",
    },
    screenshots: [
      {
        src: "/images/adoption/home.png",
        alt: "Animal Adoption Portal public homepage with available animals",
        label: "Available animals",
      },
      {
        src: "/images/adoption/animal-detail.png",
        alt: "Animal Adoption Portal animal detail modal",
        label: "Animal details",
      },
      {
        src: "/images/adoption/login.png",
        alt: "Animal Adoption Portal administrator sign-in page",
        label: "Admin login",
      },
      {
        src: "/images/adoption/admin-dashboard.png",
        alt: "Animal Adoption Portal administrator dashboard",
        label: "Admin dashboard",
      },
      {
        src: "/images/adoption/admin-detail.png",
        alt: "Animal Adoption Portal administrator animal detail modal",
        label: "Admin detail view",
      },
      {
        src: "/images/adoption/update-listing.png",
        alt: "Animal Adoption Portal update listing form",
        label: "Update listing",
      },
    ],
  },
  {
    id: "06",
    slug: "dsag",
    title: "Data Structures and Algorithms",
    category: "Systems design",
    summary: "I designed queue simulations and an outlet layout using data structures.",
    description:
      "A Subway crowd-management assignment comparing Queue, dual-Queue and Linked List approaches, with revised outlet planning for CafeX.",
    tools: ["Python", "Queues", "Linked Lists", "Big-O Analysis", "Draw.io"],
    problem:
      "The assignment needed to model lunch-hour crowding at Subway while keeping the ordering counter and connected spaces easy to navigate.",
    built:
      "I simulated a 20-person queue, an alternating dual-queue system and a linked-list alternative, then designed a revised layout with a separate entry and exit.",
    result:
      "The diagrams and analysis compare linear-time processing, FIFO behaviour, dynamic capacity and the practical impact of queue design during peak periods.",
    caseStudy:
      "I completed the Data Structures and Algorithms assignment by modelling the crowd around the Subway outlet at Temasek Polytechnic. I selected the front entrance, rear entrance and back seating area as interconnected spaces.\n\nThe first diagram represents a 20-person queue extending from the Subway ordering counter across the connected areas. I then implemented the queue behaviour in Python, demonstrated full-queue and dequeue handling, and compared a single queue with an alternating dual-queue system.\n\nFor the revised design, I replaced fixed queue containers with a linked-list model and proposed CafeX with one entrance and one exit. The final layout separates entry and exit traffic, uses a linked list for ordering, and uses digital pre-orders to reduce crowding near Subway and Triplets.",
    subject: "Data Structures and Algorithms",
    role: "Algorithm and systems designer",
    preview: {
      src: "/images/dsag/cafex-layout.png",
      alt: "CafeX revised outlet layout diagram",
      label: "CafeX layout",
    },
    screenshots: [
      {
        src: "/images/dsag/queue-layout.png",
        alt: "Subway queue diagram across three interconnected spaces",
        label: "Queue layout",
      },
      {
        src: "/images/dsag/cafex-layout.png",
        alt: "Revised outlet layout showing CafeX, Subway and Triplets",
        label: "CafeX layout",
      },
    ],
  },
]

function Arrow({ direction = "up" }: { direction?: "up" | "left" }) {
  return direction === "left" ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M16 10H4m5-5-5 5 5 5" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="2" fill="#0A66C2" />
      <path fill="#fff" d="M6.7 9.5V18H4V9.5h2.7ZM5.35 8.25a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM18.8 13.1c0-2.55-1.36-3.95-3.27-3.95-1.5 0-2.17.82-2.55 1.4V9.5h-2.7V18H13v-4.2c0-1.1.2-2.17 1.45-2.17 1.24 0 1.26 1.25 1.26 2.24V18h2.7l.39-4.9Z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.3 20.5c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 2.2 3.2 1.6.1-.7.4-1.2.7-1.5-2.3-.3-4.7-1.1-4.7-5.1 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.8 0 4-2.4 4.8-4.7 5.1.4.3.7 1 .7 2V21c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  )
}

function Mark({ type }: { type: string }) {
  return (
    <div className={`project-mark mark-${type}`} aria-hidden="true">
      {type === "calory" && (
        <>
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <span className="scan" />
          <span className="target">94%</span>
        </>
      )}
      {type === "valu" && (
        <>
          <span className="value">$568K</span>
          <svg viewBox="0 0 240 120" preserveAspectRatio="none">
            <path d="m0 103 36-20 32 8 39-39 34 15 44-50 55 14" />
          </svg>
        </>
      )}
      {type === "audit" && (
        <div className="flow">
          <span>INBOX</span>
          <i />
          <span>OCR</span>
          <i />
          <span>PASS</span>
        </div>
      )}
      {type === "overload" && (
        <div className="rep">
          <span>SET 03</span>
          <strong>65</strong>
          <small>KG · 8 REPS</small>
        </div>
      )}
      {type === "adoption" && (
        <div className="adoption-mark">
          <span>ADOPT</span>
          <strong>FIND A HOME</strong>
        </div>
      )}
      {type === "dsag" && (
        <div className="dsag-mark">
          <span>QUEUE [20]</span>
          <strong>DSAG</strong>
        </div>
      )}
    </div>
  )
}

function Header({ detail = false }: { detail?: boolean }) {
  const [activeSection, setActiveSection] = useState("work")
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (detail) return
    const sections = ["goals", "education", "skills", "certifications", "work", "cca", "achievements", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.6] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [detail])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    const closeOnOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 961px)").matches) setMenuOpen(false)
    }

    document.addEventListener("keydown", closeOnEscape)
    document.addEventListener("pointerdown", closeOnOutside)
    window.addEventListener("resize", closeOnDesktop)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", closeOnEscape)
      document.removeEventListener("pointerdown", closeOnOutside)
      window.removeEventListener("resize", closeOnDesktop)
    }
  }, [menuOpen])

  const navigation = [
    ["goals", "Goals"],
    ["education", "Education"],
    ["skills", "Skills"],
    ["certifications", "Certifications"],
    ["work", "Projects"],
    ["cca", "Leadership & CCA"],
    ["achievements", "Achievements"],
    ["contact", "Contact"],
  ]

  return (
    <header className="site-header" ref={headerRef}>
      <a className="site-name" href={detail ? "/" : "#top"}>
        Mohammed Ikhlas
      </a>
      {!detail && (
        <>
          <nav className="desktop-navigation" aria-label="Primary navigation">
            {navigation.map(([id, label]) => (
              <a
                key={id}
                className={activeSection === id ? "is-active" : ""}
                href={`#${id}`}
              >
                <span className="nav-label">{label}</span>
                <span className="nav-dot" aria-hidden="true" />
              </a>
            ))}
          </nav>
          <button
            className="mobile-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
          <nav
            className={`mobile-navigation${menuOpen ? " is-open" : ""}`}
            id="mobile-navigation"
            aria-label="Mobile navigation"
            aria-hidden={!menuOpen}
          >
            {navigation.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                tabIndex={menuOpen ? undefined : -1}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  )
}

function ProjectDetail({
  project,
  close,
}: {
  project: Project
  close: () => void
}) {
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<Screenshot | null>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!selectedScreenshot) {
      trigger?.focus()
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedScreenshot(null)
      if (event.key === "Tab") {
        const focusable = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            ".screenshot-lightbox button",
          ),
        )
        const currentIndex = focusable.indexOf(
          document.activeElement as HTMLButtonElement,
        )
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + focusable.length) % focusable.length
          : (currentIndex + 1) % focusable.length
        event.preventDefault()
        focusable[nextIndex]?.focus()
      }
      if (!project.screenshots) return
      const currentIndex = project.screenshots.findIndex(
        (screenshot) => screenshot.src === selectedScreenshot.src,
      )
      if (event.key === "ArrowRight") {
        setSelectedScreenshot(
          project.screenshots[(currentIndex + 1) % project.screenshots.length],
        )
      }
      if (event.key === "ArrowLeft") {
        setSelectedScreenshot(
          project.screenshots[
            (currentIndex - 1 + project.screenshots.length) %
              project.screenshots.length
          ],
        )
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [project.screenshots, selectedScreenshot, trigger])

  return (
    <main className="detail-page">
      <Header detail />
      <section className="detail-hero">
        <button className="back-button" type="button" onClick={close}>
          <Arrow direction="left" /> All projects
        </button>
        <div className="detail-title">
          <div>
            <p className="eyebrow">
              {project.id} / {project.category}
            </p>
            <h1>{project.title}</h1>
          </div>
          <p>{project.description}</p>
        </div>
        <Mark type={project.slug} />
      </section>
      <section className="case-study">
        <div className="case-tools">
          <p className="eyebrow">Technology</p>
          <div>
            {project.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
        <div className="case-meta">
          <div>
            <span className="eyebrow">Course</span>
            <strong>{project.subject}</strong>
          </div>
          <div>
            <span className="eyebrow">Role</span>
            <strong>{project.role}</strong>
          </div>
          {project.externalLink && (
            <a href={project.externalLink} target="_blank" rel="noreferrer">
              {project.externalLabel} <Arrow />
            </a>
          )}
        </div>
        <div className="case-grid">
          {[
            ["The challenge", project.problem],
            ["The approach", project.built],
            ["The outcome", project.result],
          ].map(([label, text], index) => (
            <article key={label}>
              <span>0{index + 1}</span>
              <h2>{label}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <section className="case-story">
          <p className="eyebrow">The story</p>
          <div className="case-story-copy">
            {project.caseStudy.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
        {project.screenshots && (
          <section className="project-screens" aria-label={`${project.title} screens`}>
            <div className="project-screens-intro">
              <p className="eyebrow">Product screens</p>
              <p>
                {project.slug === "calory"
                  ? "From snapping a meal to reviewing a complete nutrition diary."
                  : project.slug === "valu"
                    ? "From property inputs to a transparent estimate backed by comparable sales."
                    : project.slug === "audit"
                      ? "From document extraction to policy evaluation, notifications and audit-ready records."
                      : "From onboarding and workout logging to calendar planning and AI coaching."}
              </p>
            </div>
            <div className={`project-screens-grid project-screens-grid-${project.slug}`}>
              {project.screenshots.map((screenshot) => (
                <figure key={screenshot.src}>
                  <button
                    className="screenshot-button"
                    type="button"
                    onClick={(event) => {
                      setTrigger(event.currentTarget)
                      setSelectedScreenshot(screenshot)
                    }}
                    aria-label={`View ${screenshot.label} screenshot`}
                  >
                    <img
                      src={assetUrl(screenshot.src)}
                      alt={screenshot.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <figcaption>{screenshot.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </section>
      {selectedScreenshot && (
        <div
          className="screenshot-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedScreenshot.label} enlarged screenshot`}
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="lightbox-nav lightbox-prev"
              type="button"
              onClick={() => {
                if (!project.screenshots) return
                const index = project.screenshots.findIndex(
                  (screenshot) => screenshot.src === selectedScreenshot.src,
                )
                setSelectedScreenshot(
                  project.screenshots[
                    (index - 1 + project.screenshots.length) %
                      project.screenshots.length
                  ],
                )
              }}
              aria-label="Previous screenshot"
            >
              <Arrow direction="left" />
            </button>
            <button
              className="lightbox-close"
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelectedScreenshot(null)}
              aria-label="Close enlarged screenshot"
            >
              ×
            </button>
            <img
              src={assetUrl(selectedScreenshot.src)}
              alt={selectedScreenshot.alt}
              decoding="async"
            />
            <div className="lightbox-caption">
              <p>{selectedScreenshot.label}</p>
              <span>
                {(project.screenshots?.findIndex(
                  (screenshot) => screenshot.src === selectedScreenshot.src,
                ) ?? 0) + 1}{" "}
                / {project.screenshots?.length}
              </span>
            </div>
            <button
              className="lightbox-nav lightbox-next"
              type="button"
              onClick={() => {
                if (!project.screenshots) return
                const index = project.screenshots.findIndex(
                  (screenshot) => screenshot.src === selectedScreenshot.src,
                )
                setSelectedScreenshot(
                  project.screenshots[(index + 1) % project.screenshots.length],
                )
              }}
              aria-label="Next screenshot"
            >
              <Arrow direction="left" />
            </button>
          </div>
        </div>
      )}
      <div className="next-project">
        <p className="eyebrow">Continue exploring</p>
        <button
          type="button"
          onClick={() => {
            const index = projects.findIndex(
              (item) => item.slug === project.slug,
            )
            openProject(projects[(index + 1) % projects.length].slug)
          }}
        >
          Next project <Arrow />
        </button>
      </div>
    </main>
  )
}

function openProject(slug: string) {
  window.location.hash = `project/${slug}`
  window.scrollTo({ top: 0, behavior: "instant" })
}

function App() {
  const getSelected = () => {
    const slug = window.location.hash.replace("#project/", "")
    return projects.find((project) => project.slug === slug) ?? null
  }
  const [selected, setSelected] = useState<Project | null>(getSelected)
  const projectRowRef = useRef<HTMLDivElement>(null)
  const [projectPosition, setProjectPosition] = useState(1)

  useEffect(() => {
    const onHashChange = () => setSelected(getSelected())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  if (selected) {
    return (
      <ProjectDetail
        project={selected}
        close={() => {
          window.location.hash = "work"
          window.scrollTo({ top: 0, behavior: "instant" })
        }}
      />
    )
  }

  return (
    <main>
      <Header />
      <section className="hero" id="top">
        <div className="hero-title-row">
          <div className="hero-copy">
            <h1>
              Building AI that feels <em>human.</em>
            </h1>
            <p className="hero-role">Applied AI Junior @ Temasek Polytechnic</p>
            <div className="hero-links">
              <a className="button primary" href="#contact">
                Get in touch <Arrow />
              </a>
            </div>
          </div>
          <img
            className="hero-portrait"
            src={assetUrl("/images/cv-pic.png")}
            alt="Mohammed Ikhlas"
          />
        </div>
      </section>

      <section className="goals-section cv-section" id="goals">
        <div className="cv-section-heading">
          <p className="eyebrow">02 / Professional goals</p>
          <h2>Growing into influence.</h2>
        </div>
        <div className="goals-grid">
          <p className="goals-lead">
            I aspire to become an AI/ML engineer who combines strong technical
            depth with the leadership needed to make meaningful decisions.
          </p>
          <div className="goals-list">
            <article>
              <span>01</span>
              <p>Learn advanced AI and machine learning skills through hands-on projects and industry certifications.</p>
            </article>
            <article>
              <span>02</span>
              <p>Build connections and become effective in high-pressure team environments where priorities change quickly.</p>
            </article>
            <article>
              <span>03</span>
              <p>Grow into an influential engineering leader who can guide teams, shape strategy and drive company decisions.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="education-section cv-section" id="education">
        <div className="cv-section-heading">
          <p className="eyebrow">03 / Education</p>
          <h2>Academic foundation.</h2>
        </div>
        <div className="education-list">
          <article>
            <span className="education-date">2025 – Present</span>
            <div>
              <h3>Diploma in Applied Artificial Intelligence</h3>
              <p>Temasek Polytechnic</p>
              <span>CGPA 3.78 / 4.00</span>
            </div>
          </article>
          <article>
            <span className="education-date">2021 – 2024</span>
            <div>
              <h3>GCE O-Level</h3>
              <p>Changkat Changi Secondary School</p>
              <span>L1R4 net score: 10</span>
            </div>
          </article>
        </div>
      </section>

      <section className="skills-section cv-section" id="skills">
        <div className="cv-section-heading">
          <p className="eyebrow">04 / Skills</p>
          <h2>Built for practical impact.</h2>
        </div>
        <div className="skills-grid">
          {[
            ["Languages", ["Python", "Dart", "SQL", "JavaScript", "HTML", "CSS", "Regex"]],
            ["Frameworks & Platforms", ["Flutter", "UiPath", "AWS Cloud", "Firebase", "scikit-learn", "Node.js", "TensorFlow", "PyTorch"]],
            ["Databases", ["MySQL", "Firebase", "DynamoDB"]],
            ["Practices", ["ML model development", "RPA workflow design", "Serverless AI apps", "Mobile app development", "UI/UX prototyping", "Version control"]],
            ["Data Analytics", ["Power BI", "KNIME", "Excel", "Jupyter Notebook"]],
            ["Tools", ["Git", "Figma", "Kaggle", "VS Code", "Cisco Packet Tracer", "draw.io", "Postman"]],
          ].map(([title, items]) => (
            <article className="skill-topic" key={title as string}>
              <h3>{title as string}</h3>
              <div className="skill-tags">
                {(items as string[]).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="certifications-section cv-section" id="certifications">
        <div className="cv-section-heading">
          <p className="eyebrow">05 / Certifications</p>
          <h2>Continuing development.</h2>
        </div>
        <ul className="certification-list">
          <li><span>Microsoft</span>Career Essentials in Generative AI</li>
          <li><span>NETS</span>QR Payment Gateway Integration Certificate</li>
          <li><span>KNIME</span>Basic Proficiency in KNIME Analytics Platform</li>
          <li><span>LinkedIn</span>Windows 11: Security</li>
        </ul>
      </section>

      <section className="work-section" id="work">
        <div className="section-intro">
          <div>
            <p className="eyebrow">06 / Projects</p>
            <h2>Ideas, made useful.</h2>
          </div>
          <div className="project-carousel-controls">
            <p>
              Six projects across AI, automation and product design.
            </p>
            <div className="carousel-actions">
              <span className="carousel-progress" aria-live="polite">
                {projectPosition} / {projects.length}
              </span>
              <button
                type="button"
                aria-label="Previous project"
                onClick={() => {
                  const row = projectRowRef.current
                  if (!row) return
                  const card = row.querySelector<HTMLElement>(".project-card-item")
                  row.scrollBy({ left: -(card?.offsetWidth ?? row.clientWidth) - 16, behavior: "smooth" })
                }}
              >
                <Arrow direction="left" />
              </button>
              <button
                type="button"
                aria-label="Next project"
                onClick={() => {
                  const row = projectRowRef.current
                  if (!row) return
                  const card = row.querySelector<HTMLElement>(".project-card-item")
                  row.scrollBy({ left: (card?.offsetWidth ?? row.clientWidth) + 16, behavior: "smooth" })
                }}
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>
        <div
          className="project-row"
          ref={projectRowRef}
          onScroll={(event) => {
            const row = event.currentTarget
            const card = row.querySelector<HTMLElement>(".project-card-item")
            const step = (card?.offsetWidth ?? row.clientWidth) + 16
            setProjectPosition(Math.min(projects.length, Math.round(row.scrollLeft / step) + 1))
          }}
        >
          {projects.map((project) => (
            <div className="project-card-item" key={project.slug}>
              <button
                className="project-card"
                type="button"
                onClick={() => openProject(project.slug)}
              >
                <div className="card-meta">
                  <span>{project.id}</span>
                  <span>{project.category}</span>
                </div>
                <Mark type={project.slug} />
                <div className="card-copy">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="card-subject">{project.subject}</div>
                  <span className="view-project">
                    View project <Arrow />
                  </span>
                </div>
              </button>
              {project.externalLink && (
                <a
                  className="project-external-link"
                  href={project.externalLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.externalLabel} <Arrow />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="cca-section cv-section" id="cca">
        <div className="cv-section-heading">
          <p className="eyebrow">07 / Co-curricular activities</p>
          <h2>Leadership in practice.</h2>
        </div>
        <div className="cca-list">
          <article>
            <span>2026 – Present</span>
            <div><h3>Vice President</h3><p>Applied Artificial Intelligence Student Interest Group, Temasek Polytechnic</p></div>
          </article>
          <article>
            <span>2026 – Present</span>
            <div><h3>Sub Committee Member</h3><p>IT Sub Committee, Temasek Polytechnic</p></div>
          </article>
          <article>
            <span>2026 – Present</span>
            <div><h3>STAR Ambassador</h3><p>Temasek Polytechnic</p></div>
          </article>
          <article>
            <span>2025 – Present</span>
            <div><h3>Temasek LEAD, Top 10%</h3><p>Leadership and development programme, Temasek Polytechnic</p></div>
          </article>
          <article>
            <span>2025 – 2026</span>
            <div><h3>Class and Sports Representative</h3><p>Temasek Polytechnic</p></div>
          </article>
          <article>
            <span>2021 – 2024</span>
            <div><h3>Master Sergeant / NCC (Air)</h3><p>Changkat Changi Secondary School</p></div>
          </article>
        </div>
      </section>

      <section className="achievements-section cv-section" id="achievements">
        <div className="cv-section-heading">
          <p className="eyebrow">08 / Achievements</p>
          <h2>Recognition earned.</h2>
        </div>
        <div className="achievement-list">
          <article><span>2026</span><div><h3>Merit Award</h3><p>HKIIT International Competition, team of four, retail demand forecasting pipeline and web app in two days.</p></div></article>
          <article><span>2026</span><div><h3>Certificate of Academic Achievement</h3><p>Temasek Polytechnic, top 25% of the cohort.</p></div></article>
          <article><span>2026</span><div><h3>PolyFinTech100 API Hackathon</h3><p>Temasek Polytechnic, participated in the Prudential / Insurtech category.</p></div></article>
          <article><span>2024</span><div><h3>EAGLES Award</h3><p>Changkat Changi Secondary School, top-tier leadership and service.</p></div></article>
          <article><span>2024</span><div><h3>Outstanding Cadet</h3><p>NCC (Air), Changkat Changi Secondary School.</p></div></article>
          <article><span>2024</span><div><h3>Outstanding Service Award</h3><p>Changkat Changi Secondary School.</p></div></article>
          <article><span>2022</span><div><h3>Best Senior Cadet</h3><p>NCC (Air), Changkat Changi Secondary School.</p></div></article>
        </div>
      </section>

      <footer id="contact">
        <p className="eyebrow">09 / Let’s connect</p>
        <div className="footer-main">
          <h2>
            Have an idea?
            <br />
            <em>Let’s make it real.</em>
          </h2>
          <div className="contact-links">
            <a href="mailto:mohammed.ikhlas66@gmail.com">mohammed.ikhlas66@gmail.com <Arrow /></a>
            <a href="https://www.linkedin.com/in/mohammed-ikhlas" target="_blank" rel="noreferrer">
              <span className="contact-label"><LinkedInIcon />LinkedIn</span>
              <Arrow />
            </a>
            <a href="https://github.com/ikhlasmohammed" target="_blank" rel="noreferrer">
              <span className="contact-label"><GitHubIcon />GitHub</span>
              <Arrow />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Mohammed Ikhlas · Singapore</span>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  )
}

export default App
