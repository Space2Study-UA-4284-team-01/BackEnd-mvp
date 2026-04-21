/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user with email and password, returns access token and sets cookies.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=eyJ...; Path=/; HttpOnly; Secure; SameSite=None; Domain=localhost, refreshToken=eyJ...; Path=/; HttpOnly; Secure; SameSite=None; Domain=localhost
 *       400:
 *         description: Invalid credentials or validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/confirm-email/{confirmToken}:
 *   get:
 *     summary: Confirm user email
 *     description: Confirms the user's email address using a confirmation token sent via email.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: confirmToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The confirmation token sent to the user's email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       204:
 *         description: Email confirmed successfully, no content returned
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
