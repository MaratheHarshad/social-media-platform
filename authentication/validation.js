const Joi = require("joi");

const validateUser = async (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).with("email", "password");

  return schema.validate({ email: data.email, password: data.password });
};

module.exports = { validateUser };
