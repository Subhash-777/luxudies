async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/paytm/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{
          product_id: '12345678-1234-1234-1234-123456789012',
          quantity: 1,
          price: 1000
        }],
        address: {
          fullName: 'Test',
          email: 'test@example.com',
          phone: '9999999999',
          line1: 'Test',
          city: 'Test',
          state: 'Tamil Nadu',
          pincode: '123456'
        }
      })
    });
    const data = await res.text();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
test();
