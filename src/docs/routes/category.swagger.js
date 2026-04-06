/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     description: Allows ADMIN or SUPERADMIN users to create a new category.
 *     tags:
 *       - Category
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 30
 *                 description: Category name (must be unique)
 *                 example: "Mathematics"
 *               appearance:
 *                 type: object
 *                 description: Optional appearance settings for the category
 *                 properties:
 *                   icon:
 *                     type: string
 *                     example: "math-icon.png"
 *                   color:
 *                     type: string
 *                     example: "#FF0000"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65f1c9a2f1a2b3c4d5e6f7g8"
 *                 name:
 *                   type: string
 *                   example: "Mathematics"
 *                 appearance:
 *                   type: object
 *                   properties:
 *                     icon:
 *                       type: string
 *                       example: "math-icon.png"
 *                     color:
 *                       type: string
 *                       example: "#FF0000"
 *                 totalOffers:
 *                   type: object
 *                   properties:
 *                     student:
 *                       type: number
 *                       example: 0
 *                     tutor:
 *                       type: number
 *                       example: 0
 *                 createdAt:
 *                   type: string
 *                   example: "2026-03-29T18:00:02.305Z"
 *                 updatedAt:
 *                   type: string
 *                   example: "2026-03-29T18:00:02.305Z"
 *       401:
 *         description: Unauthorized - Access token is missing or invalid
 *       403:
 *         description: Forbidden - User does not have ADMIN or SUPERADMIN role
 *       409:
 *         description: Category with this name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 409
 *                 code:
 *                   type: string
 *                   example: FIELD_ALREADY_EXISTS
 *                 message:
 *                   type: string
 *                   example: "'name' field(s) must be unique."
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 422
 *                 code:
 *                   type: string
 *                   example: FIELD_IS_NOT_OF_PROPER_LENGTH
 *                 message:
 *                   type: string
 *                   example: "name cannot be shorter than 1 and longer than 30 characters."
 */