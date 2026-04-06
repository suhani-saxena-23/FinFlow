import { useState, useMemo } from 'react';
import { spendingByCategory, monthlyIncome } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const tabs = ['Cash Flow', 'Spending', 'Income'] as const;

const GREEN_SHADES = [
  'hsl(164, 72%, 21%)',
  'hsl(162, 60%, 30%)',
  'hsl(160, 55%, 38%)',
  'hsl(158, 50%, 46%)',
  'hsl(155, 45%, 54%)',
  'hsl(152, 40%, 62%)',
];

interface FlowChild {
  name: string;
  value: number;
  icon: string;
}

interface FlowCategory {
  name: string;
  value: number;
  pct: number;
  icon: string;
  color: string;
  children?: FlowChild[];
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Cash Flow');
  const { state } = useApp();

  const totalIncome = state.transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = state.transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const netIncome = totalIncome - totalExpense;
  const savingsRate = ((netIncome / totalIncome) * 100).toFixed(1);

  const cashFlowData: FlowCategory[] = useMemo(() => {
    const savings = netIncome;
    const housing = totalExpense * 0.38;
    const financial = totalExpense * 0.18;
    const bills = totalExpense * 0.16;
    const food = totalExpense * 0.12;
    const travel = totalExpense * 0.16;
    return [
      { name: 'Savings', value: Math.round(savings), pct: +(savings / totalIncome * 100).toFixed(1), icon: '💰', color: 'hsl(164, 72%, 21%)' },
      { name: 'Housing', value: Math.round(housing), pct: +(housing / totalIncome * 100).toFixed(1), icon: '🏠', color: 'hsl(162, 60%, 30%)', children: [
        { name: 'Mortgage', value: Math.round(housing * 0.87), icon: '🏦' },
        { name: 'Home Improvement', value: Math.round(housing * 0.13), icon: '🔧' },
      ]},
      { name: 'Financial', value: Math.round(financial), pct: +(financial / totalIncome * 100).toFixed(1), icon: '💳', color: 'hsl(160, 55%, 38%)', children: [
        { name: 'Loan Repayment', value: Math.round(financial * 0.67), icon: '🏧' },
        { name: 'Insurance', value: Math.round(financial * 0.33), icon: '🛡️' },
      ]},
      { name: 'Bills & Utilities', value: Math.round(bills), pct: +(bills / totalIncome * 100).toFixed(1), icon: '⚡', color: 'hsl(158, 50%, 46%)', children: [
        { name: 'Phone & Internet', value: Math.round(bills * 0.55), icon: '📱' },
        { name: 'Utilities', value: Math.round(bills * 0.45), icon: '💡' },
      ]},
      { name: 'Food & Dining', value: Math.round(food), pct: +(food / totalIncome * 100).toFixed(1), icon: '🍽️', color: 'hsl(155, 45%, 54%)' },
      { name: 'Travel & Other', value: Math.round(travel), pct: +(travel / totalIncome * 100).toFixed(1), icon: '✈️', color: 'hsl(152, 40%, 62%)' },
    ];
  }, [totalIncome, totalExpense, netIncome]);

  // Bubble data for spending
  const bubbleData = useMemo(() => {
    const maxVal = Math.max(...spendingByCategory.map(c => c.value));
    return spendingByCategory.map((cat, i) => ({
      ...cat,
      radius: 30 + (cat.value / maxVal) * 50,
      color: GREEN_SHADES[i % GREEN_SHADES.length],
    }));
  }, []);

  return (
    <div className="max-w-7xl space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL INCOME', value: `$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, cls: 'finance-positive' },
          { label: 'TOTAL EXPENSES', value: `$${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, cls: 'finance-negative' },
          { label: 'TOTAL NET INCOME', value: `$${netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, cls: 'text-card-foreground' },
          { label: 'SAVINGS RATE', value: `${savingsRate}%`, cls: 'text-card-foreground' },
        ].map(s => (
          <div key={s.label} className="stat-card text-center">
            <div className={`font-mono text-xl font-bold ${s.cls}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground font-body mt-1 tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-body rounded-md transition-colors ${
              activeTab === tab ? 'bg-card text-card-foreground shadow-sm font-medium' : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Cash Flow' && (
        <div className="stat-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">CASH FLOW</div>
              <div className="text-sm font-body text-card-foreground">
                {new Date(state.transactions[state.transactions.length - 1]?.date || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – {new Date(state.transactions[0]?.date || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-body px-3 py-1 bg-secondary rounded-md">By category & group</span>
          </div>

          {/* Clean horizontal flow layout */}
          <div className="space-y-1">
            {/* Income header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 w-40">
                <span className="text-lg">💰</span>
                <div>
                  <div className="text-sm font-semibold font-body text-card-foreground">Income</div>
                  <div className="font-mono text-xs text-muted-foreground">${totalIncome.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex-1 h-8 rounded-lg overflow-hidden flex">
                {cashFlowData.map((cat, i) => (
                  <div
                    key={cat.name}
                    className="h-full relative group cursor-pointer transition-opacity hover:opacity-80"
                    style={{
                      width: `${cat.pct}%`,
                      backgroundColor: cat.color,
                      minWidth: '2px',
                    }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="text-xs font-semibold text-card-foreground">{cat.icon} {cat.name}</div>
                      <div className="font-mono text-xs text-foreground">${cat.value.toLocaleString()} ({cat.pct}%)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="space-y-3 pl-4">
              {cashFlowData.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-44 shrink-0">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-body text-card-foreground">{cat.icon} {cat.name}</span>
                    </div>
                    <div className="flex-1 h-5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                    <div className="w-28 text-right shrink-0">
                      <span className="font-mono text-sm font-semibold text-card-foreground">${cat.value.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground ml-1">({cat.pct}%)</span>
                    </div>
                  </div>

                  {/* Sub-categories */}
                  {cat.children && (
                    <div className="ml-12 mt-2 space-y-1.5">
                      {cat.children.map(child => {
                        const childPct = ((child.value / totalIncome) * 100).toFixed(1);
                        return (
                          <div key={child.name} className="flex items-center gap-4">
                            <div className="flex items-center gap-2 w-40 shrink-0">
                              <span className="text-xs">{child.icon}</span>
                              <span className="text-xs font-body text-muted-foreground">{child.name}</span>
                            </div>
                            <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${childPct}%`, backgroundColor: cat.color, opacity: 0.6 }}
                              />
                            </div>
                            <div className="w-28 text-right shrink-0">
                              <span className="font-mono text-xs text-muted-foreground">${child.value.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground ml-1">({childPct}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Spending' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="stat-card">
              <h2 className="font-body text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Spending by Category</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value" paddingAngle={3}>
                    {spendingByCategory.map((_, i) => <Cell key={i} fill={GREEN_SHADES[i % GREEN_SHADES.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Amount']} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'white', color: '#111' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="stat-card">
              <h2 className="font-body text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Category Breakdown</h2>
              <div className="space-y-3">
                {spendingByCategory.map((cat, i) => {
                  const pct = ((cat.value / totalExpense) * 100).toFixed(1);
                  return (
                    <div key={cat.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: GREEN_SHADES[i] }} />
                      <span className="text-sm font-body text-card-foreground flex-1">{cat.name}</span>
                      <span className="text-sm font-semibold font-mono text-foreground">${cat.value.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground font-mono w-12 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bubble chart */}
          <div className="stat-card">
            <h2 className="font-body text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">Spending Bubbles</h2>
            <div className="flex flex-wrap items-center justify-center gap-3 py-4">
              {bubbleData
                .sort((a, b) => b.value - a.value)
                .map((b) => (
                <div
                  key={b.name}
                  className="rounded-full flex flex-col items-center justify-center text-white font-body shrink-0 transition-transform hover:scale-110 cursor-pointer shadow-lg"
                  style={{
                    width: b.radius * 2,
                    height: b.radius * 2,
                    backgroundColor: b.color,
                  }}
                >
                  <span className="text-xs font-semibold leading-tight text-center px-1">{b.name}</span>
                  <span className="font-mono text-[11px] font-bold opacity-90">${b.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Income' && (
        <div className="stat-card">
          <h2 className="font-body text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Income Over Time</h2>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={monthlyIncome}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--income))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--income))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="income" name="Income" stroke="hsl(var(--income))" strokeWidth={2.5} fill="url(#incomeGrad)" dot={{ fill: 'hsl(var(--income))', r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }} activeDot={{ r: 7 }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(var(--expense))" strokeWidth={2} fill="none" strokeDasharray="6 3" dot={{ fill: 'hsl(var(--expense))', r: 4, strokeWidth: 2, stroke: 'hsl(var(--card))' }} />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Salary & Wages', pct: 78, amount: totalIncome * 0.78 },
              { label: 'Side Income', pct: 15, amount: totalIncome * 0.15 },
              { label: 'Investment Income', pct: 7, amount: totalIncome * 0.07 },
            ].map((src, i) => (
              <div key={src.label} className="p-4 bg-secondary rounded-xl">
                <div className="text-xs text-muted-foreground font-body mb-1">Income Source</div>
                <div className="text-sm font-semibold text-card-foreground font-body">{src.label}</div>
                <div className="font-mono text-lg font-bold finance-positive mt-1">${src.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                <div className="h-2 bg-muted rounded-full mt-3 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${src.pct}%`, backgroundColor: GREEN_SHADES[i] }} />
                </div>
                <div className="text-xs font-mono text-muted-foreground mt-1">{src.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
