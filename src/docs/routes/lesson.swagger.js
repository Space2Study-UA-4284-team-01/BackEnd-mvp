/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLesson'
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Validation error
 */

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Get list of lessons
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter lessons by category id
 *     responses:
 *       200:
 *         description: Lessons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonsResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Get lesson by id
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lesson ID
 *         schema:
 *           type: string
 *           example: 64f1c2a5b9c123456789abcd
 *     responses:
 *       200:
 *         description: Lesson retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonDetailed'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lesson not found
 *       422:
 *         description: Invalid lesson id format
 */
