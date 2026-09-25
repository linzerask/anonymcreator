require("dotenv").config();
const functions = require("firebase-functions");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors")({ origin: true });
const catalog = require("./catalog.json");

exports.createStripeCheckout = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        try {
            const { packageId, successUrl, cancelUrl } = req.body;

            if (!packageId) {
                return res.status(400).send("Package ID is required");
            }

            const item = catalog.find(p => p.id === packageId);
            if (!item) {
                return res.status(400).send("Invalid package ID");
            }

            let priceData = {
                currency: "eur",
                product_data: {
                    name: item.title,
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            };

            if (item.mode === "subscription") {
                priceData.recurring = {
                    interval: item.interval // "month" or "year"
                };
            }

            const session = await stripe.checkout.sessions.create({
                line_items: [{
                    price_data: priceData,
                    quantity: 1,
                }],
                mode: item.mode,
                success_url: successUrl || "https://anonymcreator.com/danke.html",
                cancel_url: cancelUrl || "https://anonymcreator.com/preise.html",
            });

            res.status(200).json({ id: session.id, url: session.url });
            
        } catch (error) {
            console.error("Stripe Error:", error);
            res.status(500).send("Internal Server Error: " + error.message);
        }
    });
});
