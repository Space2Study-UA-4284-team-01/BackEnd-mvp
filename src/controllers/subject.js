const subjectService = require('~/services/subject')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

const getSubjects = async (req, res) => {
  const subjects = await subjectService.getSubjects(req.query)
  res.status(200).json({ data: subjects })
}

const getSubjectById = async (req, res) => {
  const { id } = req.params
  const subject = await subjectService.getSubjectById(id)
  res.status(200).json({ data: subject })
}

const createSubject = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createError(422, errors.BODY_IS_NOT_DEFINED)
  }
  const data = req.body

  const newSubject = await subjectService.createSubject(data)
  res.status(201).json({ data: newSubject })
}

const updateSubject = async (req, res) => {
  const { id } = req.params

  if (!req.body || Object.keys(req.body).length === 0) {
    throw createError(422, errors.BODY_IS_NOT_DEFINED)
  }
  const data = req.body

  const updatedSubject = await subjectService.updateSubject(id, data)
  res.status(200).json({ data: updatedSubject })
}

const deleteSubject = async (req, res) => {
  const { id } = req.params
  await subjectService.deleteSubject(id)
  res.status(204).send()
}  

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
}
