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
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: MongoDB ObjectId of the subject
 *         example: "60d5ecb74b24c72b8c8b4567"
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
 *                       example: "60d5ecb74b24c72b8c8b4567"
 *                     name:
 *                       type: string
 *                       example: "Algebra"
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: Category ID
 *                           example: "60d5ecb74b24c72b8c8b4568"
 *                         name:
 *                           type: string
 *                           description: Category name
 *                           example: "Mathematics"
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
 *                 code:
 *                   type: string
 *                   example: FIELD_IS_NOT_OF_PROPER_TYPE
 *                 message:
 *                   type: string
 *                   example: "id should be of type ObjectId"
 *       500:
 *         description: Internal server error
 *
 * /subjects:
 *   get:
 *     summary: Get a list of subjects
 *     description: Retrieve a list of subjects with optional filtering by category or name. Available for all authenticated users.
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Filter subjects by category ObjectId
 *         example: "60d5ecb74b24c72b8c8b4568"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search subjects by name (case-insensitive partial match)
 *         example: "alg"
 *     responses:
 *       200:
 *         description: List of subjects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subject'
 *       401:
 *         description: Unauthorized - user is not authenticated
 *       403:
 *         description: Forbidden - user does not have permission
 *       422:
 *         description: Validation error - invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 422
 *                 code:
 *                   type: string
 *                   example: FIELD_IS_NOT_OF_PROPER_TYPE
 *                 message:
 *                   type: string
 *                   example: "category should be of type ObjectId"
 *       500:
 *         description: Internal server error
 *
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
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 30
 *                 description: Subject name (must be unique)
 *                 example: "Algebra"
 *               category:
 *                 type: string
 *                 description: MongoDB ObjectId of the category the subject belongs to
 *                 example: "60d5ecb74b24c72b8c8b4568"
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
 *                       example: "60d5ecb74b24c72b8c8b4567"
 *                     name:
 *                       type: string
 *                       example: "Algebra"
 *                     category:
 *                       type: string
 *                       example: "60d5ecb74b24c72b8c8b4568"
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
 *       403:
 *         description: Forbidden - user does not have admin or superadmin role
 *       409:
 *         description: Subject with the specified name already exists
 *       422:
 *         description: Validation error - missing or invalid fields
 *       500:
 *         description: Internal server error
 *
 * /categories/{id}/subjects/names:
 *   get:
 *     summary: Get subject names by category ID
 *     description: >
 *       Returns an array of subject objects that belong to the specified category.
 *       Available for all authenticated users.
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: MongoDB ObjectId of the category
 *         example: "60d5ecb74b24c72b8c8b4568"
 *     responses:
 *       200:
 *         description: Subject list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: List of subjects belonging to the category
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         pattern: "^[0-9a-fA-F]{24}$"
 *                         example: "60d5ecb74b24c72b8c8b4568"
 *                       name:
 *                         type: string
 *                         example: "Algebra"
 *                     required:
 *                       - _id
 *                       - name
 *             example:
 *               data:
 *                 - _id: "60d5ecb74b24c72b8c8b4568"
 *                   name: "Algebra"
 *                 - _id: "60d5ecb74b24c72b8c8b4569"
 *                   name: "Calculus"
 *       401:
 *         description: Unauthorized - user is not authenticated
 *       404:
 *         description: Category not found
 *       422:
 *         description: Validation error - invalid ObjectId
 *
 * /categories/subjects/names:
 *   get:
 *     summary: Get all subject names
 *     description: Returns all subjects across all categories. Available for all authenticated users.
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Subject list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: List of all subjects
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         pattern: "^[0-9a-fA-F]{24}$"
 *                         example: "60d5ecb74b24c72b8c8b4568"
 *                       name:
 *                         type: string
 *                         example: "Algebra"
 *                     required:
 *                       - _id
 *                       - name
 *             example:
 *               data:
 *                 - _id: "60d5ecb74b24c72b8c8b4568"
 *                   name: "Algebra"
 *                 - _id: "60d5ecb74b24c72b8c8b4569"
 *                   name: "Quantum Physics"
 *       401:
 *         description: Unauthorized - user is not authenticated
 */
