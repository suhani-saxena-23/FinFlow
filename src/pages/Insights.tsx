import { useApp } from '@/context/AppContext';
import { monthlyIncome, spendingByCategory } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Flame, TrendingDown, Lightbulb, Trophy, AlertTriangle } from 'lucide-react';

export default function Insights() {
  const { state } = useApp();
  const { budgets } = state;
  const overBudget = budgets.filter(b => b.spent > b.budgeted);
  const topCategory = spendingByCategory.reduce((a, b) => a.value > b.value ? a : b);

  const comparisonData = spendingByCategory.map(c => ({
    name: c.name,
    thisMonth: c.value,
    lastMonth: Math.round(c.value * (0.8 + Math.random() * 0.4)),
  }));

  return (
    <div className="max-w-5xl space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Top spending */}
        <div className="stat-card border-l-4 border-finance-warning">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-finance-warning" />
            <span className="text-sm font-semibold font-body text-card-foreground">Highest Spending Category</span>
          </div>
          <div className="font-body text-2xl font-bold text-card-foreground">{topCategory.name}</div>
          <div className="text-lg font-semibold finance-negative font-body">${topCategory.value.toLocaleString()}</div>
        </div>

        {/* Savings highlight */}
        <div className="stat-card border-l-4 border-finance-income">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-finance-income" />
            <span className="text-sm font-semibold font-body text-card-foreground">Best Savings Month</span>
          </div>
          <div className="font-body text-2xl font-bold text-card-foreground">January</div>
          <div className="text-lg font-semibold finance-positive font-body">$3,500 saved (39%)</div>
        </div>

        {/* Spending tip */}
        <div className="stat-card border-l-4 border-accent">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold font-body text-card-foreground">Spending Tip</span>
          </div>
          <p className="text-sm text-muted-foreground font-body">You spent 23% more on Dining this month compared to last month. Consider setting a tighter budget.</p>
        </div>

        {/* Over budget warnings */}
        <div className="stat-card border-l-4 border-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-sm font-semibold font-body text-card-foreground">Over Budget</span>
          </div>
          {overBudget.length > 0 ? (
            <div className="space-y-1">
              {overBudget.map(b => (
                <div key={b.id} className="text-sm font-body">
                  <span className="text-card-foreground">{b.icon} {b.name}</span>
                  <span className="finance-negative font-semibold ml-2">${(b.spent - b.budgeted).toFixed(0)} over</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-body">All categories within budget! 🎉</p>
          )}
        </div>
      </div>

      {/* Month comparison */}
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-primary" />
          <h2 className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wider">Month-over-Month Comparison</h2>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `$${v}`} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            <Bar dataKey="lastMonth" name="Last Month" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.4} />
            <Bar dataKey="thisMonth" name="This Month" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expense trend */}
      <div className="stat-card">
        <h2 className="font-body text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Income vs Expense Trend</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyIncome}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            <Line type="monotone" dataKey="income" stroke="hsl(var(--income))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--income))' }} />
            <Line type="monotone" dataKey="expenses" stroke="hsl(var(--expense))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--expense))' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
