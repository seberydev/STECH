const joi = require("joi");

const schema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .trim()
    .required(),
  nombres: joi.string().min(3).max(100).trim().required(),
  apellidos: joi.string().min(3).max(100).trim().required(),
  contrasena: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .trim()
    .required(),
  confirmacion: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .trim()
    .required(),
});

const validateData = (data) => {
  return schema.validate(data);
};

module.exports = validateData;