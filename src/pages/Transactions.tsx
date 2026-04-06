import { useApp } from '@/context/AppContext';
import { Search, Plus, Download, ChevronRight, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import type { Transaction } from '@/data/mockData';

const categoryOptions = [
  { label: 'Groceries', icon: '🛒' },
  { label: 'Entertainment', icon: '🎬' },
  { label: 'Coffee & Dining', icon: '☕' },
  { label: 'Shopping', icon: '📦' },
  { label: 'Housing', icon: '🏠' },
  { label: 'Bills & Utilities', icon: '⚡' },
  { label: 'Auto & Transport', icon: '⛽' },
  { label: 'Health & Fitness', icon: '💪' },
  { label: 'Travel', icon: '✈️' },
  { label: 'Salary', icon: '💰' },
  { label: 'Side Income', icon: '💻' },
];

export default function Transactions() {
  const { state, dispatch } = useApp();
  const [localSearch, setLocalSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [newTx, setNewTx] = useState({ merchant: '', category: 'Groceries', amount: '', type: 'expense' as 'income' | 'expense', account: 'Chase Checking' });

  const filtered = useMemo(() => {
    let txs = state.transactions;
    const q = (localSearch || state.searchQuery).toLowerCase();
    if (q) txs = txs.filter(t => t.merchant.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    if (state.filters.category) txs = txs.filter(t => t.category === state.filters.category);
    if (state.filters.account) txs = txs.filter(t => t.account === state.filters.account);
    return txs;
  }, [state.transactions, state.searchQuery, state.filters, localSearch]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach(t => {
      const d = t.date;
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(t);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const totalIncome = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const largest = filtered.length > 0 ? filtered.reduce((max, t) => Math.abs(t.amount) > Math.abs(max.amount) ? t : max, filtered[0]) : null;

  const handleExportCSV = () => {
    const csv = 'Date,Merchant,Category,Account,Amount\n' + filtered.map(t =>
      `${t.date},${t.merchant},${t.category},${t.account},${t.amount}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const handleAddTransaction = () => {
    if (!newTx.merchant || !newTx.amount) {
      toast.error('Please fill in all fields');
      return;
    }
    const cat = categoryOptions.find(c => c.label === newTx.category) || categoryOptions[0];
    const account = state.accounts.find(a => a.name === newTx.account);
    const tx: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      merchant: newTx.merchant,
      category: newTx.category,
      categoryIcon: cat.icon,
      account: newTx.account,
      accountColor: account?.color || '#0D5C4F',
      amount: newTx.type === 'expense' ? -Math.abs(parseFloat(newTx.amount)) : Math.abs(parseFloat(newTx.amount)),
      type: newTx.type,
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    setNewTx({ merchant: '', category: 'Groceries', amount: '', type: 'expense', account: 'Chase Checking' });
    setAddOpen(false);
    toast.success('Transaction added');
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    toast.success('Transaction deleted');
  };

  const categories = [...new Set(state.transactions.map(t => t.category))];

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <div className="flex gap-2 flex-wrap">
          {state.role === 'admin' && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4" /> Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">Merchant</label>
                    <input
                      type="text"
                      value={newTx.merchant}
                      onChange={e => setNewTx(p => ({ ...p, merchant: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border border-input font-body"
                      placeholder="e.g. Whole Foods"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-body text-muted-foreground mb-1 block">Type</label>
                      <select
                        value={newTx.type}
                        onChange={e => setNewTx(p => ({ ...p, type: e.target.value as 'income' | 'expense' }))}
                        className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border border-input font-body"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-body text-muted-foreground mb-1 block">Amount</label>
                      <input
                        type="number"
                        value={newTx.amount}
                        onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border border-input font-mono"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">Category</label>
                    <select
                      value={newTx.category}
                      onChange={e => setNewTx(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border border-input font-body"
                    >
                      {categoryOptions.map(c => <option key={c.label} value={c.label}>{c.icon} {c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">Account</label>
                    <select
                      value={newTx.account}
                      onChange={e => setNewTx(p => ({ ...p, account: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border border-input font-body"
                    >
                      {state.accounts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                    </select>
                  </div>
                  <Button className="w-full" onClick={handleAddTransaction}>Add Transaction</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-card rounded-lg border border-input focus:ring-2 focus:ring-primary font-body"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm bg-card border border-input rounded-lg px-3 py-2 font-body"
          value={state.filters.category}
          onChange={e => dispatch({ type: 'SET_FILTER', payload: { key: 'category', value: e.target.value } })}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Transaction list */}
        <div className="space-y-4">
          {grouped.length === 0 && (
            <div className="stat-card text-center py-12">
              <p className="text-muted-foreground font-body text-lg mb-2">No transactions found</p>
              <p className="text-sm text-muted-foreground font-body">Try adjusting your filters</p>
            </div>
          )}
          {grouped.map(([date, txs]) => {
            const dayTotal = txs.reduce((s, t) => s + t.amount, 0);
            return (
              <div key={date}>
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-xs font-semibold text-muted-foreground font-body uppercase tracking-wide">
                    {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className={`text-xs font-semibold font-mono ${dayTotal >= 0 ? 'finance-positive' : 'text-muted-foreground'}`}>
                    {dayTotal >= 0 ? '+' : ''}{dayTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
                <div className="stat-card p-0 divide-y divide-border">
                  {txs.map(t => (
                    <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{t.categoryIcon}</span>
                        <div>
                          <div className="text-sm font-body text-card-foreground font-medium">{t.merchant}</div>
                          <div className="text-xs text-muted-foreground font-body flex items-center gap-2">
                            {t.category}
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accountColor }} />
                            {t.account}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold font-mono ${t.amount > 0 ? 'finance-positive' : 'text-card-foreground'}`}>
                          {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                        {state.role === 'admin' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary sidebar */}
        <div className="stat-card h-fit sticky top-4 space-y-4">
          <h3 className="font-display text-base font-semibold text-card-foreground">Summary</h3>
          <div className="space-y-3 text-sm font-body">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Transactions</span><span className="font-semibold font-mono text-card-foreground">{filtered.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Income</span><span className="font-semibold font-mono finance-positive">+${totalIncome.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Spending</span><span className="font-semibold font-mono finance-negative">-${totalExpense.toLocaleString()}</span></div>
            {largest && <div className="flex justify-between"><span className="text-muted-foreground">Largest</span><span className="font-semibold font-mono text-card-foreground">${Math.abs(largest.amount).toLocaleString()}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Average</span><span className="font-semibold font-mono text-card-foreground">${(totalExpense / Math.max(filtered.filter(t => t.amount < 0).length, 1)).toFixed(0)}</span></div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> Download CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
