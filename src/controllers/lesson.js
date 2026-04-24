const lessonService = require('~/services/lesson')

const createLesson = async (req, res) => {
  const { id: author } = req.user
  const data = req.body

  const newLesson = await lessonService.createLesson(author, data)

  res.status(201).json(newLesson)
}

const getLessons = async (req, res) => {
    const lessons = await lessonService.getLessons(req.query)
    res.status(200).json(lessons)
}

const getLessonById = async (req, res) => {
  const { id } = req.params
  const lesson = await lessonService.getLessonById(id)
  res.status(200).json(lesson)
}

module.exports = {
  createLesson,
  getLessons,
  getLessonById
}
