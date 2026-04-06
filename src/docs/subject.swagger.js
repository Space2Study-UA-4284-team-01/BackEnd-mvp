/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     description: Only admins and super admins can create subjects.
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 description: Optional description of the subject
 *           example:
 *             name: Mathematics
 *             description: Basic math subject
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
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       401:
 *         description: Unauthorized (user is not authenticated)
 *       403:
 *         description: Forbidden (user does not have permission)
 *       422:
 *         description: Validation error
 *       409:
 *         description: Subject with the specified name already exists
 *       500:
 *         description: Internal server error
 */
