// ============================================
// LUXUDIES - Paytm Initiate Transaction API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getPaytmConfig, getPaytmHost, generateChecksum } from '@/lib/paytm';
import { generateOrderNumber } from '@/lib/utils';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const config = getPaytmConfig();
    const body = await request.json();
    const { items, address } = body;

    if (!items || items.length === 0 || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user id if logged in
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    const supabaseAdmin = await createAdminClient();

    // SERVER-SIDE PRICE CALCULATION (SECURITY FIX)
    let trueSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      // Fetch product
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('price, name')
        .eq('id', item.product_id)
        .single();
        
      if (productError || !product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }
      
      let itemPrice = Number(product.price);
      
      // Fetch variant if applicable
      if (item.variant_id) {
        const { data: variant, error: variantError } = await supabaseAdmin
          .from('product_variants')
          .select('price_adjustment, name, value')
          .eq('id', item.variant_id)
          .eq('product_id', item.product_id)
          .single();
          
        if (!variantError && variant) {
          itemPrice += Number(variant.price_adjustment);
        }
      }
      
      trueSubtotal += itemPrice * item.quantity;
      
      validatedItems.push({
        ...item,
        price: itemPrice // Override client-provided price
      });
    }

    // Shipping calculation based on State
    const trueShippingCost = address.state?.trim().toLowerCase() === 'tamil nadu' ? 0 : 99; 
    const trueTotal = trueSubtotal + trueShippingCost;

    const orderNumber = generateOrderNumber();
    const customerId = user?.id || `GUEST_${Date.now()}`;
    
    // Base URL for callback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    // Save pending order to database
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
      subtotal: trueSubtotal,
      shipping_cost: trueShippingCost,
      discount: 0,
      total: trueTotal,
      payment_method: 'paytm',
      payment_status: 'pending',
      razorpay_order_id: null, // Keep column for legacy but set to null
      paytm_order_id: orderNumber, // Can just use order number
      status: 'pending'
    }).select('id').single();

    if (orderError || !newOrder) {
      throw new Error(`Failed to save order to db: ${orderError?.message}`);
    }

    // Insert order items with true prices
    const orderItems = validatedItems.map((item: any) => ({
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

    // ----------------------------------------------------
    // PAYTM Initiate Transaction
    // ----------------------------------------------------
    const paytmParams = {
      body: {
        requestType: "Payment",
        mid: config.mid,
        websiteName: config.website,
        orderId: orderNumber,
        callbackUrl: `${baseUrl}/api/paytm/callback`,
        txnAmount: {
          value: String(trueTotal),
          currency: "INR",
        },
        userInfo: {
          custId: customerId,
        },
      }
    };

    const checksum = await generateChecksum(paytmParams.body, config.merchantKey);
    const postData = JSON.stringify({
      ...paytmParams,
      head: {
        signature: checksum
      }
    });

    const paytmHost = getPaytmHost(config);
    const apiUrl = `https://${paytmHost}/theia/api/v1/initiateTransaction?mid=${config.mid}&orderId=${orderNumber}`;

    const paytmRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length.toString()
      },
      body: postData
    });

    const paytmData = await paytmRes.json();
    
    if (paytmData.body.resultInfo.resultStatus === 'S') {
      return NextResponse.json({
        txnToken: paytmData.body.txnToken,
        orderId: orderNumber,
        amount: trueTotal,
      });
    } else {
      console.error('Paytm Initiate Error:', paytmData);
      throw new Error(paytmData.body.resultInfo.resultMsg || 'Paytm API failed');
    }
    
  } catch (error) {
    console.error('Error creating Paytm order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
