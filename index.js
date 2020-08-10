"use strict";

let pr = null;

function onLoad() {
  if (!isPaymentRequestAPISupported()) {
    updateBrowserSupportDisplay();
    return false;
  }
  const methodData = [
    {
      supportedMethods: ["basic-card"],
      data: {
        supportedNetworks: ['visa', 'mastercard', 'amex', 'discover','diners', 'jcb', 'unionpay'],
        supportedTypes: ["debit", "credit"]
      }
    }
  ];
  const details = {
    id: "demo-paymentrequest-api-unique-id-012345",
    displayItems: [
      {
        label: "Sub-total",
        amount: {
          currency: "USD",
          value: "55.00",
        }
      },
      {
        label: "Sales Tax",
        amount: {
          currency: "USD",
          value: "5.00",
        }
      }
    ],
    total: {
      label: "Total due",
      amount: {
        currency: "USD",
        value: "65.00",  // This includes shipping costs USD$5.00
      }
    }
  };
  const shippingOptions = [
    {
      id: "standard",
      label: "🚛 Ground Shipping (2 days)",
      amount: {
        currency: "USD",
        value: "5.00",
      },
      selected: true,
    },
    {
      id: "drone",
      label: "🚀 Drone Express (2 hours)",
      amount: {
        currency: "USD",
        value: "25.00",
      }
    }
  ];
  pr = new window.PaymentRequest(methodData, details);  //, shippingOptions);
  return true;
}

function isPaymentRequestAPISupported() {
  return !!window.PaymentRequest;
}

function updateBrowserSupportDisplay() {
  let browserSupportDisplayEl = document.getElementById("browser-support-display");
  if (!isPaymentRequestAPISupported()) {
    browserSupportDisplayEl.innerHTML = "Browser doesn't support PaymentRequest API.";
    return true;
  }
  if (!pr) {
    console.log("PaymentRequest isn't initialized.");
    return false;
  }
  const text = pr.canMakePayment() ? "Browser supports PaymentRequest API." : "Browser doesn't support PaymentRequest API.";
  browserSupportDisplayEl.innerHTML = text;
  return true; 
}

(() => {
  onLoad();
  updateBrowserSupportDisplay();
})();

function onClickPurchase(evt) {
  console.log("Clicked purchase button.");
  if (!pr) {
    console.log("PaymentRequest isn't initialized.");
    return false;
  }
  pr.show().then(resp => {
    const {
      requestId,
      methodName,
      details,
      shippingAddress,
      shippingOptions,
      payerName,
      payerEmail,
      payerPhone,
    } = resp;
    console.log(`requestId: ${requestId}`);
    console.log(`methodName: ${methodName}`);
    console.dir(details);
    console.dir(shippingAddress);
    console.dir(shippingOptions);
    console.log(`payerName: ${payerName}`);
    console.log(`payerEmail: ${payerEmail}`);
    console.log(`payerPhone: ${payerPhone}`);

    // TODO do something transaction with back-end

    // tells the user agent payment interaction to be over.
    // success, fail or unknown
    resp.complete("success").then(() => {
      console.log("Payment interaction is over."); 
    });
  });
}

