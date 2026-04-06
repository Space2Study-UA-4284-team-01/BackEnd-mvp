require('~/initialization/envSetup')

jest.mock('~/services/token')
jest.mock('~/services/user')
jest.mock('~/services/email')

const authService = require('~/services/auth')
const tokenService = require('~/services/token')
const userService = require('~/services/user')
const { tokenNames } = require('~/consts/auth')
const errors = require('~/consts/errors')

describe('Auth service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('confirmEmail', () => {
    it('should throw BAD_CONFIRM_TOKEN when token is invalid', async () => {
      tokenService.validateConfirmToken.mockReturnValue(null)
      tokenService.findToken.mockResolvedValue(null)

      await expect(authService.confirmEmail('invalid-token')).rejects.toMatchObject({
        code: errors.BAD_CONFIRM_TOKEN.code
      })

      expect(tokenService.validateConfirmToken).toHaveBeenCalledWith('invalid-token')
      expect(tokenService.findToken).toHaveBeenCalledWith('invalid-token', tokenNames.CONFIRM_TOKEN)
    })

    it('should set isEmailConfirmed and remove confirm token when token is valid', async () => {
      tokenService.validateConfirmToken.mockReturnValue({ id: 'userId' })
      tokenService.findToken.mockResolvedValue({ confirmToken: 'valid-token' })

      await authService.confirmEmail('valid-token')

      expect(userService.privateUpdateUser).toHaveBeenCalledWith('userId', { isEmailConfirmed: true })
      expect(tokenService.saveToken).toHaveBeenCalledWith('userId', null, tokenNames.CONFIRM_TOKEN)
    })
  })
})
