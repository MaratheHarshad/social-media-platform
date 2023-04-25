const Joi = require("joi");

const validatePost = async (data) => {
  const schema = {
    title: Joi.string().required(),
    description: Joi.string.required(),
  }.with("title", "description");

  return schema.validate({ title: data.title, description: data.description });
};

module.exports = { validatePost };
