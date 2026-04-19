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
 *                       description: Subject ID
 *                       example: "60d5ecb74b24c72b8c8b4567"
 *                     name:
 *                       type: string
 *                       description: Subject name
 *                       example: "Algebra"
 *                     category:
 *                       type: string
 *                       description: Category ObjectId
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 409
 *                 code:
 *                   type: string
 *                   example: SUBJECT_ALREADY_EXISTS
 *                 message:
 *                   type: string
 *                   example: "Subject with the specified name already exists."
 *       422:
 *         description: Validation error - missing or invalid fields
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
 *                   example: FIELD_IS_NOT_DEFINED
 *                 message:
 *                   type: string
 *                   example: "name should not be null or undefined"
 *       500:
 *         description: Internal server error
 *
 * /categories/{id}/subjects/names:
 *   get:
 *     summary: Get subject names by category ID
 *     description: >
 *       Returns an array of subject name strings that belong to the specified category.
 *       Available for all authenticated users (student, tutor, admin, superadmin).
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
 *         description: Subject names retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: List of subject names belonging to the category
 *                   items:
 *                     type: string
 *                   example: ["Algebra", "Calculus", "Geometry"]
 *       401:
 *         description: Unauthorized - user is not authenticated
 *       404:
 *         description: Category with the specified ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 code:
 *                   type: string
 *                   example: CATEGORY_NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: "Category with the specified ID was not found."
 *       422:
 *         description: Validation error - id is not a valid ObjectId
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
 *
 * /categories/subjects/names:
 *   get:
 *     summary: Get all subject names
 *     description: >
 *       Returns the names of every subject in the database regardless of category.
 *       Available for all authenticated users (student, tutor, admin, superadmin).
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All subject names retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: List of all subject names across every category
 *                   items:
 *                     type: string
 *                   example: ["Algebra", "Quantum Physics", "Organic Chemistry"]
 *       401:
 *         description: Unauthorized - user is not authenticated
 */
