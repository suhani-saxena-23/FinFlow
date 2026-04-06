import { useApp } from '@/context/AppContext';
import { netWorthHistory } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function Accounts() {
  const { state } = useApp();
  const { accounts, role } = state;

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0));
  const netWorth = totalAssets - totalLiabilities;

  const groups = [
    { label: 'Cash', types: ['checking', 'savings'] as const },
    { label: 'Investments', types: ['investment'] as const },
    { label: 'Credit Cards', types: ['credit'] as const },
  ];

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Accounts</h1>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-display text-3xl font-bold text-foreground">${netWorth.toLocaleString()}</span>
            <span className="text-sm font-semibold finance-positive font-body">↑ 3.7% · 1 month</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4" /> Refresh</Button>
          {role === 'admin' ? (
            <Button size="sm"><Plus className="w-4 h-4" /> Add Account</Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => toast('Switch to Admin role to add accounts')}>
              <Plus className="w-4 h-4" /> Add Account
            </Button>
          )}
        </div>
      </div>

      {/* Net Worth Chart */}
      <div className="stat-card">
        <h2 className="font-display text-lg font-semibold text-card-foreground mb-4">Net Worth Performance</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={netWorthHistory}>
            <defs>
              <linearGradient id="tealGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            <Area type="monotone" dataKey="netWorth" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#tealGrad2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Account Groups */}
        <div className="space-y-4">
          {groups.map(g => {
            const accts = accounts.filter(a => (g.types as readonly string[]).includes(a.type));
            const total = accts.reduce((s, a) => s + a.balance, 0);
            return (
              <div key={g.label} className="stat-card">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-display text-base font-semibold text-card-foreground">{g.label}</h3>
                  <span className="font-display text-lg font-bold text-card-foreground">
                    {total < 0 && '-'}${Math.abs(total).toLocaleString()}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {accts.map(a => (
                    <div key={a.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                        <div>
                          <div className="text-sm font-body text-card-foreground font-medium">{a.name}</div>
                          <div className="text-xs text-muted-foreground font-body">{a.institution}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold font-body text-card-foreground">
                          {a.balance < 0 && '-'}${Math.abs(a.balance).toLocaleString()}
                        </div>
                        <span className={`text-xs font-body ${a.change > 0 ? 'finance-positive' : 'finance-negative'}`}>
                          {a.change > 0 ? '+' : ''}{a.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="stat-card h-fit sticky top-4 space-y-4">
          <h3 className="font-display text-base font-semibold text-card-foreground">Summary</h3>
          <div className="space-y-3 text-sm font-body">
            <div>
              <div className="text-muted-foreground mb-1">Assets</div>
              <div className="font-display text-xl font-bold finance-positive">${totalAssets.toLocaleString()}</div>
              <div className="h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Liabilities</div>
              <div className="font-display text-xl font-bold finance-negative">-${totalLiabilities.toLocaleString()}</div>
              <div className="h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-destructive rounded-full" style={{ width: `${(totalLiabilities / totalAssets) * 100}%` }} />
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="text-muted-foreground mb-1">Net Worth</div>
              <div className="font-display text-2xl font-bold text-card-foreground">${netWorth.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
