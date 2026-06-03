// ============================================
// LUXUDIES - Razorpay Create Order API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const razorpay = getRazorpay();
    const body = await request.json();
    const { amount, items, address } = body;

    if (!amount || !items || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        order_number: orderNumber,
        customer_name: address.fullName,
        customer_email: address.email,
        customer_phone: address.phone,
        items_count: items.length.toString(),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
