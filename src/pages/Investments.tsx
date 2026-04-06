import { investments } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const portfolioHistory = [
  { month: 'Nov', value: 61200 }, { month: 'Dec', value: 62800 },
  { month: 'Jan', value: 64100 }, { month: 'Feb', value: 63500 },
  { month: 'Mar', value: 65900 }, { month: 'Apr', value: 67230 },
];

export default function Investments() {
  const totalValue = investments.reduce((s, i) => s + i.shares * i.price, 0);

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Investments</h1>
      <div className="stat-card">
        <div className="text-xs text-muted-foreground font-body mb-1">Total Portfolio Value</div>
        <div className="font-display text-3xl font-bold text-card-foreground">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
        <span className="text-sm font-semibold finance-positive font-body">↑ 4.1% this month</span>
      </div>

      <div className="stat-card">
        <h2 className="font-display text-lg font-semibold text-card-foreground mb-4">Portfolio Performance</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={portfolioHistory}>
            <defs>
              <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Value']} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#invGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="stat-card overflow-x-auto">
        <h2 className="font-display text-lg font-semibold text-card-foreground mb-4">Holdings</h2>
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Ticker</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Shares</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Price</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Value</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {investments.map(inv => (
              <tr key={inv.ticker} className="border-b border-border last:border-0">
                <td className="py-3 font-semibold text-card-foreground">{inv.ticker}</td>
                <td className="py-3 text-muted-foreground">{inv.name}</td>
                <td className="py-3 text-right text-card-foreground">{inv.shares}</td>
                <td className="py-3 text-right text-card-foreground">${inv.price}</td>
                <td className="py-3 text-right font-semibold text-card-foreground">${(inv.shares * inv.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td className={`py-3 text-right font-semibold ${inv.change > 0 ? 'finance-positive' : 'finance-negative'}`}>
                  {inv.change > 0 ? '+' : ''}{inv.change}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
