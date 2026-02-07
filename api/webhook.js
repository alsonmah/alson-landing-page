export default async function handler(req, res) {
    // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
        return res.status(200).end();
  }

  if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

  if (!webhookUrl) {
        console.error('ZAPIER_WEBHOOK_URL environment variable not set');
        return res.status(500).json({ error: 'Webhook not configured' });
  }

  try {
        // Send JSON body directly to Zapier for proper field parsing
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      const response = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
      });

      console.log('Zapier webhook response:', response.status);
        return res.status(200).json({ success: true });
  } catch (error) {
        console.error('Zapier webhook error:', error);
        return res.status(500).json({ error: 'Failed to send webhook' });
  }
}
