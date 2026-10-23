import { COMPANY } from "./data";

export interface Policy {
  title: string;
  intro: string;
  sections: { h: string; p?: string[]; list?: string[] }[];
}

const contact = `${COMPANY.name}, ${COMPANY.address} · Phone/WhatsApp: ${COMPANY.phoneDisplay} · Email: ${COMPANY.email}`;

export const POLICY_UPDATED = "23 October 2026";

export const POLICIES: Record<string, Policy> = {
  "terms-and-conditions": {
    title: "Terms & Conditions",
    intro: `These Terms & Conditions govern your use of the ${COMPANY.name} ("RVS", "we", "us") website and the booking of our transportation services. By booking with us — online, by phone or on WhatsApp — you agree to these terms.`,
    sections: [
      {
        h: "1. Services",
        p: [
          "RVS provides chauffeur-driven vehicles for airport transfers, local hourly packages, outstation trips, executive and luxury travel, and corporate employee transportation. All vehicles are provided with a driver; self-drive rentals are not offered.",
        ],
      },
      {
        h: "2. Bookings",
        list: [
          "A booking is confirmed once you receive a booking ID by SMS, WhatsApp or email.",
          "Fares shown online are estimates based on route distance, trip type and vehicle class. The final bill is based on actual kilometres and hours used.",
          "Vehicle images are representative; a vehicle of the same class may be allotted subject to availability.",
          "You must provide accurate pickup details, contact number and passenger count. Additional stops or route changes may change the fare.",
        ],
      },
      {
        h: "3. Fares & charges",
        list: [
          "Fares include vehicle, fuel, driver and driver allowance for the billed distance, plus 5% GST unless stated otherwise.",
          "Tolls, state entry taxes/permits, parking and airport entry fees are extra and payable as actuals.",
          "Outstation round trips are billed on a minimum kilometres-per-day basis as shown at booking.",
          "Extra kilometres and extra hours beyond the package are charged at the rates displayed at booking.",
          "Night charges may apply for driving between 10:00 PM and 6:00 AM on outstation trips.",
        ],
      },
      {
        h: "4. Waiting time",
        p: ["Up to 45 minutes of free waiting is included for airport pickups and 15 minutes for other pickups. Waiting beyond this is charged at the vehicle's extra-hour rate."],
      },
      {
        h: "5. Passenger responsibilities",
        list: [
          "Do not exceed the vehicle's seating capacity or carry luggage beyond reasonable limits.",
          "Smoking, consumption of alcohol or drugs, and carrying illegal or hazardous goods in the vehicle are prohibited.",
          "Any damage to the vehicle caused by passengers will be charged at actual repair cost.",
          "The driver may refuse or end a trip if a passenger behaves in an abusive, unsafe or unlawful manner.",
        ],
      },
      {
        h: "6. Driver duty hours",
        p: ["For safety, drivers are not permitted to drive continuously for unreasonable durations. On multi-day trips, the customer should allow the driver adequate rest at night. Driving after 10:00 PM on outstation trips is at the driver's discretion for safety."],
      },
      {
        h: "7. Delays & liability",
        p: [
          "We make every effort to be on time. However, we are not liable for delays or missed flights/trains caused by traffic, weather, road closures, vehicle breakdowns, accidents, strikes or other events beyond our reasonable control. In case of a breakdown we will arrange a replacement vehicle as quickly as possible.",
          "RVS is not responsible for loss of or damage to personal belongings left in the vehicle. Please check before alighting. Found items will be returned where possible.",
          "Our maximum liability in connection with any booking is limited to the amount paid for that booking.",
        ],
      },
      {
        h: "8. Corporate clients",
        p: ["Corporate employee transportation and contract services are governed by the separate agreement signed with each client. Where that agreement conflicts with these terms, the agreement prevails."],
      },
      {
        h: "9. Website use",
        p: ["You agree not to misuse the website, attempt unauthorised access, or submit false bookings. Content, logos and design on this website belong to RVS and may not be copied without permission."],
      },
      {
        h: "10. Governing law",
        p: ["These terms are governed by the laws of India. Courts at Bengaluru, Karnataka have exclusive jurisdiction over any dispute."],
      },
      { h: "11. Contact", p: [contact] },
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    intro: `${COMPANY.name} respects your privacy. This policy explains what information we collect when you use our website or services, how we use it, and the choices you have. It is intended to comply with the Digital Personal Data Protection Act, 2023 and applicable Indian law.`,
    sections: [
      {
        h: "1. Information we collect",
        list: [
          "Contact details: name, mobile number and email address.",
          "Trip details: pickup and drop addresses, map coordinates you select, travel dates and times, and any notes you add.",
          "Location: your device location, only if you tap “Use my current location” and grant permission.",
          "Payment information: processed securely by Razorpay. We do not store card numbers, UPI PINs or bank credentials.",
          "Technical data: IP address, browser type and basic usage data needed to run and secure the website.",
        ],
      },
      {
        h: "2. How we use your information",
        list: [
          "To confirm, schedule and fulfil your bookings and share driver and vehicle details.",
          "To contact you by call, SMS, WhatsApp or email about your trip.",
          "To process payments, refunds and issue GST invoices.",
          "To respond to enquiries and provide customer support.",
          "To improve our services, prevent fraud and comply with legal obligations.",
        ],
      },
      {
        h: "3. Sharing",
        p: [
          "We share only what is necessary: trip details with the assigned driver; payment data with Razorpay; and address search/map data with mapping providers (OpenStreetMap-based services) to show maps and routes. We do not sell your personal data. We may disclose information if required by law or to protect safety.",
        ],
      },
      {
        h: "4. Data retention",
        p: ["We keep booking records for as long as needed to provide the service and to meet tax and legal requirements, after which they are deleted or anonymised."],
      },
      {
        h: "5. Security",
        p: ["We use HTTPS encryption, restricted access and trusted payment partners to protect your data. No online system is completely secure, but we take reasonable measures to safeguard your information."],
      },
      {
        h: "6. Your rights",
        p: [`You may request access to, correction of, or deletion of your personal data, or withdraw consent for marketing communication, by writing to ${COMPANY.email}. We will respond within a reasonable time.`],
      },
      {
        h: "7. Cookies",
        p: ["Our website uses only essential cookies and local storage needed for it to function (for example, to load maps and complete payments). We do not use third-party advertising cookies."],
      },
      { h: "8. Changes", p: ["We may update this policy from time to time. The latest version will always be available on this page."] },
      { h: "9. Grievance / contact", p: [contact] },
    ],
  },

  "cancellation-and-refund-policy": {
    title: "Cancellation & Refund Policy",
    intro: "We understand plans change. This policy explains how cancellations, no-shows and refunds are handled for bookings made with RVS Tours and Travels.",
    sections: [
      {
        h: "1. Cancellation by the customer",
        list: [
          "More than 24 hours before pickup: 100% refund of the amount paid.",
          "Between 6 and 24 hours before pickup: 50% of the advance paid is refunded.",
          "Less than 6 hours before pickup, or no-show: the advance paid is non-refundable.",
          "Luxury vehicles (Mercedes-Benz E-Class, S-Class, Toyota Vellfire) and wedding/event bookings: cancellations must be made at least 48 hours before pickup for a full refund; within 48 hours the advance is non-refundable.",
        ],
      },
      {
        h: "2. How to cancel",
        p: [`Call or WhatsApp ${COMPANY.phoneDisplay} or email ${COMPANY.email} with your booking ID. The time we receive your request is used to calculate the refund.`],
      },
      {
        h: "3. Cancellation by RVS",
        p: ["If we cancel your booking or cannot provide a vehicle, you will receive a 100% refund of the amount paid. Where possible we will first offer an alternative vehicle of equal or higher class at the same fare."],
      },
      {
        h: "4. Rescheduling",
        p: ["You may reschedule free of charge up to 6 hours before pickup, subject to vehicle availability. Changes in route, distance or vehicle class may change the fare."],
      },
      {
        h: "5. Refund timelines",
        list: [
          "Approved refunds are initiated within 2 working days.",
          "Refunds are credited to the original payment method via Razorpay, typically within 5–7 working days depending on your bank.",
          "Payments made to the driver in cash are refunded by bank transfer/UPI.",
        ],
      },
      {
        h: "6. Trip cut short",
        p: ["If you end a trip early, charges apply for the distance and time used, subject to the package minimums shown at booking. If a trip is cut short due to a vehicle breakdown we cannot replace, you are charged only for the distance covered."],
      },
      { h: "7. Contact", p: [contact] },
    ],
  },

  "payment-policy": {
    title: "Payment Policy",
    intro: "This policy explains the payment options available when booking with RVS Tours and Travels and how online payments are processed.",
    sections: [
      {
        h: "1. Payment options",
        list: [
          "Pay advance online: 20% of the estimated fare (minimum ₹500) to confirm your booking; the balance is paid to the driver at the end of the trip.",
          "Pay full online: the entire estimated fare is paid at booking; only actual tolls, parking, permits and any extras are payable later.",
          "Pay to driver: the booking is confirmed by our team over a call; the full fare is paid to the driver by cash or UPI.",
          "Corporate accounts: monthly invoicing as per the service agreement.",
        ],
      },
      {
        h: "2. Online payments",
        p: [
          "Online payments are processed by Razorpay Software Pvt Ltd, a PCI-DSS compliant payment gateway. We accept UPI, debit and credit cards, net banking and supported wallets. RVS never sees or stores your full card details, UPI PIN or banking passwords.",
        ],
      },
      {
        h: "3. Pricing & taxes",
        p: ["All prices are in Indian Rupees (INR). Fares include 5% GST unless stated otherwise. A GST invoice is provided on request or automatically for corporate accounts."],
      },
      {
        h: "4. Final settlement",
        p: ["The online fare is an estimate. At the end of the trip, any difference due to extra kilometres, extra hours, waiting, tolls, parking or permits is settled with the driver or invoiced. If you paid more than the final fare, the excess is refunded within 5–7 working days."],
      },
      {
        h: "5. Failed or duplicate payments",
        p: [`If money is debited but your booking is not confirmed, it is usually auto-reversed by your bank within 5–7 working days. Contact us with the transaction reference and we will help resolve it promptly.`],
      },
      { h: "6. Contact", p: [contact] },
    ],
  },

  "service-delivery-policy": {
    title: "Service Delivery Policy",
    intro: "RVS Tours and Travels provides transportation services; no physical goods are shipped. This policy explains how and when our services are delivered.",
    sections: [
      {
        h: "1. Confirmation",
        p: ["Online bookings are confirmed instantly with a booking ID. Pay-to-driver bookings are confirmed by our team over a call or WhatsApp, usually within 30 minutes during operating hours."],
      },
      {
        h: "2. Driver & vehicle details",
        p: ["Driver name, mobile number and vehicle registration number are shared by SMS/WhatsApp ahead of pickup — typically 2 to 12 hours before, and earlier for outstation trips."],
      },
      {
        h: "3. Service area",
        p: ["Pickups are available across Bengaluru. Outstation trips cover destinations across South India and beyond, as listed on the booking page or on request."],
      },
      {
        h: "4. Booking window",
        p: ["Bookings can be made from 30 minutes up to 6 months in advance. For same-day bookings within a few hours, we recommend calling us to confirm availability."],
      },
      {
        h: "5. Service completion",
        p: ["The service is considered delivered when the trip is completed at the drop location, or at the end of the booked package duration for local hourly bookings."],
      },
      { h: "6. Contact", p: [contact] },
    ],
  },

  "safety-and-conduct-policy": {
    title: "Safety & Conduct Policy",
    intro: "Safety is at the heart of every RVS journey. This policy outlines what we do — and what we ask of passengers — to keep every trip safe and respectful.",
    sections: [
      {
        h: "1. Our commitments",
        list: [
          "Drivers undergo background, licence and reference verification before joining.",
          "Vehicles are regularly serviced and checked for brakes, tyres, lights and safety equipment.",
          "Drivers are trained in defensive driving and respectful conduct.",
          "Night-shift corporate trips follow additional safety protocols as agreed with each client, including for women employees.",
          "Our support line is available 24×7 for any on-trip concern.",
        ],
      },
      {
        h: "2. Passenger conduct",
        list: [
          "Wear seat belts at all times.",
          "Do not ask the driver to overspeed, break traffic rules or exceed the vehicle's capacity.",
          "No smoking, alcohol, drugs, weapons or hazardous materials in the vehicle.",
          "Treat drivers with respect. Abusive or unsafe behaviour may result in the trip being ended without refund.",
        ],
      },
      {
        h: "3. Reporting a concern",
        p: [`If you feel unsafe at any point, call emergency services (112) first, then contact us on ${COMPANY.phoneDisplay}. Feedback and complaints can be emailed to ${COMPANY.email}; we investigate every report.`],
      },
    ],
  },
};
