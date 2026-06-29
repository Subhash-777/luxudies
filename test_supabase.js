const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase.from('orders').insert({
    order_number: 'TEST_ORDER_123',
    customer_name: 'Test',
    customer_email: 'test@example.com',
    customer_phone: '9999999999',
    shipping_line1: 'Test',
    shipping_city: 'Test',
    shipping_state: 'Tamil Nadu',
    shipping_pincode: '123456',
    subtotal: 1000,
    shipping_cost: 0,
    total: 1000,
  }).select('id').single();

  console.log("Error:", error);
  console.log("Data:", data);
}

testInsert();
