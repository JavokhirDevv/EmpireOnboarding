import { EmpireLogo } from "@/components/logo";
import { LinkButton } from "@/components/ui";
import { GlobalOffices } from "@/components/global-offices";
import { CoreTeam } from "@/components/core-team";

const coreTeam = [
  { name: "Cole West", title: "Expedite Manager", photo: "/TeamPics/cole.jpeg" },
  { name: "Nicole Medina", title: "Accounting Specialist", photo: "/TeamPics/nicole.jpeg" },
  { name: "Ryan King", title: "Company Relations", photo: "/TeamPics/ryan.jpeg" },
  { name: "John Atkinson", title: "Team Lead", photo: "/TeamPics/john.jpeg" },
  { name: "Alex Green", title: "Operations Manager", photo: "/TeamPics/alex.jpeg" },
  { name: "Daria Brooks", title: "QA Engineer", photo: "/TeamPics/dasha.jpeg" },
];

const branches = [
  { country: "Mexico", flagCode: "mx", offices: 3 },
  { country: "Ukraine", flagCode: "ua", offices: 3 },
  { country: "Poland", flagCode: "pl", offices: 1 },
  { country: "Turkey", flagCode: "tr", offices: 1, city: "Ankara" },
];

const totalOffices = branches.reduce((sum, b) => sum + b.offices, 0);

const pillars = [
  {
    title: "Company & Culture",
    desc: "Learn who Empire National is, our service lanes, and what we expect from every dispatcher on the team.",
  },
  {
    title: "Equipment & Trailers",
    desc: "Get fluent in the trailer types you'll be dispatching — dry van, reefer, flatbed, step deck, and more.",
  },
  {
    title: "Dispatch Workflow",
    desc: "Walk through load planning, driver communication, and the tools you'll use every shift.",
  },
  {
    title: "Safety & Compliance",
    desc: "Understand FMCSA hours-of-service, ELD basics, and the compliance rules that keep us on the road.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-border-subtle bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <EmpireLogo />
          <LinkButton href="/login" variant="navy">
            Sign in
          </LinkButton>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-navy-900 text-white">
          <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="fade-up inline-block text-accent-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4"
                style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
              >
                Dispatcher Onboarding Portal
              </span>
              <h1
                className="fade-up text-4xl sm:text-5xl font-bold leading-tight mb-5"
                style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
              >
                Welcome to Empire National
              </h1>
              <p
                className="fade-up text-steel-300 text-lg leading-relaxed mb-8 max-w-lg"
                style={{ "--reveal-delay": "340ms" } as React.CSSProperties}
              >
                Everything a new dispatcher needs to get up to speed — company
                training, equipment knowledge, and compliance — in one place,
                with certification quizzes to confirm you&apos;re ready for the floor.
              </p>
              <span
                className="fade-up inline-block"
                style={{ "--reveal-delay": "480ms" } as React.CSSProperties}
              >
                <LinkButton href="/login" variant="primary" className="text-base px-6 py-3">
                  Sign in to start training
                </LinkButton>
              </span>
            </div>
            <div
              className="fade-up bg-navy-800 border border-navy-700 rounded-2xl p-8"
              style={{ "--reveal-delay": "560ms" } as React.CSSProperties}
            >
              <div className="text-sm font-semibold text-accent-400 uppercase tracking-wide mb-4">
                What you&apos;ll complete
              </div>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li
                  className="fade-up flex gap-3"
                  style={{ "--reveal-delay": "700ms" } as React.CSSProperties}
                >
                  <span className="text-accent-400 font-bold">01</span>
                  Guided training modules written for new dispatchers
                </li>
                <li
                  className="fade-up flex gap-3"
                  style={{ "--reveal-delay": "810ms" } as React.CSSProperties}
                >
                  <span className="text-accent-400 font-bold">02</span>
                  Short knowledge-check quizzes after each module
                </li>
                <li
                  className="fade-up flex gap-3"
                  style={{ "--reveal-delay": "920ms" } as React.CSSProperties}
                >
                  <span className="text-accent-400 font-bold">03</span>
                  A completion certificate once you pass every quiz
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-navy-900 mb-2">
            Training built around the job
          </h2>
          <p className="text-steel-500 mb-10 max-w-2xl">
            The curriculum covers the core areas every Empire National
            dispatcher needs before taking live loads.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-surface border border-border-subtle rounded-xl p-5"
              >
                <h3 className="font-semibold text-navy-900 mb-2">{p.title}</h3>
                <p className="text-sm text-steel-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-muted border-t border-border-subtle">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-navy-900 mb-3">Core Team</h2>
              <span className="inline-block w-14 h-0.5 bg-accent-400" />
            </div>
            <CoreTeam members={coreTeam} />
          </div>
        </section>

        <section className="bg-navy-900 text-white">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <span className="inline-block text-accent-400 font-semibold text-xs tracking-[0.2em] uppercase mb-3">
                Where we operate
              </span>
              <h2 className="text-2xl font-bold text-white mb-1">Global Offices</h2>
              <p className="text-steel-300 max-w-xl mx-auto">
                {totalOffices} offices across {branches.length} countries, supporting dispatch around the clock.
              </p>
            </div>
            <GlobalOffices branches={branches} />
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-steel-500 flex justify-between">
          <span>&copy; {new Date().getFullYear()} Empire National. Internal use only.</span>
          <span>Dispatcher Onboarding Platform</span>
        </div>
      </footer>
    </div>
  );
}
