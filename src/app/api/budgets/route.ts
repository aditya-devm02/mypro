import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Budget } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    if (!Budget) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const filter = month ? { month } : {};
    const budgets = await Budget.find(filter);
    return NextResponse.json(budgets);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    if (!Budget) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    const data = await req.json();
    // Upsert: update if exists, else create
    const budget = await Budget.findOneAndUpdate(
      { category: data.category, month: data.month },
      data,
      { upsert: true, new: true }
    );
    return NextResponse.json(budget);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    if (!Budget) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    const { _id } = await req.json();
    await Budget.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 