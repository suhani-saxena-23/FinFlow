import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Plus, X, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const emojiGrid = ['🛡️', '✈️', '🏖️', '🏠', '🚗', '💍', '🎓', '📱', '💻', '🎯', '🏔️', '🎁', '💰', '🌴', '🚀', '⛵'];
const goalColors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-4))', 'hsl(var(--chart-2))', 'hsl(var(--chart-5))', 'hsl(var(--chart-6))'];

function getGoalStatus(pct: number) {
  if (pct >= 60) return { label: 'On track', color: 'hsl(var(--income))' };
  if (pct >= 30) return { label: 'Behind', color: 'hsl(var(--warning))' };
  return { label: 'At risk', color: 'hsl(var(--expense))' };
}

function getProgressColor(pct: number) {
  if (pct >= 60) return 'hsl(var(--primary))';
  if (pct >= 30) return 'hsl(var(--warning))';
  return 'hsl(var(--expense))';
}

export default function Goals() {
  const { state, dispatch } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [drawerGoalId, setDrawerGoalId] = useState<string | null>(null);
  const [contribAmount, setContribAmount] = useState('');
  const [newGoal, setNewGoal] = useState({ name: '', icon: '🎯', target: '', deadline: '' });

  const drawerGoal = state.goals.find(g => g.id === drawerGoalId);
  const goalHistory = state.goalHistory.filter(h => h.goalId === drawerGoalId);

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) {
      toast.error('Fill in name and target amount');
      return;
    }
    dispatch({
      type: 'ADD_GOAL',
      payload: {
        id: crypto.randomUUID(),
        name: newGoal.name,
        icon: newGoal.icon,
        target: parseFloat(newGoal.target),
        saved: 0,
      },
    });
    setNewGoal({ name: '', icon: '🎯', target: '', deadline: '' });
    setAddOpen(false);
    toast.success('Goal created!');
  };

  const handleContribute = () => {
    const amt = parseFloat(contribAmount);
    if (!amt || amt <= 0 || !drawerGoalId || !drawerGoal) return;
    // Cap contribution so saved doesn't exceed target
    const maxAdd = drawerGoal.target - drawerGoal.saved;
    const actualAmt = Math.min(amt, Math.max(maxAdd, 0));
    if (actualAmt <= 0) {
      toast.info('Goal is already fully funded!');
      setContribAmount('');
      return;
    }
    dispatch({ type: 'CONTRIBUTE_GOAL', payload: { goalId: drawerGoalId, amount: actualAmt } });
    setContribAmount('');
    toast.success(`+$${actualAmt.toLocaleString()} added`);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(contribAmount);
    if (!amt || amt <= 0 || !drawerGoalId) return;
    dispatch({ type: 'WITHDRAW_GOAL', payload: { goalId: drawerGoalId, amount: amt } });
    setContribAmount('');
    toast.success(`-$${amt.toLocaleString()} withdrawn`);
  };

  const handleDeleteGoal = () => {
    if (!drawerGoalId) return;
    dispatch({ type: 'DELETE_GOAL', payload: drawerGoalId });
    setDrawerGoalId(null);
    toast.success('Goal deleted');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.goals.map((g, i) => {
          const pct = Math.min(Math.round((g.saved / g.target) * 100), 100);
          const status = getGoalStatus(pct);
          const progressColor = getProgressColor(pct);
          return (
            <div
              key={g.id}
              className="stat-card text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setDrawerGoalId(g.id)}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl" style={{ backgroundColor: `${goalColors[i % goalColors.length]}20` }}>
                {g.icon}
              </div>
              <h3 className="font-body text-sm font-semibold text-card-foreground mb-1">{g.name}</h3>
              <span className="inline-block text-xs font-body px-2 py-0.5 rounded-full mb-3" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
                {status.label}
              </span>
              <div className="relative w-24 h-24 mx-auto my-2">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={progressColor} strokeWidth="8"
                    strokeDasharray={`${(Math.min(pct, 100) / 100) * 264} 264`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease, stroke 0.3s ease' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-lg font-bold text-card-foreground">{pct}%</span>
                </div>
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                ${g.saved.toLocaleString()} <span className="text-xs font-body">of</span> ${g.target.toLocaleString()}
              </div>
            </div>
          );
        })}

        {state.role === 'admin' && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <button className="rounded-xl border-2 border-dashed border-border p-5 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer min-h-[220px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-body text-muted-foreground font-medium">New Goal</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1 block">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={e => setNewGoal(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border border-input font-body"
                    placeholder="e.g. Goa trip"
                  />
                </div>
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-2 block">Pick an Icon</label>
                  <div className="grid grid-cols-8 gap-2">
                    {emojiGrid.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setNewGoal(p => ({ ...p, icon: emoji }))}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl hover:bg-secondary transition-colors ${newGoal.icon === emoji ? 'bg-primary/10 ring-2 ring-primary' : ''}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">Target Amount</label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border border-input font-mono"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">Deadline</label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border border-input font-body"
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleAddGoal}>Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Contribution Drawer */}
      {drawerGoal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setDrawerGoalId(null)} />
          <div className="relative w-full max-w-md bg-card border-l border-border h-full overflow-y-auto animate-slide-in-right shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-card-foreground">{drawerGoal.icon} {drawerGoal.name}</h2>
                <button onClick={() => setDrawerGoalId(null)} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {(() => {
                const pct = Math.min(Math.round((drawerGoal.saved / drawerGoal.target) * 100), 100);
                const progressColor = getProgressColor(pct);
                const status = getGoalStatus(pct);
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-2xl font-bold text-card-foreground">{pct}%</span>
                      <span className="text-xs font-body px-2 py-0.5 rounded-full" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: progressColor }}
                      />
                    </div>
                    <div className="flex justify-between text-sm font-mono mt-2 text-muted-foreground">
                      <span>${drawerGoal.saved.toLocaleString()}</span>
                      <span>${drawerGoal.target.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-3">
                <label className="text-sm font-body text-muted-foreground block">Amount</label>
                <input
                  type="number"
                  value={contribAmount}
                  onChange={e => setContribAmount(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-secondary rounded-lg border border-input font-mono text-center text-lg"
                  placeholder="0.00"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleContribute} className="gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                  <Button variant="outline" onClick={handleWithdraw} className="gap-1">
                    <Minus className="w-4 h-4" /> Withdraw
                  </Button>
                </div>
              </div>

              {goalHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold font-body text-card-foreground mb-3">History</h3>
                  <div className="space-y-2">
                    {goalHistory.slice().reverse().map(h => (
                      <div key={h.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-xs text-muted-foreground font-body">
                          {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-sm font-mono font-semibold ${h.type === 'add' ? 'finance-positive' : 'finance-negative'}`}>
                          {h.type === 'add' ? '+' : '-'}${h.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {state.role === 'admin' && (
                <div className="pt-4 border-t border-border">
                  <Button variant="destructive" className="w-full" onClick={handleDeleteGoal}>
                    Delete Goal
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
