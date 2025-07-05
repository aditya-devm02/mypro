import { Schema, models, model } from 'mongoose';

export const categories = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Health',
  'Other',
] as const;

export type Category = typeof categories[number];

const TransactionSchema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: categories, required: true },
}, { timestamps: true });

const BudgetSchema = new Schema({
  category: { type: String, enum: categories, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // Format: YYYY-MM
}, { timestamps: true });

// Only create models on server side
const Transaction = typeof window === 'undefined' 
  ? (models.Transaction || model('Transaction', TransactionSchema))
  : null;

const Budget = typeof window === 'undefined'
  ? (models.Budget || model('Budget', BudgetSchema))
  : null;

export { Transaction, Budget }; 