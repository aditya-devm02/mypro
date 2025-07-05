import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Transaction } from '@/lib/models';

export async function GET() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected, fetching transactions...');
    if (!Transaction) {
      console.error('Transaction model is null');
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    const transactions = await Transaction.find().sort({ date: -1 });
    console.log(`Found ${transactions.length} transactions`);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Connecting to database for POST...');
    await connectToDatabase();
    console.log('Database connected, creating transaction...');
    if (!Transaction) {
      console.error('Transaction model is null');
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    const data = await req.json();
    console.log('Transaction data:', data);
    const transaction = await Transaction.create(data);
    console.log('Transaction created:', transaction);
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    if (!Transaction) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    const data = await req.json();
    const { _id, ...update } = data;
    const transaction = await Transaction.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('PUT /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    if (!Transaction) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    const { _id } = await req.json();
    await Transaction.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
} 