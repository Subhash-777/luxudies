// ============================================
// LUXUDIES - Razorpay Verify Payment API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature', success: false },
        { status: 400 }
      );
    }

    // Update order in Supabase
    const supabaseAdmin = await (await import('@/lib/supabase/server')).createAdminClient();
    
    // First, find the order by razorpay_order_id
    const { data: order, error: findError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (findError || !order) {
      throw new Error(`Order not found for razorpay_order_id: ${razorpay_order_id}`);
    }

    // Update the status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
      })
      .eq('id', order.id);

    if (updateError) {
      throw new Error(`Failed to update order status: ${updateError.message}`);
    }

    // Add entry to order_status_history
    await supabaseAdmin.from('order_status_history').insert({
      order_id: order.id,
      status: 'confirmed',
      note: 'Payment verified and order confirmed',
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', success: false },
      { status: 500 }
    );
  }
}
