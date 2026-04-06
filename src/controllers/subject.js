const subjectService = require('~/services/subject')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

const createSubject = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createError(422, errors.BODY_IS_NOT_DEFINED)
  }
  const data = req.body

  const newSubject = await subjectService.createSubject(data)
  res.status(201).json({ data: newSubject })
}

module.exports = {
  createSubject
}
