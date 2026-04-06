import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { transactions as mockTransactions, accounts as mockAccounts, budgets as mockBudgets, goals as mockGoals, Transaction, Account, BudgetCategory, Goal } from '@/data/mockData';

type Role = 'viewer' | 'admin';

export interface GoalHistory {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  type: 'add' | 'withdraw';
}

interface AppState {
  transactions: Transaction[];
  accounts: Account[];
  budgets: BudgetCategory[];
  goals: Goal[];
  goalHistory: GoalHistory[];
  role: Role;
  darkMode: boolean;
  searchQuery: string;
  filters: {
    category: string;
    account: string;
    type: string;
  };
}

type Action =
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTER'; payload: { key: string; value: string } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'CONTRIBUTE_GOAL'; payload: { goalId: string; amount: number } }
  | { type: 'WITHDRAW_GOAL'; payload: { goalId: string; amount: number } };

const initialState: AppState = {
  transactions: mockTransactions,
  accounts: mockAccounts,
  budgets: mockBudgets,
  goals: mockGoals,
  goalHistory: [],
  role: (localStorage.getItem('finflow-role') as Role) || 'admin',
  darkMode: localStorage.getItem('finflow-dark') === 'true',
  searchQuery: '',
  filters: { category: '', account: '', type: '' },
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      localStorage.setItem('finflow-role', action.payload);
      return { ...state, role: action.payload };
    case 'TOGGLE_DARK_MODE': {
      const next = !state.darkMode;
      localStorage.setItem('finflow-dark', String(next));
      return { ...state, darkMode: next };
    }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.payload.key]: action.payload.value } };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'RESET_FILTERS':
      return { ...state, filters: { category: '', account: '', type: '' }, searchQuery: '' };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'CONTRIBUTE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.goalId ? { ...g, saved: g.saved + action.payload.amount } : g),
        goalHistory: [...state.goalHistory, {
          id: crypto.randomUUID(),
          goalId: action.payload.goalId,
          amount: action.payload.amount,
          date: new Date().toISOString(),
          type: 'add',
        }],
      };
    case 'WITHDRAW_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.goalId ? { ...g, saved: Math.max(0, g.saved - action.payload.amount) } : g),
        goalHistory: [...state.goalHistory, {
          id: crypto.randomUUID(),
          goalId: action.payload.goalId,
          amount: action.payload.amount,
          date: new Date().toISOString(),
          type: 'withdraw',
        }],
      };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
