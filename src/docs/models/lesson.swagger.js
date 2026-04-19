/**
 * @swagger
 * components:
 *   schemas:
 *     CreateLesson:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the lesson
 *           minLength: 1
 *           maxLength: 30
 *           example: "Intro to Algebra"
 *         description:
 *           type: string
 *           description: Description of the lesson
 *           example: "Basic algebra course content"
 *         category:
 *           type: string
 *           description: Category ID of the lesson
 *           example: "60d5ecb74b24c72b8c8b3333"
 *         attachments:
 *           type: array
 *           description: Optional list of attachment IDs
 *           items:
 *             type: string
 *           example:
 *             - "60d5ecb74b24c72b8c8b2222"
 *
 *     Lesson:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d5ecb74b24c72b8c8b4567"
 *         title:
 *           type: string
 *           example: "Intro to Algebra"
 *         description:
 *           type: string
 *           example: "Basic algebra course content"
 *         author:
 *           type: string
 *           description: User ID of the author (from auth token)
 *           example: "60d5ecb74b24c72b8c8b1111"
 *         category:
 *           type: string
 *           example: "60d5ecb74b24c72b8c8b3333"
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "60d5ecb74b24c72b8c8b2222"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T12:00:00.000Z"
 */
