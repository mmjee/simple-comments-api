const _ = require('lodash')
const Joi = require('joi')

// eslint-disable-next-line node/handle-callback-err
function handleError (err, reply) {
  reply.status(400).send({
    error: true,
    errorCode: 'VALIDATION_FAILED',
    errorMessage: err.details[0].message,
    errorDetails: err.details.map(d => d.message)
  })
}

exports.validateWithSchema = function validateWithSchema (req, reply, schema) {
  if (!_.isPlainObject(req.body)) {
    reply.status(400).send({
      error: true,
      errorMessage: 'NOT_AN_OBJECT'
    })
    return false
  }

  try {
    const r = schema.validate(req.body)

    if (r.error) {
      handleError(r.error, reply)
      return false
    }
  } catch (e) {
    if (!Joi.isError(e)) {
      throw e
    }

    handleError(e, reply)
    return false
  }

  return true
}
