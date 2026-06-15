// ============================================
// LUXUDIES - Razorpay Create Order API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/utils';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const razorpay = getRazorpay();
    const body = await request.json();
    const { subtotal, shippingCost, total, items, address } = body;

    if (!total || !items || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user id if logged in
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    const orderNumber = generateOrderNumber();

    const order = await razorpay.orders.create({
      amount: Math.round(total * 100), // Convert to paise
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

    // Save pending order to database
    const supabaseAdmin = await createAdminClient();
    const { data: newOrder, error: orderError } = await supabaseAdmin.from('orders').insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_name: address.fullName,
      customer_email: address.email,
      customer_phone: address.phone,
      customer_alternate_phone: address.alternatePhone || null,
      shipping_line1: address.line1,
      shipping_line2: address.line2 || null,
      shipping_city: address.city,
      shipping_state: address.state,
      shipping_pincode: address.pincode,
      subtotal: subtotal,
      shipping_cost: shippingCost,
      discount: 0,
      total: total,
      payment_method: 'razorpay',
      payment_status: 'pending',
      razorpay_order_id: order.id,
      status: 'pending'
    }).select('id').single();

    if (orderError || !newOrder) {
      throw new Error(`Failed to save order to db: ${orderError?.message}`);
    }

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      product_name: item.name,
      product_image: item.product_image,
      variant_info: item.variant_info,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
    
    if (itemsError) {
      throw new Error(`Failed to save order items: ${itemsError.message}`);
    }

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
