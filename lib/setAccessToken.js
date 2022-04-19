const mercadopago = require("mercadopago");

const setAccessToken = () => {
  mercadopago.configurations.setAccessToken(
    process.env.MP_ACCESS_TOKEN ||
      "TEST-4680153902253138-041813-d788ad6b245bdf7ed7b67ec8255f1691-1107392567"
  );
};

module.exports = setAccessToken;
