/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Get subject by ID
 *     description: Retrieves a subject by its ID. Available for all authenticated users.
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the subject
 *     responses:
 *       200:
 *         description: Subject retrieved successfully
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
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: Category ID
 *                         name:
 *                           type: string
 *                           description: Category name
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
 *         description: Unauthorized - user is not authenticated
 *       404:
 *         description: Subject with the specified ID was not found
 *       422:
 *         description: Validation error - invalid ID format
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
 *                   example: id should be of proper type ObjectId
 *       500:
 *         description: Internal server error
 *
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
