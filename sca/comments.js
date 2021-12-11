const _ = require('lodash')
const Joi = require('joi')
const normalizeURL = require('normalize-url')
const marked = require('marked')

const { Comments } = require('sca/models')
const { validateWithSchema } = require('sca/validate')

const CCSchema = Joi.object({
  parent: Joi.binary().encoding('hex').length(12).optional(),
  username: Joi.string().max(64).required(),
  pageURL: Joi.string().required(),

  commentText: Joi.string().required()
}).required()

async function createComment (req, reply) {
  if (!validateWithSchema(req, reply, CCSchema)) {
    return
  }
  const body = req.body
  body.pageURL = normalizeURL(body.pageURL)
  body.commentText = marked.marked(body.commentText)
  const comment = await Comments.create(body)

  reply.send({
    ok: true,
    comment
  })
}

async function recursivelyResolveComments (rootCommentID) {
  const childComments = await Comments.find({
    parent: rootCommentID
  })

  const promises = childComments.map(async comment => {
    const serialized = comment.toJSON()
    serialized.childComments = await recursivelyResolveComments(comment._id)
    return serialized
  })

  return Promise.all(promises)
}

async function getComments (req, reply) {
  let rootComments

  if (!_.isString(req.query.url)) {
    reply.status(401).send({
      error: true,
      errorCode: 'INVALID_QUERY'
    })
    return
  }
  const url = normalizeURL(req.query.url)

  try {
    rootComments = await Comments.find({
      pageURL: url,
      parent: null
    })
  } catch (e) {
    console.error('E:', e)
    reply.status(401).send({
      error: true,
      errorCode: 'INVALID_QUERY'
    })
    return
  }

  const serialized = await Promise.all(rootComments.map(async comment => {
    const serialized = comment.toJSON()
    serialized.childComments = await recursivelyResolveComments(comment._id)
    return serialized
  }))

  reply.send({
    ok: true,
    rootComments: serialized
  })
}

exports.createComment = createComment
exports.getComments = getComments
