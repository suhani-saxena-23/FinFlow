import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, PieChart, Zap } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Net Worth Tracking', desc: 'See your complete financial picture at a glance' },
  { icon: Shield, title: 'Budget Guard', desc: 'Smart alerts when you\'re close to overspending' },
  { icon: PieChart, title: 'Visual Reports', desc: 'Beautiful charts that make data delightful' },
  { icon: Zap, title: 'AI Insights', desc: 'Personalized tips powered by your spending patterns' },
];

const reviews = [
  { name: 'Sarah M.', role: 'Freelancer', text: 'FinFlow changed how I manage my finances. The AI insights are incredibly helpful!' },
  { name: 'Mike R.', role: 'Small Business Owner', text: 'Best finance dashboard I\'ve used. Clean, intuitive, and actually enjoyable to use.' },
  { name: 'Lisa K.', role: 'Software Engineer', text: 'The budget tracking and goal features keep me accountable every single month.' },
  { name: 'David P.', role: 'Product Designer', text: 'Finally a finance app that looks as good as it works. Beautiful charts and insights.' },
  { name: 'Anna T.', role: 'Marketing Lead', text: 'Tracking expenses across multiple accounts has never been easier. Highly recommend!' },
  { name: 'James L.', role: 'Entrepreneur', text: 'The goal tracking feature keeps me motivated. Already saved 3x more than before.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[hsl(36,33%,95%)] dark:bg-background dark:text-foreground overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <span className="font-display text-2xl font-bold text-[hsl(168,60%,10%)] dark:text-white tracking-tight">FinFlow</span>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-body text-[hsl(162,28%,45%)] dark:text-muted-foreground hover:text-[hsl(168,60%,10%)] dark:hover:text-foreground transition-colors">Dashboard</Link>
          <Button variant="hero" asChild>
            <Link to="/dashboard">Get Started Free</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-up">
          <h1 className="font-display text-5xl lg:text-6xl leading-[1.1] text-[hsl(168,60%,10%)] dark:text-white mb-6">
            Track, manage, and grow{' '}
            <span className="italic text-primary">your money effortlessly.</span>
          </h1>
          <p className="font-body text-lg text-[hsl(162,28%,45%)] dark:text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Connect your financial accounts, or enter expenses using our quick and slick app. FinFlow helps you with the financial means. So you can <strong className="text-[hsl(168,60%,10%)] dark:text-white">focus on the goals.</strong>
          </p>
          <div className="flex gap-4 items-center">
            <Button variant="hero" size="lg" asChild className="text-base px-8 py-6 rounded-full">
              <Link to="/dashboard">START FREE TRIAL</Link>
            </Button>
          </div>
        </div>

        {/* Toshl-style device mockup - phone overlapping tablet */}
        <div className="relative hidden lg:flex items-center justify-center h-[480px]">
          {/* Tablet */}
          <div
            className="absolute w-[380px] h-[280px] rounded-2xl bg-white dark:bg-card shadow-2xl overflow-hidden border border-[hsl(162,25%,82%)] dark:border-border animate-float-slow"
            style={{ transform: 'rotate(-5deg) translateX(30px) translateY(20px)', animationDelay: '0.2s' }}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[hsl(4,78%,56%)]" />
                <span className="text-[10px] text-[hsl(162,28%,45%)] dark:text-muted-foreground font-body">All accounts</span>
                <span className="ml-auto text-[10px] font-mono text-[hsl(162,28%,45%)] dark:text-muted-foreground">€ 607.94 left</span>
              </div>
              <div className="text-xs font-body text-[hsl(168,60%,10%)] dark:text-foreground font-semibold mb-1">Monthly € 1,397.05</div>
              <div className="text-[10px] text-[hsl(162,28%,45%)] dark:text-muted-foreground mb-3">€ 789.11 used</div>
              <div className="space-y-2 flex-1">
                {[
                  { name: 'Food & Drinks', used: '$314.23', left: '$82.65', pct: 79 },
                  { name: 'Clothing', used: '$0.00', left: '$238.11', pct: 0 },
                  { name: 'Remaining categories', used: '$506.47', left: '$257.64', pct: 66 },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-body text-[hsl(168,60%,10%)] dark:text-foreground">{item.name}</span>
                      <span className="text-[9px] font-mono text-[hsl(162,28%,45%)] dark:text-muted-foreground">{item.left} left</span>
                    </div>
                    <div className="h-1.5 bg-[hsl(160,30%,94%)] dark:bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div
            className="absolute w-[200px] h-[380px] rounded-3xl bg-[hsl(168,60%,6%)] shadow-2xl overflow-hidden border-2 border-[hsl(168,40%,15%)] animate-float z-10"
            style={{ transform: 'rotate(8deg) translateX(-80px) translateY(-20px)' }}
          >
            <div className="p-3 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-[hsl(162,28%,60%)] font-body">October</span>
                <span className="text-[9px] text-[hsl(162,28%,60%)] font-body">All accounts</span>
              </div>
              <div className="text-white text-xs font-mono font-bold mb-1">€ 2,849.52</div>
              <div className="space-y-2 mt-2 flex-1">
                {[
                  { name: 'Cash', amount: '€32.60' },
                  { name: 'PayPal', amount: '$121.20' },
                  { name: 'MasterCard', amount: '€512.82' },
                  { name: 'HSBC', amount: '€1,803.41' },
                  { name: 'Revolut', amount: '€368.10' },
                ].map((acc) => (
                  <div key={acc.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-primary/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-[10px] text-white/80 font-body">{acc.name}</span>
                    </div>
                    <span className="text-[10px] text-white font-mono">{acc.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex justify-between">
                <span className="text-[9px] text-primary font-body">Add transfer</span>
                <span className="text-[9px] text-primary font-body">Edit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className={`stat-card animate-slide-up-delay-${Math.min(i, 3)}`}>
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-lg font-semibold text-[hsl(168,60%,10%)] dark:text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-[hsl(162,28%,45%)] dark:text-muted-foreground font-body">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews - Marquee */}
      <section className="pb-24 overflow-hidden">
        <h2 className="font-display text-3xl font-bold text-[hsl(168,60%,10%)] dark:text-foreground text-center mb-12">Trusted by millions.</h2>
        <div className="relative">
          <div className="flex animate-marquee gap-6" style={{ width: 'max-content' }}>
            {[...reviews, ...reviews, ...reviews].map((r, idx) => (
              <div key={idx} className="w-[340px] shrink-0 stat-card">
                <p className="text-sm font-body text-[hsl(162,28%,45%)] dark:text-muted-foreground leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold font-body text-card-foreground">{r.name}</div>
                    <div className="text-xs text-[hsl(162,28%,45%)] dark:text-muted-foreground font-body">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dot pattern bg */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
    </div>
  );
}
