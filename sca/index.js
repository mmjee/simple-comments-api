const DB = require('sca/models')
const CommentRoutes = require('sca/comments')

module.exports = async (fastify) => {
  await DB.initializeDatabase()

  fastify.register(require('fastify-cors'), {
    origin: '*',
    methods: ['GET', 'POST'],
    maxAge: 60 * 60 * 24
  })

  fastify.post('/api/v1/comments', CommentRoutes.createComment)
  fastify.get('/api/v1/comments', CommentRoutes.getComments)
}
