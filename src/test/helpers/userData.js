const {
  roles: { ADMIN, STUDENT, TUTOR }
} = require('~/consts/auth')

const baseUser = {
  firstName: 'Test',
  lastName: 'User',
  password: 'testpass',
  appLanguage: 'en',
  isEmailConfirmed: true,
  lastLogin: new Date().toJSON()
}

const adminUserData = {
  ...baseUser,
  role: ADMIN,
  email: 'admin@example.com',
  lastLoginAs: ADMIN
}

const studentUserData = {
  ...baseUser,
  role: STUDENT,
  email: 'student@example.com',
  lastLoginAs: STUDENT
}

const tutorUserData = {
  ...baseUser,
  role: TUTOR,
  email: 'tutor@example.com',
  lastLoginAs: TUTOR
}

module.exports = {
  adminUserData,
  studentUserData,
  tutorUserData
}
