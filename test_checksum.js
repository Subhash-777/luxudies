const PaytmChecksum = require('paytmchecksum');

async function test() {
  try {
    const merchantKey = '%xU@Ht6yE#xKE81U';
    const params = {
      body: {
        requestType: "Payment",
        mid: 'TtVoWe65456985356558',
        websiteName: 'WEBSTAGING',
        orderId: 'TEST_ORDER_123',
        callbackUrl: `http://localhost:3000/api/paytm/callback`,
        txnAmount: {
          value: "1000",
          currency: "INR",
        },
        userInfo: {
          custId: "GUEST_123",
        },
      }
    };
    const checksum = await PaytmChecksum.generateSignature(JSON.stringify(params), merchantKey);
    console.log("Checksum:", checksum);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
