// ============================================
// LUXUDIES - Paytm Callback Handler
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getPaytmConfig, verifyChecksum } from '@/lib/paytm';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    const config = getPaytmConfig();
    const formData = await request.formData();

    const paytmResponse: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      paytmResponse[key] = value.toString();
    }

    const paytmChecksum = paytmResponse.CHECKSUMHASH;
    const responseWithoutChecksum = { ...paytmResponse };
    delete responseWithoutChecksum.CHECKSUMHASH;

    const isValid = verifyChecksum(responseWithoutChecksum, config.merchantKey, paytmChecksum);

    if (!isValid) {
      console.error('Paytm checksum mismatch on callback');
      return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=checksum_failed`);
    }

    const orderId = paytmResponse.ORDERID;
    const txnStatus = paytmResponse.STATUS;
    const txnId = paytmResponse.TXNID || null;

    const supabaseAdmin = await createAdminClient();

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('order_number', orderId)
      .single();

    if (orderError || !order) {
      console.error(`Callback: Order not found: ${orderId}`);
      return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=order_not_found`);
    }

    if (txnStatus === 'TXN_SUCCESS') {
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          notes: `Paytm TxnID: ${txnId}`,
        })
        .eq('order_number', orderId);

      return NextResponse.redirect(`${baseUrl}/checkout/success?order=${orderId}`);
    } else {
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          notes: `Paytm TxnID: ${txnId}, Status: ${txnStatus}`,
        })
        .eq('order_number', orderId);

      return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=payment_failed`);
    }
  } catch (error: any) {
    console.error('Paytm callback error:', error);
    return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=server_error`);
  }
}
