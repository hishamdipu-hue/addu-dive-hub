// netlify/functions/create-booking.js
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    const full_name = (data.fullName || data.full_name || '').trim();
    const email = (data.email || '').trim();

    if (!full_name || !email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Name and email are required' }) };
    }

    const payload = {
      full_name,
      email,
      phone: data.phone || '',
      preferred_date: data.date || null,
      package: data.package || '',
      message: data.message || ''
    };

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration' }) };
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (!res.ok) {
      console.error(json);
      return { statusCode: 502, body: JSON.stringify({ error: 'Failed to save booking' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, record: json[0] })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
