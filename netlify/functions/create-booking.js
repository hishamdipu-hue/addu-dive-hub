// netlify/functions/create-booking.js
// Improved: handles OPTIONS (CORS preflight) and returns CORS headers on every response.

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*', // change to your domain in production for better security
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body)
  };
}

exports.handler = async function (event) {
  // respond to preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    // protect against empty or non-JSON bodies
    if (!event.body) return jsonResponse(400, { error: 'Empty request body' });

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      return jsonResponse(400, { error: 'Invalid JSON' });
    }

    // required fields validation
    const full_name = (data.fullName || data.full_name || '').trim();
    const email = (data.email || '').trim();
    if (!full_name || !email) {
      return jsonResponse(400, { error: 'Name and email are required' });
    }

    // minimal sanitization / limit fields written to DB
    const payload = {
      full_name,
      email,
      phone: String(data.phone || '').slice(0, 40),
      preferred_date: data.date || null,
      package: String(data.package || '').slice(0, 60),
      message: String(data.message || '').slice(0, 1000)
    };

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase env vars');
      return jsonResponse(500, { error: 'Server misconfiguration' });
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
      console.error('Supabase insert error', json);
      return jsonResponse(502, { error: 'Failed to save booking' });
    }

    return jsonResponse(200, { success: true, record: json[0] });
  } catch (err) {
    console.error(err);
    return jsonResponse(500, { error: 'Server error' });
  }
};
