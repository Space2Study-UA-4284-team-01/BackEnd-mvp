/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - appearance
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the category
 *           example: "60d5ecb74b24c72b8c8b4567"
 *         name:
 *           type: string
 *           description: The name of the category
 *           minLength: 1
 *           maxLength: 30
 *           example: "Mathematics"
 *         appearance:
 *           type: object
 *           required:
 *             - icon
 *             - color
 *           properties:
 *             icon:
 *               type: string
 *               description: Path to the category icon
 *               example: "mocked-path-to-icon"
 *             color:
 *               type: string
 *               description: Color of the category icon
 *               example: "#66C42C"
 *         totalOffers:
 *           type: object
 *           description: Total number of offers in the category by role
 *           properties:
 *             student:
 *               type: number
 *               description: Number of student offers
 *               example: 10
 *             tutor:
 *               type: number
 *               description: Number of tutor offers
 *               example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the category was created
 *           example: "2023-10-01T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the category was last updated
 *           example: "2023-10-01T12:00:00.000Z"
 *       example:
 *         _id: "60d5ecb74b24c72b8c8b4567"
 *         name: "Mathematics"
 *         appearance:
 *           icon: "mocked-path-to-icon"
 *           color: "#66C42C"
 *         totalOffers:
 *           student: 10
 *           tutor: 5
 *         createdAt: "2023-10-01T12:00:00.000Z"
 *         updatedAt: "2023-10-01T12:00:00.000Z"
 */
