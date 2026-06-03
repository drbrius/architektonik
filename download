// ============================================================
//  Stripe-Bezahlfunktion — läuft im Hintergrund auf Vercel.
//  Gehört zu Etappe E der Anleitung.
//
//  Diese Datei tut NICHTS, solange du Stripe nicht eingerichtet hast.
//  Sie wird erst aktiv, wenn in Vercel die Umgebungsvariable
//  STRIPE_SECRET_KEY hinterlegt ist und das Paket "stripe" installiert wurde
//  (npm install stripe).
//
//  Sicherheit: Der geheime Schlüssel steht NUR hier auf dem Server
//  (über process.env), niemals im sichtbaren Frontend-Code.
// ============================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fehler: "Nur POST erlaubt" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      fehler:
        "Stripe ist noch nicht eingerichtet. Bitte STRIPE_SECRET_KEY in Vercel hinterlegen (siehe Anleitung, Etappe E).",
    });
  }

  try {
    // Dynamischer Import, damit die App auch ohne installiertes Stripe-Paket baut.
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { priceId, modus } = req.body || {};
    if (!priceId) return res.status(400).json({ fehler: "priceId fehlt" });

    const session = await stripe.checkout.sessions.create({
      mode: modus || "payment", // "payment" = einmalig, "subscription" = Abo
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/?bezahlt=ja`,
      cancel_url: `${req.headers.origin}/?bezahlt=nein`,
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ fehler: e.message });
  }
}
