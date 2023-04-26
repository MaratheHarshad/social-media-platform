const Joi = require("joi");

const validateComment = async (data) => {
  const schema = Joi.object({
    comment: Joi.string().required(),
  });

  return schema.validate({ comment: data.comment });
};

module.exports = { validateComment };
