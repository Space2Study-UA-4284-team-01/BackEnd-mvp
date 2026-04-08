/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the subject
 *           example: "60d5ecb74b24c72b8c8b4567"
 *         name:
 *           type: string
 *           description: Name of the subject
 *           minLength: 1
 *           maxLength: 30
 *           example: "Mathematics"
 *         category:
 *           type: string
 *           description: Category ObjectId
 *           example: "60d5ecb74b24c72b8c8b4568"
 *         totalOffers:
 *           type: object
 *           description: Total number of offers for the subject
 *           properties:
 *             student:
 *               type: number
 *               example: 0
 *             tutor:
 *               type: number
 *               example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T12:00:00.000Z"
 *       example:
 *         _id: "60d5ecb74b24c72b8c8b4567"
 *         name: "Mathematics"
 *         category: "60d5ecb74b24c72b8c8b4568"
 *         totalOffers:
 *           student: 0
 *           tutor: 0
 *         createdAt: "2023-10-01T12:00:00.000Z"
 *         updatedAt: "2023-10-01T12:00:00.000Z"
 */
