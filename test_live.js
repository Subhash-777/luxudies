const https = require('https');

const data = JSON.stringify({
  items: [{
    product_id: '12345678-1234-1234-1234-123456789012',
    quantity: 1,
    price: 1000,
    name: 'Test',
    product_image: 'test.jpg'
  }],
  address: {
    fullName: 'Test',
    email: 'test@example.com',
    phone: '9999999999',
    line1: 'Test',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '123456'
  }
});

const req = https.request({
  hostname: 'luxudies.vercel.app',
  port: 443,
  path: '/api/paytm/initiate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
