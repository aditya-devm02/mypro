"use client";
import { useEffect, useState } from "react";
import { categories, Category } from "@/lib/models";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: Category;
}

const COLORS = ["#d97706", "#059669", "#dc2626", "#7c3aed", "#0891b2", "#be185d", "#ca8a04"];

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

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load transactions. Please check your MongoDB connection.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const byCategory = categories.map(cat => ({
    category: cat,
    amount: transactions.filter(tx => tx.category === cat).reduce((sum, tx) => sum + tx.amount, 0),
  })).filter(c => c.amount > 0);
  const recent = transactions.slice(0, 5);

  const topCategory = byCategory[0]?.category || "None";
  const avgTransaction = transactions.length > 0 ? total / transactions.length : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Financial Dashboard</h1>
        <p className="text-white/80 text-lg">Track your spending and stay on budget</p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 flex items-center space-x-3"
        >
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-200">{error}</span>
        </motion.div>
      )}

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-2xl hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-white">{formatINR(total)}</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-full">
              <DollarSign className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-2xl hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Top Category</p>
              <p className="text-2xl font-bold text-white">{topCategory}</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-2xl hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Transactions</p>
              <p className="text-3xl font-bold text-white">{transactions.length}</p>
            </div>
            <div className="p-3 bg-violet-500/20 rounded-full">
              <CreditCard className="h-6 w-6 text-violet-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-2xl hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Avg Transaction</p>
              <p className="text-2xl font-bold text-white">{formatINR(avgTransaction)}</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts and Recent Transactions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 rounded-2xl hover-lift"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Category Breakdown
          </h2>
          {byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={byCategory} 
                  dataKey="amount" 
                  nameKey="category" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  label={({ category, percent = 0 }) => `${category} ${(percent * 100).toFixed(0)}%`}
                >
                  {byCategory.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#1e293b',
                    fontWeight: 500,
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px rgba(30,41,59,0.08)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-white/60 py-8">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No data available</p>
            </div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 rounded-2xl hover-lift"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Recent Transactions
          </h2>
          {loading ? (
            <div className="text-center text-white/60 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2">Loading...</p>
            </div>
          ) : recent.length > 0 ? (
            <div className="space-y-3">
              {recent.map((tx, index) => (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-500/20 rounded-full">
                      <DollarSign className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{tx.description}</p>
                      <p className="text-white/60 text-sm">{format(parseISO(tx.date), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatINR(tx.amount)}</p>
                    <p className="text-white/60 text-sm">{tx.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/60 py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet.</p>
              <p className="text-sm mt-1">Add your first transaction to get started!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
