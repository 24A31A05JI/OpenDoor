import { useEffect, useMemo, useState, type ComponentType, type CSSProperties, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  Compass,
  ExternalLink,
  Flame,
  Globe2,
  GraduationCap,
  Layers3,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type Opportunity = {
  id: string;
  title: string;
  company: string;
  type: string;
  category: string;
  location: string;
  deadline: string;
  reward: string;
  mode: string;
  applicationUrl: string;
  description: string;
  accent: string;
  wash: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  featured?: boolean;
  hot?: boolean;
};

type ApplicationRecord = {
  id: string;
  email: string;
  opportunityId: string;
  title: string;
  company: string;
  category: string;
  applicationUrl: string;
  appliedAt: string;
  status: 'In progress';
};

const opportunities: Opportunity[] = [
  {
    id: 'orbit-build',
    title: 'Orbit Build Challenge',
    company: 'Kite Labs',
    type: 'Hackathon',
    category: 'Hackathons',
    location: 'Bengaluru + remote',
    deadline: '18 May 2025',
    reward: '₹4.5L in prizes',
    mode: 'Hybrid',
    applicationUrl: 'https://devpost.com/hackathons',
    description: 'Build a small, useful thing for the next billion internet users. Product, data and engineering teams welcome.',
    accent: 'hsl(9 94% 64%)',
    wash: 'hsl(9 94% 64% / .16)',
    icon: Code2,
    featured: true,
    hot: true,
  },
  {
    id: 'monsoon-fellowship',
    title: 'Monsoon Product Fellowship',
    company: 'Northstar Collective',
    type: 'Fellowship',
    category: 'Learning',
    location: 'Mumbai',
    deadline: '26 May 2025',
    reward: '₹60,000 stipend',
    mode: 'In-person',
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=product%20fellowship%20internship',
    description: 'A six-week studio for curious generalists turning messy observations into products people keep.',
    accent: 'hsl(169 46% 42%)',
    wash: 'hsl(169 46% 42% / .15)',
    icon: Lightbulb,
  },
  {
    id: 'atlas-analyst',
    title: 'Atlas Strategy Analyst',
    company: 'Morrow & Finch',
    type: 'Internship',
    category: 'Internships',
    location: 'Gurugram',
    deadline: '02 Jun 2025',
    reward: '₹45,000 / month',
    mode: 'Hybrid',
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=strategy%20analyst%20internship',
    description: 'Work with the growth office on market maps, sharp memos and the questions hiding underneath the numbers.',
    accent: 'hsl(222 40% 42%)',
    wash: 'hsl(222 40% 42% / .13)',
    icon: BriefcaseBusiness,
  },
  {
    id: 'women-code',
    title: 'Women Who Code: Build Forward',
    company: 'Patchwork Foundation',
    type: 'Competition',
    category: 'Competitions',
    location: 'Online / India',
    deadline: '09 Jun 2025',
    reward: 'Mentorship + ₹1L',
    mode: 'Remote',
    applicationUrl: 'https://www.womentech.net/events',
    description: 'Ship an accessible digital experience with a team of builders, designers and new points of view.',
    accent: 'hsl(304 48% 56%)',
    wash: 'hsl(304 48% 56% / .14)',
    icon: Trophy,
    hot: true,
  },
  {
    id: 'bright-ops',
    title: 'Brightside Operations Associate',
    company: 'Pico Mobility',
    type: 'Full-time job',
    category: 'Jobs',
    location: 'Pune',
    deadline: '14 Jun 2025',
    reward: '₹8–12 LPA',
    mode: 'In-person',
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=operations%20associate',
    description: 'Help a fast-moving climate mobility team make every launch calmer, clearer and a little more ambitious.',
    accent: 'hsl(44 80% 47%)',
    wash: 'hsl(44 80% 47% / .17)',
    icon: Rocket,
  },
  {
    id: 'global-sprint',
    title: 'Global Impact Sprint',
    company: 'One Degree',
    type: 'Case challenge',
    category: 'Competitions',
    location: 'Global / remote',
    deadline: '22 Jun 2025',
    reward: '$8,000 grant',
    mode: 'Remote',
    applicationUrl: 'https://www.idealist.org/en/',
    description: 'Three weekends. One stubborn global problem. Bring a team or find your people inside the sprint.',
    accent: 'hsl(191 52% 42%)',
    wash: 'hsl(191 52% 42% / .15)',
    icon: Globe2,
  },
];

const categories: { label: string; count: string; icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; color: string }[] = [
  { label: 'Hackathons', count: '48 live', icon: Code2, color: 'tag-coral' },
  { label: 'Internships', count: '126 open', icon: BriefcaseBusiness, color: 'tag-mint' },
  { label: 'Competitions', count: '32 live', icon: Trophy, color: 'tag-yellow' },
  { label: 'Jobs', count: '214 open', icon: Rocket, color: 'tag-coral' },
  { label: 'Learning', count: '89 paths', icon: GraduationCap, color: 'tag-mint' },
];

function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [signedIn, setSignedIn] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountEmail, setAccountEmail] = useState('');
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem('opendoor-applications') ?? '[]') as ApplicationRecord[];
    } catch {
      return [];
    }
  });
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('opendoor-applications', JSON.stringify(applications));
  }, [applications]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return opportunities.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch = !search || [item.title, item.company, item.type, item.category, item.location].some((field) => field.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const toggleSaved = (id: string) => {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      announce(next.includes(id) ? 'Saved to your launch list' : 'Removed from your launch list');
      return next;
    });
  };

  const startApplication = (item: Opportunity) => {
    if (!signedIn) {
      setSelected(null);
      setAuthMode('signin');
      setAuthOpen(true);
      announce('Sign in to save your application progress');
      return;
    }

    const existing = applications.some((application) => application.email === accountEmail && application.opportunityId === item.id);
    if (!existing) {
      const record: ApplicationRecord = {
        id: `${item.id}-${Date.now()}`,
        email: accountEmail,
        opportunityId: item.id,
        title: item.title,
        company: item.company,
        category: item.category,
        applicationUrl: item.applicationUrl,
        appliedAt: new Date().toISOString(),
        status: 'In progress',
      };
      setApplications((current) => [record, ...current]);
      void fetch('/api/applications/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: accountEmail,
          opportunityTitle: item.title,
          company: item.company,
          applicationUrl: item.applicationUrl,
        }),
      }).then((response) => {
        if (!response.ok) throw new Error('Email was not accepted');
        announce('Application saved — confirmation sent to your email');
      }).catch(() => {
        announce('Application saved as in progress; email confirmation could not be sent');
      });
    } else {
      announce('This application is already in progress');
    }

    setSubmitted(true);
    window.open(item.applicationUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToDiscover = () => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="opportunity-app text-foreground">
      <header className="nav-blur sticky top-0 z-40 border-b border-border/80">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <button className="flex items-center gap-3" onClick={() => { setAccountOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} data-testid="button-brand-home">
            <span className="brand-mark"><span>O</span></span>
            <span className="display-font text-[1.12rem] font-bold tracking-[-.04em]">OpenDoor<span className="text-primary">.</span></span>
          </button>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            <a href="#discover" onClick={() => setAccountOpen(false)} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" data-testid="link-nav-discover">Discover</a>
            <a href="#how-it-works" onClick={() => setAccountOpen(false)} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" data-testid="link-nav-how">How it works</a>
            <a href="#for-recruiters" onClick={() => setAccountOpen(false)} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" data-testid="link-nav-recruiters">For recruiters</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {signedIn ? <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-bold text-background transition-transform hover:-translate-y-0.5" onClick={() => setAccountOpen(true)} data-testid="button-account"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-foreground"><UserRound size={14} /></span>My account</button> : <><button className="rounded-full px-4 py-2 text-sm font-bold transition-colors hover:bg-muted" onClick={() => { setAuthMode('signin'); setAuthOpen(true); }} data-testid="button-signin">Sign in</button><button className="rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-transform hover:-translate-y-0.5" onClick={() => { setAuthMode('register'); setAuthOpen(true); }} data-testid="button-register">Create account <ArrowRight className="ml-1 inline" size={15} /></button></>}
          </div>
          <button className="rounded-lg p-2 md:hidden" onClick={() => setMobileNav((open) => !open)} aria-label="Toggle navigation" data-testid="button-mobile-menu">
            {mobileNav ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {mobileNav && (
          <div className="border-t border-border bg-background px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#discover" onClick={() => { setAccountOpen(false); setMobileNav(false); }} className="text-sm font-bold" data-testid="link-mobile-discover">Discover</a>
              <a href="#how-it-works" onClick={() => { setAccountOpen(false); setMobileNav(false); }} className="text-sm font-bold" data-testid="link-mobile-how">How it works</a>
              <a href="#for-recruiters" onClick={() => { setAccountOpen(false); setMobileNav(false); }} className="text-sm font-bold" data-testid="link-mobile-recruiters">For recruiters</a>
              {signedIn ? <button className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-bold text-background" onClick={() => { setAccountOpen(true); setMobileNav(false); }} data-testid="button-mobile-account">Open my account</button> : <button className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-bold text-background" onClick={() => { setAuthMode('register'); setAuthOpen(true); setMobileNav(false); }} data-testid="button-mobile-register">Create account</button>}
            </div>
          </div>
        )}
      </header>

      {accountOpen ? <AccountView email={accountEmail} saved={saved} applications={applications.filter((application) => application.email === accountEmail)} onBack={() => setAccountOpen(false)} onOpen={(item) => setSelected(item)} onSave={toggleSaved} onSignOut={() => { setSignedIn(false); setAccountOpen(false); setAccountEmail(''); announce('You have been signed out'); }} /> : <main>
        <section className="ink-panel hero-grid relative overflow-hidden">
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-24">
            <div className="relative z-10 reveal">
              <div className="mono-label mb-6 flex items-center gap-2 text-secondary"><span className="pulse-dot h-2 w-2 rounded-full bg-primary" /> Thursday, 15 May 2025 <span className="ml-1 text-background/40">/</span> Daily brief #042</div>
              <h1 className="display-font max-w-[700px] text-[3.55rem] font-semibold leading-[.96] tracking-[-.07em] text-background sm:text-[5.6rem] lg:text-[6.65rem]">Your next<br /><span className="text-primary">door</span> is open.</h1>
              <p className="mt-7 max-w-[490px] text-[1.04rem] leading-7 text-background/70">A sharper way to find the competitions, internships, jobs and ideas worth your next few weeks.</p>
              <button onClick={scrollToDiscover} className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-foreground transition-transform hover:-translate-y-1" data-testid="button-start-discover">Start discovering <ArrowRight size={17} /></button>
            </div>
            <div className="relative flex min-h-[280px] items-center justify-center lg:min-h-[410px] reveal reveal-delay-2">
              <div className="hero-arrow" />
              <div className="relative h-[270px] w-[270px] hero-orb sm:h-[350px] sm:w-[350px]">
                <div className="hero-orb-dot" />
                <div className="absolute left-[16%] top-[42%] -rotate-6 rounded border border-foreground/30 bg-foreground/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[.15em] text-background/80">find signal</div>
                <div className="absolute bottom-[22%] right-[10%] rotate-6 rounded border border-foreground/30 bg-foreground/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[.15em] text-background/80">make a move</div>
                <div className="absolute left-[42%] top-[45%] text-center">
                  <Sparkles className="mx-auto mb-2 text-accent" size={24} />
                  <p className="display-font text-2xl font-bold text-foreground">go<br />further</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-background/15">
            <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 lg:px-8">
              <span className="mono-label text-background/45">This week on the board</span>
              <span className="flex items-center gap-2 text-sm text-background/70"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> 214 fresh opportunities</span>
              <span className="flex items-center gap-2 text-sm text-background/70"><span className="h-1.5 w-1.5 rounded-full bg-secondary" /> 38 closing soon</span>
              <span className="flex items-center gap-2 text-sm text-background/70"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> 12,480 people exploring</span>
            </div>
          </div>
        </section>

        <section id="discover" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.74fr_1.26fr] lg:items-end">
            <div className="reveal">
              <p className="mono-label mb-4 text-primary">01 / Find your signal</p>
              <h2 className="display-font text-4xl font-semibold leading-[1] tracking-[-.055em] sm:text-5xl">Less scrolling.<br />More <span className="text-primary">starting.</span></h2>
              <p className="mt-5 max-w-sm leading-7 text-muted-foreground">Tell us what you are curious about. We will put the most useful doors in one place.</p>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2 pl-5 soft-shadow">
                <Search className="shrink-0 text-primary" size={20} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold outline-none placeholder:text-muted-foreground/70" placeholder="Search roles, skills, companies..." aria-label="Search opportunities" data-testid="input-search-opportunities" />
                {query && <button onClick={() => setQuery('')} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted" aria-label="Clear search" data-testid="button-clear-search"><X size={16} /></button>}
                <button onClick={scrollToDiscover} className="hidden rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background sm:block" data-testid="button-search">Search</button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="mr-1 font-semibold">Popular:</span>
                {['Product', 'Data', 'Remote', '₹50k+'].map((tag) => <button key={tag} className="rounded-full border border-border px-3 py-1.5 font-semibold transition-colors hover:border-primary hover:text-primary" onClick={() => setQuery(tag.replace('₹50k+', '50k'))} data-testid={`button-popular-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{tag}</button>)}
              </div>
            </div>
          </div>
          <div className="mt-14 flex gap-3 overflow-x-auto pb-2">
            <button onClick={() => setCategory('All')} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${category === 'All' ? 'bg-foreground text-background' : 'border border-border bg-card hover:border-primary'}`} data-testid="button-filter-all">All opportunities <span className="ml-1 text-xs opacity-60">214</span></button>
            {categories.map((item) => <button key={item.label} onClick={() => setCategory(item.label)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${category === item.label ? 'bg-foreground text-background' : 'border border-border bg-card hover:border-primary'}`} data-testid={`button-filter-${item.label.toLowerCase()}`}>{item.label} <span className="ml-1 text-xs opacity-60">{item.count.split(' ')[0]}</span></button>)}
            <button className="ml-auto hidden shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold md:flex" onClick={() => announce('More filters are coming to your launch list')} data-testid="button-more-filters"><SlidersHorizontal size={15} /> More filters</button>
          </div>
          <div className="mt-8 flex items-end justify-between">
            <div>
              <span className="mono-label text-muted-foreground">Curated for you</span>
              <h3 className="display-font mt-2 text-2xl font-bold tracking-[-.04em]">Doors worth opening <span className="text-primary">↗</span></h3>
            </div>
            <span className="hidden text-sm font-semibold text-muted-foreground sm:block">{filtered.length} results</span>
          </div>
          {filtered.length > 0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item, index) => <OpportunityCard key={item.id} item={item} index={index} saved={saved.includes(item.id)} onSave={() => toggleSaved(item.id)} onOpen={() => setSelected(item)} />)}
            </div>
          ) : (
            <div className="mt-7 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <Compass className="mx-auto text-primary" size={30} />
              <h3 className="display-font mt-4 text-2xl font-bold">No doors match that search yet.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Try a broader phrase, or clear the filters and browse the full board.</p>
              <button className="mt-6 rounded-full bg-foreground px-5 py-3 text-sm font-bold text-background" onClick={() => { setQuery(''); setCategory('All'); }} data-testid="button-reset-search">Reset board</button>
            </div>
          )}
          <div className="mt-8 flex justify-center"><button onClick={() => announce('The board is already showing the freshest opportunities')} className="inline-flex items-center gap-2 text-sm font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4" data-testid="button-load-more">Show me more doors <ArrowRight size={16} /></button></div>
        </section>

        <section className="border-y border-border/70 bg-secondary/20">
          <div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div><p className="mono-label mb-4 text-primary">02 / Browse by energy</p><h2 className="display-font text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Pick a lane.<br /><span className="text-primary">Change direction.</span></h2></div>
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">Small moves compound. Start with what sounds interesting today, not what sounds impressive on paper.</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((item) => { const Icon = item.icon; return <button key={item.label} className="category-tile group rounded-2xl p-5 text-left" onClick={() => { setCategory(item.label); scrollToDiscover(); }} data-testid={`button-category-${item.label.toLowerCase()}`}><div className={`mb-7 flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}><Icon size={20} /></div><div className="flex items-end justify-between gap-2"><span className="display-font text-lg font-bold tracking-[-.03em]">{item.label}</span><ChevronRight className="text-muted-foreground transition-transform group-hover:translate-x-1" size={17} /></div><span className="mt-1 block text-xs font-semibold text-muted-foreground">{item.count}</span></button>; })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="mono-label mb-4 text-primary">03 / Your unfair advantage</p><h2 className="display-font text-4xl font-semibold leading-[1] tracking-[-.055em] sm:text-5xl">A better brief for your <span className="text-primary">next move.</span></h2><p className="mt-5 max-w-sm leading-7 text-muted-foreground">No endless tabs. No mystery keywords. Just enough context to decide if the door is yours.</p></div>
            <div className="grid gap-0 sm:grid-cols-3">
              {[{ n: '01', title: 'Tune the signal', copy: 'Choose your lanes, location and the kind of stretch you want next.', icon: SlidersHorizontal }, { n: '02', title: 'Save the spark', copy: 'Keep promising opportunities together, before the deadline gets loud.', icon: BookmarkCheck }, { n: '03', title: 'Make your move', copy: 'Apply with context and confidence. Momentum loves a clear next step.', icon: Send }].map((step) => { const Icon = step.icon; return <div key={step.n} className="border-t border-border px-1 py-6 sm:border-l sm:border-t-0 sm:px-6"><span className="mono-label text-primary">{step.n}</span><Icon className="my-9 text-foreground" size={24} strokeWidth={1.7} /><h3 className="display-font text-xl font-bold tracking-[-.04em]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{step.copy}</p></div>; })}
            </div>
          </div>
        </section>

        <section className="ink-panel">
          <div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-20">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div><p className="mono-label mb-4 text-primary">The signal is real</p><h2 className="display-font max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-.055em] text-background sm:text-5xl">Built for people who are <span className="text-primary">not done</span> becoming.</h2></div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-7 sm:flex sm:gap-12"><Metric value="12.4k" label="active explorers" /><Metric value="1,480" label="doors opened" /><Metric value="4.8/5" label="useful, rated" /></div>
            </div>
            <div className="mt-14 flex flex-wrap items-center gap-5 border-t border-background/15 pt-7"><span className="mono-label text-background/40">People building the future at</span>{['CREDO', 'MOTIONLAB', 'RIVET', 'VOLTAGE', 'LOOMWORKS'].map((brand) => <span key={brand} className="display-font text-lg font-bold tracking-[-.04em] text-background/65">{brand}</span>)}</div>
          </div>
        </section>

        <section id="for-recruiters" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute -right-14 -top-24 h-72 w-72 rounded-full border-[1px] border-foreground/20" /><div className="absolute -right-5 -top-16 h-52 w-52 rounded-full border-[1px] border-foreground/20" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_.7fr] lg:items-end">
              <div><p className="mono-label mb-5 text-foreground/60">For teams with a point of view</p><h2 className="display-font max-w-2xl text-4xl font-semibold leading-[.98] tracking-[-.06em] text-foreground sm:text-6xl">The right person is already looking.<br /><span className="text-background/75">Give them a reason.</span></h2><p className="mt-6 max-w-md leading-7 text-foreground/75">Put your challenge, role or fellowship in front of ambitious people before they become another resume in a pile.</p></div>
              <div className="lg:justify-self-end"><button onClick={() => announce('Thanks — our partnerships desk will be in touch')} className="inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-extrabold text-background transition-transform hover:-translate-y-1" data-testid="button-post-opportunity">Post an opportunity <ArrowRight size={17} /></button><p className="mt-4 text-xs font-semibold text-foreground/60">Takes 4 minutes · No lock-in</p></div>
            </div>
          </div>
        </section>
      </main>}

      <footer className="footer-grid ink-panel border-t border-background/10">
        <div className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div><div className="flex items-center gap-3"><span className="brand-mark"><span>O</span></span><span className="display-font text-xl font-bold tracking-[-.04em] text-background">OpenDoor<span className="text-primary">.</span></span></div><p className="mt-5 max-w-xs text-sm leading-6 text-background/55">A daily brief of doors worth walking through. Made for the next version of you.</p></div>
            <FooterCol title="Explore" links={['All opportunities', 'Hackathons', 'Internships', 'Jobs']} onLink={(link) => { setCategory(link === 'All opportunities' ? 'All' : link); scrollToDiscover(); }} />
            <FooterCol title="OpenDoor" links={['About the brief', 'For recruiters', 'Community notes', 'Support']} onLink={(link) => announce(`${link} is on its way`)} />
            <div><p className="mono-label text-background/45">Keep your eyes open</p><p className="mt-4 text-sm leading-6 text-background/55">One useful opportunity in your inbox every Tuesday.</p><div className="mt-4 flex overflow-hidden rounded-xl border border-background/20"><input className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-background outline-none placeholder:text-background/35" placeholder="you@email.com" data-testid="input-newsletter" /><button className="bg-primary px-3 text-foreground" onClick={() => announce('You are on the Tuesday brief list')} aria-label="Join newsletter" data-testid="button-newsletter"><ArrowRight size={17} /></button></div></div>
          </div>
          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-background/10 pt-5 text-xs text-background/35 sm:flex-row"><span>© 2025 OpenDoor Labs</span><span>Built for curious people, everywhere.</span></div>
        </div>
      </footer>

      {notice && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm font-bold text-background shadow-xl" role="status" data-testid="status-notice">{notice}</div>}
      {selected && <OpportunityModal item={selected} saved={saved.includes(selected.id)} onSave={() => toggleSaved(selected.id)} onClose={() => { setSelected(null); setSubmitted(false); }} submitted={submitted || applications.some((application) => application.email === accountEmail && application.opportunityId === selected.id)} onApply={() => startApplication(selected)} />}
      {authOpen && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthOpen(false)} onSubmit={(email) => { setSignedIn(true); setAccountEmail(email); setAuthOpen(false); setAccountOpen(true); announce(authMode === 'signin' ? 'Welcome back — your account is open' : 'Your account is ready'); }} />}
    </div>
  );
}

function OpportunityCard({ item, saved, onSave, onOpen, index }: { item: Opportunity; saved: boolean; onSave: () => void; onOpen: () => void; index: number }) {
  const Icon = item.icon;
  return <article className={`opportunity-card card-lift reveal reveal-delay-${Math.min(index + 1, 4)} rounded-2xl border border-border bg-card p-6 pl-7`} style={{ '--card-accent': item.accent, '--card-wash': item.wash } as CSSProperties} data-testid={`card-opportunity-${item.id}`}>
    <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: item.wash, color: item.accent }}><Icon size={19} /></div><div><p className="text-sm font-extrabold">{item.company}</p><p className="mt-0.5 text-xs font-semibold text-muted-foreground">{item.type}</p></div></div><button onClick={onSave} className={`relative z-10 rounded-full p-2 transition-colors hover:bg-muted ${saved ? 'text-primary' : 'text-muted-foreground'}`} aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`} data-testid={`button-save-${item.id}`}>{saved ? <BookmarkCheck className="saved-pop" size={19} fill="currentColor" /> : <Bookmark size={19} />}</button></div>
    <button className="relative z-10 mt-7 block text-left" onClick={onOpen} data-testid={`button-open-${item.id}`}><div className="mb-3 flex flex-wrap gap-2"><span className="tag-coral rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em]">{item.category}</span>{item.hot && <span className="tag-yellow flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em]"><Flame size={11} /> Closing soon</span>}</div><h3 className="display-font text-[1.45rem] font-bold leading-[1.05] tracking-[-.045em]">{item.title}</h3><p className="line-clamp-2 mt-3 min-h-[48px] text-sm leading-6 text-muted-foreground">{item.description}</p></button>
    <div className="relative z-10 mt-7 grid grid-cols-2 gap-y-3 border-t border-border pt-4 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1.5"><MapPin size={14} /> {item.location}</span><span className="flex items-center gap-1.5"><CalendarDays size={14} /> {item.deadline}</span><span className="flex items-center gap-1.5"><CircleDollarSign size={14} /> {item.reward}</span><span className="flex items-center gap-1.5"><Globe2 size={14} /> {item.mode}</span></div>
  </article>;
}

function AccountView({ email, saved, applications, onBack, onOpen, onSave, onSignOut }: { email: string; saved: string[]; applications: ApplicationRecord[]; onBack: () => void; onOpen: (item: Opportunity) => void; onSave: (id: string) => void; onSignOut: () => void }) {
  const savedItems = opportunities.filter((item) => saved.includes(item.id));
  const [opportunityFilter, setOpportunityFilter] = useState<'all' | 'internships'>('all');
  const visibleItems = opportunityFilter === 'internships' ? opportunities.filter((item) => item.category === 'Internships') : opportunities;
  const displayName = email.split('@')[0].replace(/[._-]+/g, ' ') || 'Explorer';
  const firstName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return <main className="bg-background">
    <section className="ink-panel hero-grid">
      <div className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-16">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-background/65 transition-colors hover:text-background" data-testid="button-back-discover"><ArrowLeft size={16} /> Back to discover</button>
        <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mono-label text-secondary">Your launchpad / account</p>
            <h1 className="display-font mt-4 max-w-2xl text-5xl font-semibold leading-[.98] tracking-[-.07em] text-background sm:text-6xl">Good to see you,<br /><span className="text-primary">{firstName}.</span></h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-background/65">Your account is ready. Keep the opportunities that feel like a good next move close by.</p>
          </div>
          <button onClick={onSignOut} className="inline-flex w-fit items-center gap-2 rounded-full border border-background/20 px-4 py-2.5 text-sm font-bold text-background/75 transition-colors hover:border-primary hover:text-background" data-testid="button-signout"><LogOut size={16} /> Sign out</button>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-16">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6"><p className="mono-label text-muted-foreground">Signed in as</p><p className="mt-4 truncate text-lg font-bold">{email}</p><p className="mt-2 text-sm text-muted-foreground">Your account is active</p></div>
        <div className="rounded-2xl border border-border bg-card p-6"><p className="mono-label text-muted-foreground">Applications in progress</p><p className="display-font mt-3 text-4xl font-bold tracking-[-.06em]">{applications.length}</p><p className="mt-2 text-sm text-muted-foreground">Your active applications</p></div>
        <div className="rounded-2xl border border-border bg-card p-6"><p className="mono-label text-muted-foreground">Your next move</p><p className="mt-4 text-lg font-bold">Find your signal</p><p className="mt-2 text-sm text-muted-foreground">Explore something new today</p></div>
      </div>
      <div className="mt-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div><p className="mono-label text-primary">Open doors / all opportunities</p><h2 className="display-font mt-3 text-4xl font-bold tracking-[-.06em]">Find your next move.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Every opportunity is available here after you sign in. Browse the full list or narrow it down to internships.</p></div>
        <div className="flex shrink-0 rounded-full border border-border bg-card p-1" role="tablist" aria-label="Opportunity type"><button onClick={() => setOpportunityFilter('all')} className={`rounded-full px-4 py-2 text-xs font-extrabold transition-colors ${opportunityFilter === 'all' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`} role="tab" aria-selected={opportunityFilter === 'all'} data-testid="tab-all-opportunities">All opportunities</button><button onClick={() => setOpportunityFilter('internships')} className={`rounded-full px-4 py-2 text-xs font-extrabold transition-colors ${opportunityFilter === 'internships' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`} role="tab" aria-selected={opportunityFilter === 'internships'} data-testid="tab-internships">Internships</button></div>
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-2">{visibleItems.map((item, index) => <OpportunityCard key={item.id} item={item} saved={saved.includes(item.id)} onSave={() => onSave(item.id)} onOpen={() => onOpen(item)} index={index} />)}</div>
      <div className="mt-20 flex items-end justify-between gap-5"><div><p className="mono-label text-primary">Saved for later</p><h2 className="display-font mt-3 text-4xl font-bold tracking-[-.06em]">Your launch list.</h2></div><span className="text-sm font-semibold text-muted-foreground">{savedItems.length} saved</span></div>
      {savedItems.length > 0 ? <div className="mt-7 grid gap-5 lg:grid-cols-2">{savedItems.map((item, index) => <OpportunityCard key={`saved-${item.id}`} item={item} saved onSave={() => onSave(item.id)} onOpen={() => onOpen(item)} index={index} />)}</div> : <div className="mt-7 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"><Bookmark className="mx-auto text-primary" size={26} /><h3 className="display-font mt-4 text-2xl font-bold tracking-[-.04em]">Your list is waiting.</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Save an opportunity while you browse and it will appear here for your next session.</p></div>}
      <div className="mt-20"><p className="mono-label text-primary">Archive / application tracker</p><h2 className="display-font mt-3 text-4xl font-bold tracking-[-.06em]">Applications in progress.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Every application you start is kept here with its direct application link and current status.</p></div>
      {applications.length > 0 ? <div className="mt-7 space-y-3">{applications.map((application) => <div key={application.id} className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-secondary-foreground"><BriefcaseBusiness size={19} /></div><div><p className="text-sm font-extrabold">{application.title}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{application.company} · {application.category}</p><p className="mt-3 text-xs text-muted-foreground">Started {new Date(application.appliedAt).toLocaleDateString()}</p></div></div><div className="flex items-center gap-3 sm:shrink-0"><span className="rounded-full bg-secondary/20 px-3 py-1.5 text-xs font-extrabold text-secondary-foreground">{application.status}</span><a href={application.applicationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-xs font-extrabold text-background" data-testid={`link-application-${application.opportunityId}`}>Open application <ExternalLink size={13} /></a></div></div>)}</div> : <div className="mt-7 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center"><p className="text-sm font-bold">No applications started yet.</p><p className="mt-2 text-sm text-muted-foreground">Choose an opportunity above and tap View application to start.</p></div>}
    </section>
  </main>;
}

function Metric({ value, label }: { value: string; label: string }) { return <div><p className="display-font text-3xl font-bold tracking-[-.06em] text-background">{value}</p><p className="mt-1 text-xs font-semibold text-background/50">{label}</p></div>; }

function FooterCol({ title, links, onLink }: { title: string; links: string[]; onLink: (link: string) => void }) {
  return <div><p className="mono-label text-background/45">{title}</p><div className="mt-4 flex flex-col items-start gap-3">{links.map((link) => <button key={link} onClick={() => onLink(link)} className="text-left text-sm font-semibold text-background/60 transition-colors hover:text-primary" data-testid={`button-footer-${link.toLowerCase().replaceAll(' ', '-')}`}>{link}</button>)}</div></div>;
}

function OpportunityModal({ item, saved, onSave, onClose, onApply, submitted }: { item: Opportunity; saved: boolean; onSave: () => void; onClose: () => void; onApply: () => void; submitted: boolean }) {
  const Icon = item.icon;
  return <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-foreground/65 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={`${item.title} details`}><div className="modal-card max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-card p-6 shadow-2xl sm:rounded-[2rem] sm:p-8"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: item.wash, color: item.accent }}><Icon size={22} /></div><div><p className="text-sm font-extrabold">{item.company}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{item.type} · {item.mode}</p></div></div><button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Close opportunity details" data-testid="button-close-details"><X size={20} /></button></div><div className="mt-8"><div className="flex flex-wrap gap-2"><span className="tag-coral rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em]">{item.category}</span><span className="tag-yellow rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em]">Apply by {item.deadline}</span></div><h2 className="display-font mt-4 text-4xl font-bold leading-[.98] tracking-[-.06em] sm:text-5xl">{item.title}</h2><p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{item.description} This is a space to show how you think, not just what you already know.</p></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-muted p-4"><Clock3 className="mb-3 text-primary" size={18} /><p className="text-xs font-semibold text-muted-foreground">Deadline</p><p className="mt-1 text-sm font-bold">{item.deadline}</p></div><div className="rounded-xl bg-muted p-4"><CircleDollarSign className="mb-3 text-primary" size={18} /><p className="text-xs font-semibold text-muted-foreground">What is in it</p><p className="mt-1 text-sm font-bold">{item.reward}</p></div><div className="rounded-xl bg-muted p-4"><MapPin className="mb-3 text-primary" size={18} /><p className="text-xs font-semibold text-muted-foreground">Where</p><p className="mt-1 text-sm font-bold">{item.location}</p></div></div><div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row"><button onClick={onApply} disabled={submitted} className="flex-1 rounded-full bg-foreground px-5 py-3.5 text-sm font-extrabold text-background transition-transform hover:-translate-y-0.5 disabled:cursor-default disabled:bg-secondary disabled:text-foreground" data-testid="button-apply-opportunity">{submitted ? <><CheckCircle2 className="mr-2 inline" size={16} /> Application in progress</> : <>View application <ExternalLink className="ml-2 inline" size={16} /></>}</button>{submitted && <a href={item.applicationUrl} target="_blank" rel="noreferrer" className="rounded-full border border-border px-5 py-3.5 text-center text-sm font-extrabold transition-colors hover:border-primary hover:text-primary" data-testid="link-open-application-again">Open link again <ExternalLink className="ml-2 inline" size={16} /></a>}<button onClick={onSave} className="rounded-full border border-border px-5 py-3.5 text-sm font-extrabold transition-colors hover:border-primary hover:text-primary" data-testid="button-modal-save">{saved ? <><BookmarkCheck className="mr-2 inline" size={16} /> Saved</> : <><Bookmark className="mr-2 inline" size={16} /> Save for later</>}</button></div></div></div>;
}

function AuthModal({ mode, onModeChange, onClose, onSubmit }: { mode: 'signin' | 'register'; onModeChange: (mode: 'signin' | 'register') => void; onClose: () => void; onSubmit: (email: string) => void }) {
  const isRegister = mode === 'register';
  const [email, setEmail] = useState('');
  return <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-foreground/65 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={isRegister ? 'Create your OpenDoor account' : 'Sign in to OpenDoor'}><div className="modal-card w-full max-w-md rounded-t-[2rem] bg-card p-7 shadow-2xl sm:rounded-[2rem] sm:p-9"><div className="flex items-start justify-between"><div><div className="brand-mark"><span>O</span></div><h2 className="display-font mt-6 text-3xl font-bold tracking-[-.06em]">{isRegister ? 'Keep your doors close.' : 'Welcome back.'}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{isRegister ? 'Save the sparks. Get a brief that feels like you.' : 'Your saved opportunities are waiting.'}</p></div><button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Close sign in" data-testid="button-close-auth"><X size={20} /></button></div><form onSubmit={(event) => { event.preventDefault(); onSubmit(email); }} className="mt-8 space-y-4"><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">Email address</span><div className="flex items-center gap-3 rounded-xl border border-input px-3"><Mail className="text-muted-foreground" size={17} /><input type="email" required placeholder="you@email.com" value={email} onChange={(event) => setEmail(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" data-testid="input-auth-email" /></div></label><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">Password</span><div className="flex items-center gap-3 rounded-xl border border-input px-3"><LockKeyhole className="text-muted-foreground" size={17} /><input type="password" required minLength={6} placeholder="At least 6 characters" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" data-testid="input-auth-password" /></div></label><button type="submit" className="w-full rounded-full bg-primary py-3.5 text-sm font-extrabold text-foreground transition-transform hover:-translate-y-0.5" data-testid="button-auth-submit">{isRegister ? 'Create my account' : 'Sign in'}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">{isRegister ? 'Already have an account?' : 'New around here?'} <button className="font-extrabold text-primary underline underline-offset-4" onClick={() => onModeChange(isRegister ? 'signin' : 'register')} data-testid="button-toggle-auth-mode">{isRegister ? 'Sign in' : 'Create an account'}</button></p><div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground"><ShieldCheck size={14} className="text-secondary-foreground" /> Your details stay yours.</div></div></div>;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
