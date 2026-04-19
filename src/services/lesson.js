const Lesson = require('~/models/lesson')
const { validateFunc } = require('~/utils/validationHelper')
const { validateObjectId } = require('~/utils/helper/validateObjectId')
const { createError } = require('~/utils/errorsHelper')
const {
  lengths: { MIN_NAME_LENGTH, MAX_NAME_LENGTH }
} = require('~/consts/validation')

const lessonService = {
  createLesson: async (author, data) => {
    const { title, description, category, attachments } = data

    validateFunc.required('title', true, title)
    validateFunc.required('description', true, description)
    validateFunc.required('category', true, category)

    validateFunc.length('title', { min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH }, title)

    validateObjectId(author, 'author')
    validateObjectId(category, 'category')

    // if we have attachments, validate their IDs as well
    if (attachments !== undefined && attachments !== null) {
      if (!Array.isArray(attachments)) {
        throw createError(422, 'Attachments must be an array of ObjectIds')
      }
        
      attachments.forEach((id) => validateObjectId(id, 'attachment'))
    }

    return await Lesson.create({
      title,
      description,
      author,
      category,
      attachments
    })
  }
}

module.exports = lessonService
