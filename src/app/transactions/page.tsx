"use client";
import { useEffect, useState } from "react";
import { categories, Category } from "@/lib/models";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar, 
  FileText, 
  Tag,
  AlertCircle,
  CheckCircle,
  BarChart3
} from "lucide-react";

interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<Partial<Transaction>>({ date: "", amount: 0, description: "", category: categories[0] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (_err) {
      setError("Failed to load transactions. Please check your MongoDB connection.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  function validate(form: Partial<Transaction>) {
    if (!form.amount || form.amount <= 0) return "Amount must be positive.";
    if (!form.date) return "Date is required.";
    if (!form.description) return "Description is required.";
    if (!form.category) return "Category is required.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(form);
    if (err) return setError(err);
    setError("");
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/transactions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...form, _id: editingId } : form),
      });
      if (!res.ok) {
        throw new Error("Failed to save transaction");
      }
      setForm({ date: "", amount: 0, description: "", category: categories[0] });
      setEditingId(null);
      fetchTransactions();
    } catch (_err) {
      setError("Failed to save transaction. Please check your MongoDB connection.");
      setLoading(false);
    }
  }

  function handleEdit(tx: Transaction) {
    setForm({ ...tx, date: tx.date.slice(0, 10) });
    setEditingId(tx._id!);
  }

  async function handleDelete(_id: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      if (!res.ok) {
        throw new Error("Failed to delete transaction");
      }
      fetchTransactions();
    } catch (_err) {
      setError("Failed to delete transaction. Please check your MongoDB connection.");
      setLoading(false);
    }
  }

  // Monthly expenses for bar chart
  const monthlyData = transactions.reduce((acc, tx) => {
    const month = format(parseISO(tx.date), "yyyy-MM");
    acc[month] = (acc[month] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);
  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Transaction Manager</h1>
        <p className="text-white/80 text-lg">Add, edit, and track your financial transactions</p>
      </motion.div>

      {/* Add/Edit Form */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          {editingId ? "Edit Transaction" : "Add New Transaction"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="relative">
            <span className="absolute left-3 top-3 h-4 w-4 text-white/60 text-lg select-none">₹</span>
            <input
              type="number"
              min={0.01}
              step={0.01}
              placeholder="Amount"
              value={form.amount ?? ""}
              onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
              className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <input
              type="date"
              value={form.date ?? ""}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <input
              placeholder="Description"
              value={form.description ?? ""}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Tag className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
              className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {editingId ? "Update" : "Add"}
            </motion.button>
            {editingId && (
              <motion.button
                type="button"
                onClick={() => { setEditingId(null); setForm({ date: "", amount: 0, description: "", category: categories[0] }); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
            )}
          </div>
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

      {/* Transactions Table */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          All Transactions
        </h2>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-white/60 mt-2">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-amber-500/20 rounded-full">
                      <DollarSign className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{tx.description}</p>
                      <p className="text-white/60 text-sm">{format(parseISO(tx.date), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatINR(tx.amount)}</p>
                      <p className="text-white/60 text-sm">{tx.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleEdit(tx)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 text-amber-400" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(tx._id!)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-white/60" />
              <p className="text-white/60">No transactions found.</p>
              <p className="text-sm mt-1 text-white/40">Add your first transaction above!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Monthly Chart */}
      {chartData.length > 0 && (
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Monthly Expenses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis 
                dataKey="month" 
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
              <Bar dataKey="amount" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  );
} 