"use client";
import { useEffect, useState } from "react";
import { categories, Category } from "@/lib/models";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Tag,
  AlertCircle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Target
} from "lucide-react";

interface Budget {
  _id?: string;
  category: Category;
  amount: number;
  month: string; // YYYY-MM
}

interface Transaction {
  amount: number;
  date: string;
  category: Category;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function formatINR(amount: number) {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<Partial<Budget>>({ category: categories[0], amount: 0, month: format(new Date(), "yyyy-MM") });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, []);

  async function fetchBudgets() {
    setLoading(true);
    try {
      const res = await fetch(`/api/budgets?month=${form.month}`);
      if (!res.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const data = await res.json();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (_err) {
      setError("Failed to load budgets. Please check your MongoDB connection.");
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransactions() {
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (_err) {
      setTransactions([]);
    }
  }

  function validate(form: Partial<Budget>) {
    if (!form.amount || form.amount <= 0) return "Amount must be positive.";
    if (!form.category) return "Category is required.";
    if (!form.month) return "Month is required.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(form);
    if (err) return setError(err);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error("Failed to save budget");
      }
      setForm({ category: categories[0], amount: 0, month: form.month });
      fetchBudgets();
    } catch (_err) {
      setError("Failed to save budget. Please check your MongoDB connection.");
      setLoading(false);
    }
  }

  async function handleDelete(_id: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      if (!res.ok) {
        throw new Error("Failed to delete budget");
      }
      fetchBudgets();
    } catch (_err) {
      setError("Failed to delete budget. Please check your MongoDB connection.");
      setLoading(false);
    }
  }

  // Budget vs actual data
  const actuals: Record<string, number> = {};
  transactions.forEach(tx => {
    const txMonth = tx.date.slice(0, 7);
    if (txMonth === form.month) {
      actuals[tx.category] = (actuals[tx.category] || 0) + tx.amount;
    }
  });
  const chartData = categories.map(cat => ({
    category: cat,
    Budget: budgets.find(b => b.category === cat)?.amount || 0,
    Actual: actuals[cat] || 0,
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Budget Manager</h1>
        <p className="text-white/80 text-lg">Set budgets and track your spending goals</p>
      </motion.div>

      {/* Add Budget Form */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Set Monthly Budget
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <Tag className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
              className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-3 h-4 w-4 text-white/60 text-lg select-none">₹</span>
            <input
              type="number"
              min={0.01}
              step={0.01}
              placeholder="Budget Amount"
              value={form.amount ?? ""}
              onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
              className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <input
              type="month"
              value={form.month ?? ""}
              onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
              className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            Set Budget
          </motion.button>
        </form>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-4 flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budgets List */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Current Budgets
        </h2>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-white/60 mt-2">Loading budgets...</p>
            </div>
          ) : budgets.length > 0 ? (
            <div className="space-y-3">
              {budgets.map((budget, index) => (
                <motion.div
                  key={budget._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-emerald-500/20 rounded-full">
                      <Target className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{budget.category}</p>
                      <p className="text-white/60 text-sm">{budget.month}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatINR(budget.amount)}</p>
                      <p className="text-white/60 text-sm">Monthly Budget</p>
                    </div>
                    <motion.button
                      onClick={() => handleDelete(budget._id!)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-white/60" />
              <p className="text-white/60">No budgets found for this month.</p>
              <p className="text-sm mt-1 text-white/40">Set your first budget above!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Budget vs Actual Chart */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Budget vs Actual
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="category" 
              tick={{ fill: 'white' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <YAxis 
              tick={{ fill: 'white' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #d1d5db', borderRadius: '8px', color: '#1e293b', fontWeight: 500, fontSize: '1rem', boxShadow: '0 2px 8px rgba(30,41,59,0.08)' }}
            />
            <Legend 
              wrapperStyle={{ color: 'white' }}
            />
            <Bar dataKey="Budget" fill="#d97706" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Spending Insights */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Spending Insights
        </h2>
        <div className="space-y-3">
          {categories.map(cat => {
            const budget = budgets.find(b => b.category === cat)?.amount || 0;
            const actual = actuals[cat] || 0;
            if (!budget) return null;
            const percent = ((actual / budget) * 100).toFixed(0);
            const isOverBudget = actual > budget;
            
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isOverBudget ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    isOverBudget ? 'bg-red-500/20' : 'bg-emerald-500/20'
                  }`}>
                    {isOverBudget ? (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{cat}</p>
                    <p className="text-white/60 text-sm">
                      Spent {formatINR(actual)} of {formatINR(budget)} ({percent}%)
                    </p>
                  </div>
                </div>
                {isOverBudget && (
                  <span className="text-red-400 text-sm font-medium">Over Budget!</span>
                )}
              </motion.div>
            );
          })}
          {budgets.length === 0 && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-white/60" />
              <p className="text-white/60">No budgets set for this month.</p>
              <p className="text-sm mt-1 text-white/40">Set budgets to see spending insights!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 