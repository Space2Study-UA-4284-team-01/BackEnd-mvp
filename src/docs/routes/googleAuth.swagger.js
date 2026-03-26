/**
 * @swagger
 * /auth/google-auth:
 *   post:
 *     summary: Authenticate user with Google OAuth
 *     description: Logs in or signs up a user using Google OAuth token. Requires a valid Google credential token and user role.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - role
 *             properties:
 *               token:
 *                 type: object
 *                 properties:
 *                   credential:
 *                     type: string
 *                     description: Google OAuth credential token
 *                     example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
 *               role:
 *                 type: string
 *                 enum: [student, tutor, admin]
 *                 description: User role
 *                 example: "student"
 *     responses:
 *       200:
 *         description: Successful authentication
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
 *         description: Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing token credential"
 *       500:
 *         description: Internal server error
 */
