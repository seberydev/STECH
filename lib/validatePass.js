const joi = require("joi");

const schema = joi.object({
  newP: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .trim()
    .required(),
});

const validatePass = (data) => {
  console.log(schema.validate(data))
  return schema.validate(data);
};

module.exports = validatePass;