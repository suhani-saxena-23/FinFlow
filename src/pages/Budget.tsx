import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

export default function Budget() {
  const { state } = useApp();
  const { budgets, role } = state;
  const totalBudgeted = budgets.reduce((s, b) => s + b.budgeted, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalBudgeted - totalSpent;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="text-xs text-muted-foreground font-body mb-1">Total Budgeted</div>
          <div className="font-display text-2xl font-bold text-card-foreground">${totalBudgeted.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-muted-foreground font-body mb-1">Total Spent</div>
          <div className="font-display text-2xl font-bold text-card-foreground">${totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-muted-foreground font-body mb-1">Remaining</div>
          <div className={`font-display text-2xl font-bold ${remaining >= 0 ? 'finance-positive' : 'finance-negative'}`}>${remaining.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {budgets.map(b => {
          const pct = Math.round((b.spent / b.budgeted) * 100);
          const over = pct > 100;
          const rem = b.budgeted - b.spent;
          return (
            <div key={b.id} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{b.icon}</span>
                  <span className="font-body font-semibold text-card-foreground">{b.name}</span>
                </div>
                {role === 'admin' ? (
                  <button className="text-xs text-primary font-body hover:underline" onClick={() => toast.info('Edit budget coming soon')}>Edit</button>
                ) : null}
              </div>
              <div className="flex justify-between text-sm font-body mb-2">
                <span className="text-muted-foreground">${b.spent.toLocaleString()} of ${b.budgeted.toLocaleString()}</span>
                <span className={over ? 'finance-negative font-semibold' : 'text-muted-foreground'}>
                  {over ? `$${Math.abs(rem).toFixed(0)} over` : `$${rem.toFixed(0)} left`}
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${over ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
