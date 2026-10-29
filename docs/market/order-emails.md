# Kashkoul Market — order emails

Shopify sends the order emails (Settings → Notifications). They go out in the customer's language: Shopify's own
English and Arabic versions, with our logo and brick accent (Settings → Notifications → Customize email templates).

**Already in the emails today (no template edits):** the payment method's instructions, in English and Arabic
(Settings → Payments → Manual payment methods), which Shopify adds to the order confirmation and the thank-you page:

| Method | English | Arabic |
|---|---|---|
| Cash on delivery | Thank you! We'll confirm your order with you on WhatsApp, then pay in cash when it arrives or when you pick it up. For items we order from the US, on orders over $100, we ask for a 30% deposit by Whish first. | شكرًا لك! سنؤكّد طلبك معك على واتساب، ثم تدفع نقدًا عند وصوله أو عند استلامه. للقطع التي نطلبها من الولايات المتحدة، في الطلبات فوق 100$، نطلب عربونًا بنسبة 30% عبر Whish أولًا. |
| Whish | Thank you! We'll message you on WhatsApp to confirm your order and send you the Whish details. Nothing is paid until we confirm. | شكرًا لك! سنراسلك على واتساب لتأكيد طلبك وإرسال تفاصيل Whish. لا تدفع شيئًا قبل أن نؤكّد. |
| Pickup ready (Shipping and delivery → Pickup in store) | Your order is ready! Pick it up free at Kashkoul in Khaldeh, Mon–Sat 12pm–8pm. Pay in cash or with Whish when you collect it. Questions? WhatsApp +961 78 721 968. | (Shopify sends this message as written; it has no Arabic version) |

**Our lines in the emails** (added 2026-10-15, after the sender email was verified): a short block right under each
email's intro (`<p>{{ email_body }}</p>`), in a paper-coloured box. English is in the template (Settings → Notifications
→ [email] → Edit code); Arabic is in the template's Arabic translation, at the same place.

| Email | English | Arabic |
|---|---|---|
| Order confirmation | **What happens next:** we'll message you on WhatsApp to confirm your order. In-stock items arrive in 3–5 days, items we order from the US in 2–4 weeks. You pay on delivery, in cash or with Whish. | **الخطوات التالية:** سنراسلك على واتساب لتأكيد طلبك. القطع المتوفرة تصل خلال 3–5 أيام، والقطع التي نطلبها من الولايات المتحدة خلال 2–4 أسابيع. تدفع عند الاستلام، نقدًا أو عبر Whish. |
| Shipping confirmation (sent when the owner marks the order fulfilled = on its way) | The driver will call you before arriving. If you're paying on delivery, please have the amount ready in cash or with Whish. If anything arrives damaged or isn't what you ordered, tell us on WhatsApp within 48 hours. | سيتصل بك السائق قبل وصوله. إذا كنت ستدفع عند الاستلام، جهّز المبلغ نقدًا أو عبر Whish من فضلك. إذا وصلت أي قطعة متضرّرة أو مختلفة عمّا طلبته، أخبرنا على واتساب خلال 48 ساعة. |

There's no "delivered" email for our $5 delivery: Shopify only sends one for its own local-delivery feature or with
tracking, so the 48-hour returns line is in the shipping confirmation. In the Arabic blocks, number ranges sit in a
left-to-right span that can't break (`<span dir="ltr" style="white-space: nowrap">3–5</span>`), so they never show as
5–3 or split across lines.

**Sender:** emails go out as "Kashkoul Market" from store+82890457318@shopifyemail.com, with replies to the verified
kashkoulacademy@gmail.com. To send from no-reply@kashkoul.org instead, the kashkoul.org DNS (Namecheap) needs the
domain-authentication records Shopify shows under Settings → Notifications → Sender email (step 7).
