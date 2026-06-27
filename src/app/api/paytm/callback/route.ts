// ============================================
// LUXUDIES - Paytm Callback API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getPaytmConfig, verifyChecksum } from '@/lib/paytm';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const config = getPaytmConfig();
    const formData = await request.formData();
    
    // Convert formData to object
    const paytmResponse: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      paytmResponse[key] = value.toString();
    }
    
    const paytmChecksum = paytmResponse.CHECKSUMHASH;
    delete paytmResponse.CHECKSUMHASH;

    const isVerifySignature = verifyChecksum(paytmResponse, config.merchantKey, paytmChecksum);
    
    if (!isVerifySignature) {
      console.error("Paytm Checksum Mismatched");
      return NextResponse.redirect(new URL(`/checkout/failure?reason=checksum_failed`, request.url));
    }

    const orderId = paytmResponse.ORDERID;
    const txnStatus = paytmResponse.STATUS; // 'TXN_SUCCESS' or 'TXN_FAILURE'
    const txnId = paytmResponse.TXNID;
    
    const supabaseAdmin = await createAdminClient();

    // Verify order exists
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('order_number', orderId)
      .single();

    if (orderError || !order) {
      console.error(`Order not found: ${orderId}`);
      return NextResponse.redirect(new URL(`/checkout/failure?reason=order_not_found`, request.url));
    }

    if (txnStatus === 'TXN_SUCCESS') {
      // Update order to confirmed
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          paytm_txn_id: txnId
        })
        .eq('order_number', orderId);

      if (updateError) {
        console.error(`Failed to update order status: ${updateError.message}`);
      }
      
      return NextResponse.redirect(new URL(`/checkout/success?order=${orderId}`, request.url));
    } else {
      // Payment failed
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          paytm_txn_id: txnId
        })
        .eq('order_number', orderId);

      return NextResponse.redirect(new URL(`/checkout/failure?reason=payment_failed`, request.url));
    }

  } catch (error) {
    console.error('Error handling Paytm callback:', error);
    return NextResponse.redirect(new URL(`/checkout/failure?reason=server_error`, request.url));
  }
}
