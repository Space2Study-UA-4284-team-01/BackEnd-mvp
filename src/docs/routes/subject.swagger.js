/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     description: Creates a new subject. Available only for admin and super admin users.
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 30
 *                 description: Subject name
 *               category:
 *                 type: string
 *                 description: MongoDB ObjectId of the category the subject belongs to
 *                 pattern: "^[0-9a-fA-F]{24}$"
 *           example:
 *             name: Mathematics
 *             category: 5e8f8f8f8f8f8f8f8f8f8f8f
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Subject ID
 *                     name:
 *                       type: string
 *                       description: Subject name
 *                     category:
 *                       type: string
 *                       description: Category ObjectId
 *                     totalOffers:
 *                       type: object
 *                       properties:
 *                         student:
 *                           type: integer
 *                           example: 0
 *                         tutor:
 *                           type: integer
 *                           example: 0
 *       401:
 *         description: Unauthorized (user is not authenticated)
 *       403:
 *         description: Forbidden (user does not have permission)
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 422
 *                 message:
 *                   type: string
 *                   example: Invalid subject data
 *       409:
 *         description: Subject with the specified name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: Subject with this name already exists
 *       500:
 *         description: Internal server error
 */
