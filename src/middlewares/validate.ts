import Joi from 'joi'

export const schemas = {
  validatePassword: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    // role: Joi.string().required(),
  }),
}

const middleware = (schema) => {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema)
    console.log(result)
    if (result.error) {
      return res.status(400).json(result.error)
    }

    if (!req.value) {
      req.value = {}
    }
    req.value['body'] = result.value
    next()
  }
}
export default middleware
