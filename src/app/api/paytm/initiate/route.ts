// ============================================
// LUXUDIES - Paytm Initiate Transaction API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getPaytmConfig, getPaytmHost, generateChecksumByString } from '@/lib/paytm';
import { generateOrderNumber } from '@/lib/utils';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse & validate body ─────────────────────────────────
    const body = await request.json();
    const { items, address } = body;

    if (!items || items.length === 0 || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ── 2. Load config (throws if env vars are missing) ──────────
    const config = getPaytmConfig();

    // ── 3. Get authenticated user (optional) ─────────────────────
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();
    const supabaseAdmin = await createAdminClient();

    // ── 4. Server-side price calculation (security) ───────────────
    let trueSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('price, name')
        .eq('id', item.product_id)
        .single();

      if (productError || !product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      let itemPrice = Number(product.price);

      if (item.variant_id) {
        const { data: variant } = await supabaseAdmin
          .from('product_variants')
          .select('price_adjustment, name, value')
          .eq('id', item.variant_id)
          .eq('product_id', item.product_id)
          .single();

        if (variant) {
          itemPrice += Number(variant.price_adjustment || 0);
        }
      }

      trueSubtotal += itemPrice * item.quantity;
      validatedItems.push({ ...item, price: itemPrice });
    }

    // ── 5. Shipping cost (fetch from store_settings) ─────────────────
    let trueShippingCost = 99; // fallback
    let freeState = 'tamil nadu'; // fallback
    
    const { data: settings } = await supabaseAdmin
      .from('store_settings')
      .select('free_shipping_state, shipping_cost_other')
      .eq('id', 'singleton')
      .single();
      
    if (settings) {
      trueShippingCost = settings.shipping_cost_other;
      freeState = settings.free_shipping_state.toLowerCase();
    }
    
    const isFreeState = address.state?.trim().toLowerCase() === freeState;
    trueShippingCost = isFreeState ? 0 : trueShippingCost;
    const trueTotal = trueSubtotal + trueShippingCost;

    // ── 6. Save pending order ─────────────────────────────────────
    const orderNumber = generateOrderNumber();
    const customerId = user?.id || `GUEST_${Date.now()}`;

    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
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
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !newOrder) {
      throw new Error(`DB order insert failed: ${orderError?.message}`);
    }

    // ── 7. Save order items ───────────────────────────────────────
    const orderItems = validatedItems.map((item: any) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      product_name: item.name,
      product_image: item.product_image || null,
      variant_info: item.variant_info || null,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
    if (itemsError) {
      throw new Error(`DB order_items insert failed: ${itemsError.message}`);
    }

    // ── 8. Call Paytm initiateTransaction API ─────────────────────
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const paytmBody = {
      requestType: 'Payment',
      mid: config.mid,
      websiteName: config.website,
      orderId: orderNumber,
      callbackUrl: `${baseUrl}/api/paytm/callback`,
      txnAmount: {
        value: trueTotal.toFixed(2),
        currency: 'INR',
      },
      userInfo: {
        custId: customerId,
      },
    };

    const bodyString = JSON.stringify(paytmBody);
    const checksum = await generateChecksumByString(bodyString, config.merchantKey);

    const postData = JSON.stringify({
      body: paytmBody,
      head: { signature: checksum },
    });

    const paytmHost = getPaytmHost(config);
    const apiUrl = `https://${paytmHost}/theia/api/v1/initiateTransaction?mid=${config.mid}&orderId=${orderNumber}`;

    const paytmRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: postData,
    });

    if (!paytmRes.ok) {
      const errText = await paytmRes.text();
      throw new Error(`Paytm API HTTP error ${paytmRes.status}: ${errText}`);
    }

    const paytmData = await paytmRes.json();
    const resultInfo = paytmData?.body?.resultInfo;

    if (resultInfo?.resultStatus === 'S') {
      return NextResponse.json({
        txnToken: paytmData.body.txnToken,
        orderId: orderNumber,
        amount: trueTotal,
        mid: config.mid,
        environment: config.environment,
      });
    } else {
      throw new Error(
        `Paytm rejected: [${resultInfo?.resultCode}] ${resultInfo?.resultMsg || 'Unknown Paytm error'}`
      );
    }
  } catch (error: any) {
    console.error('Paytm initiate error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
