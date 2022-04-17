const mp = new MercadoPago("TEST-c2a4faea-b211-40af-8144-e472af5be055");

const cardForm = mp.cardForm({
  amount: "100.5",
  autoMount: true,
  form: {
    id: "form-checkout",
    cardholderName: {
      id: "form-checkout__cardholderName",
      placeholder: "Titular de la tarjeta",
    },
    cardholderEmail: {
      id: "form-checkout__cardholderEmail",
      placeholder: "E-mail",
    },
    cardNumber: {
      id: "form-checkout__cardNumber",
      placeholder: "Número de la tarjeta",
    },
    cardExpirationDate: {
      id: "form-checkout__cardExpirationDate",
      placeholder: "Fecha de vencimiento (MM/YYYY)",
    },
    securityCode: {
      id: "form-checkout__securityCode",
      placeholder: "Código de seguridad",
    },
    installments: {
      id: "form-checkout__installments",
      placeholder: "Cuotas",
    },
    identificationNumber: {
      id: "form-checkout__identificationNumber",
      placeholder: "Número de documento",
    },
    issuer: {
      id: "form-checkout__issuer",
      placeholder: "Banco emisor",
    },
  },
  callbacks: {
    onFormMounted: (error) => {
      if (error) return console.warn("Form Mounted handling error: ", error);
      console.log("Form mounted");
    },
    onSubmit: (event) => {
      event.preventDefault();

      console.log("Submiting");

      const {
        paymentMethodId: payment_method_id,
        issuerId: issuer_id,
        cardholderEmail: email,
        amount,
        token,
        installments,
        identificationNumber,
      } = cardForm.getCardFormData();

      // master, oxxo

      fetch("/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          issuer_id,
          payment_method_id: "oxxo",
          transaction_amount: Number(amount),
          installments: Number(installments),
          description: "Descripción del producto",
          payer: {
            email,
            identification: {
              number: identificationNumber,
            },
          },
        }),
      });
    },
    onFetching: (resource) => {
      console.log("Fetching resource: ", resource);

      // Animate progress bar
      const progressBar = document.querySelector(".progress-bar");
      progressBar.removeAttribute("value");

      return () => {
        progressBar.setAttribute("value", "0");
      };
    },
  },
});
