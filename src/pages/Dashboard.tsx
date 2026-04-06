import { useApp } from '@/context/AppContext';
import { netWorthHistory, spendingByCategory } from '@/data/mockData';
import { TrendingUp, TrendingDown, DollarSign, Percent, CreditCard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const GREEN_SHADES = [
  'hsl(164, 72%, 21%)',  // darkest
  'hsl(162, 60%, 30%)',
  'hsl(160, 55%, 38%)',
  'hsl(158, 50%, 46%)',
  'hsl(155, 45%, 54%)',
  'hsl(152, 40%, 62%)',  // lightest
];

function StatCard({ title, value, change, icon: Icon, positive }: {
  title: string; value: string; change: string; icon: React.ElementType; positive: boolean;
}) {
  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-body">{title}</span>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="font-mono text-2xl font-bold text-card-foreground">{value}</div>
      <span className={`text-xs font-semibold font-body ${positive ? 'finance-positive' : 'finance-negative'}`}>
        {positive ? '↑' : '↓'} {change}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { state } = useApp();
  const { goals, budgets, transactions } = state;
  const recentTx = transactions.slice(0, 5);

  const weeklySpending = [
    { day: 'Mon', amount: 45 }, { day: 'Tue', amount: 120 }, { day: 'Wed', amount: 65 },
    { day: 'Thu', amount: 30 }, { day: 'Fri', amount: 210 }, { day: 'Sat', amount: 85 }, { day: 'Sun', amount: 55 },
  ];

  const balanceTrend = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    balance: 12000 + Math.sin(i * 0.3) * 2000 + i * 80 + (Math.random() - 0.5) * 500,
  }));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Net Worth" value="$96,965" change="3.7% this month" icon={DollarSign} positive />
        <StatCard title="Monthly Income" value="$5,100" change="vs $9,670 last month" icon={TrendingUp} positive />
        <StatCard title="Monthly Expenses" value="$2,276" change="vs $5,780 last month" icon={CreditCard} positive={false} />
        <StatCard title="Savings Rate" value="55.4%" change="8.2% improvement" icon={Percent} positive />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="stat-card animate-slide-up-delay-1">
          <h2 className="font-body text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Balance Trend (30 Days)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={balanceTrend}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} interval={6} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, 'Balance']} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#balanceGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card animate-slide-up-delay-1">
          <h2 className="font-body text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Spending Breakdown</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {spendingByCategory.map((_, i) => <Cell key={i} fill={GREEN_SHADES[i % GREEN_SHADES.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'white', color: '#111' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {spendingByCategory.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: GREEN_SHADES[i % GREEN_SHADES.length] }} />
                  <span className="font-body text-card-foreground flex-1 truncate">{cat.name}</span>
                  <span className="font-mono text-muted-foreground">${cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card animate-slide-up-delay-2">
        <h2 className="font-body text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Net Worth Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={netWorthHistory}>
            <defs>
              <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Net Worth']} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            <Area type="monotone" dataKey="netWorth" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#tealGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="stat-card animate-slide-up-delay-2">
          <h2 className="font-body text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Goals Progress</h2>
          <div className="space-y-4">
            {goals.map(g => {
              const pct = Math.min(Math.round((g.saved / g.target) * 100), 100);
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm font-body mb-1">
                    <span className="text-card-foreground">{g.icon} {g.name}</span>
                    <span className="text-muted-foreground font-mono">${g.saved.toLocaleString()} / ${g.target.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{pct}% complete</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="stat-card animate-slide-up-delay-2">
            <h2 className="font-body text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Credit Score</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--income))" strokeWidth="8"
                    strokeDasharray={`${(750 / 850) * 264} 264`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-xl font-bold text-card-foreground">750</span>
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold finance-positive font-body">Excellent</span>
                <p className="text-xs text-muted-foreground font-body mt-1">Top 15% of users</p>
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-up-delay-3">
            <h2 className="font-body text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Spending This Week</h2>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={weeklySpending}>
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`$${v}`, 'Spent']} contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h2 className="font-body text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTx.map(t => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{t.categoryIcon}</span>
                  <div>
                    <div className="text-sm font-body text-card-foreground">{t.merchant}</div>
                    <div className="text-xs text-muted-foreground font-body">{t.account}</div>
                  </div>
                </div>
                <span className={`text-sm font-semibold font-mono ${t.amount > 0 ? 'finance-positive' : 'text-card-foreground'}`}>
                  {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h2 className="font-body text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Budget Overview</h2>
          <div className="space-y-3">
            {budgets.map(b => {
              const pct = Math.round((b.spent / b.budgeted) * 100);
              const over = pct > 100;
              return (
                <div key={b.id}>
                  <div className="flex justify-between text-xs font-body mb-1">
                    <span className="text-card-foreground">{b.icon} {b.name}</span>
                    <span className={`font-mono ${over ? 'finance-negative font-semibold' : 'text-muted-foreground'}`}>
                      ${b.spent} / ${b.budgeted}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${over ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
