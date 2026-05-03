import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tier } = req.body;
  
  if (tier !== 'pro') {
    return res.status(400).json({ error: 'Invalid tier selected' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey || stripeKey === 'placeholder-secret-key') {
    // If the user hasn't set up Stripe yet, return a mock success
    console.warn("Stripe key not configured. Bypassing checkout for development.");
    return res.status(200).json({ error: 'Stripe is not configured yet. This is a placeholder response.' });
  }

  const stripe = new Stripe(stripeKey);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Fargo Flooring Pro',
              description: 'Unlimited high-fidelity exports and custom branding.',
            },
            unit_amount: 2900, // $29.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/generator?success=true`,
      cancel_url: `${req.headers.origin}/generator?canceled=true`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
