/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get a list of subjects
 *     description: Retrieve a list of subjects. Available for all authenticated users.
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
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search subjects by name (case-insensitive)
 *     responses:
 *       200:
 *         description: List of subjects
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error - invalid query parameters
 *         content:
 *           application/json:
 *             example:
 *               status: 422
 *               message: "category should be of proper type ObjectId"
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new subject
 *     description: Creates a new subject. Admin and SuperAdmin only.
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
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Subject already exists
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               missingField:
 *                 summary: Missing name
 *                 value:
 *                   status: 422
 *                   message: "name is required"
 *               invalidLength:
 *                 summary: Name too long
 *                 value:
 *                   status: 422
 *                   message: "name should be between 1 and 30 characters"
 *       500:
 *         description: Internal server error
 *
 * /subjects/{id}:
 *   get:
 *     summary: Get subject by ID
 *     description: Retrieve a subject by ID.
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subject not found
 *       422:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             example:
 *               status: 422
 *               message: "id should be of proper type ObjectId"
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update a subject
 *     description: Update subject (Admin & SuperAdmin only)
 *     tags: [Subjects]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 30
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Subject not found
 *       409:
 *         description: Subject already exists
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               emptyBody:
 *                 summary: Empty request body
 *                 value:
 *                   status: 422
 *                   message: "Body is not defined"
 *               invalidId:
 *                 summary: Invalid ID
 *                 value:
 *                   status: 422
 *                   message: "id should be of proper type ObjectId"
 *               invalidName:
 *                 summary: Invalid name
 *                 value:
 *                   status: 422
 *                   message: "name should be between 1 and 30 characters"
 *       500:
 *         description: Internal server error
 *
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
 *   delete:
 *     summary: Delete a subject by ID
 *     description: Deletes a subject by its ID. Available only for admin and super admin users.
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
 *       204:
 *         description: Subject deleted successfully
 *       401:
 *         description: Unauthorized - user is not authenticated
 *       403:
 *         description: Forbidden - user does not have permission
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
 */
