const mongoose = require('mongoose')

const DEFAULT_MODEL_OPTIONS = {
  timestamps: true
}
const CommentSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
  username: { type: String, maxlength: 64, required: true },
  pageURL: { type: String, required: true, index: -1 },

  commentText: { type: String, required: true, maxlength: 4096 }
}, DEFAULT_MODEL_OPTIONS)
const Comments = mongoose.model('Comment', CommentSchema)

function initializeDatabase () {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
  }
  console.log('Connecting to MongoDB.')
  return mongoose.connect(process.env.SCA_MONGODB_URL || 'mongodb://127.0.0.1:27017/simple-comments').catch(e => {
    console.log('Caught err during MongoDB connection:', e)
    console.log('Exiting.')
    process.exit(1)
  }).then(() => console.log('Done connecting.'))
}

module.exports = {
  initializeDatabase,
  Comments
}
