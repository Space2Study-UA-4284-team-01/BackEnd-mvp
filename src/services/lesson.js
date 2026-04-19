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
  },
    
  getLessons: async (query) => {
    const { category } = query

    const filter = {}

      if (category) {
        validateObjectId(category, 'category')
        filter.category = category
    }

    const lessons = await Lesson.find(filter)
        .select('title category updatedAt')
        .populate('category', 'name')
        .sort({ updatedAt: -1 })
        .lean()

    return lessons.map((lesson) => ({
        id: lesson._id,
        title: lesson.title,
        category: lesson.category
        ? {
            id: lesson.category._id,
            name: lesson.category.name
            }
        : null,
        updatedAt: lesson.updatedAt
    }))
  }

}

module.exports = lessonService
