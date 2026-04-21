/**
 * @swagger
 * /location/countries:
 *   get:
 *     summary: Get all countries
 *     description: Returns an array of objects containing country names and their ISO2 codes. Requires authentication.
 *     tags:
 *       - Location
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of countries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Ukraine
 *                   iso2:
 *                     type: string
 *                     example: UA
 *       401:
 *         description: Unauthorized - Access token is missing or invalid.
 *       502:
 *         description: External Server Error - Issues with the external API or server logic.
 */

/**
 * @swagger
 * /location/countries/{countryIso}/cities:
 *   get:
 *     summary: Get cities by country ISO code
 *     description: Fetches all states for a given country and merges all cities into a single alphabetically sorted list (A-Z). Duplicate city names are allowed because they may belong to different states.
 *     tags:
 *       - Location
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: countryIso
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISO2 code of the country (e.g., UA, US, GB).
 *         example: UA
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of cities (sorted alphabetically).
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                 example:
 *                   - name: Kyiv
 *                   - name: Lviv
 *       401:
 *         description: Unauthorized - Access token is missing or invalid.
 *       404:
 *         description: Not Found - No states or cities found for the provided ISO code.
 *       502:
 *         description: External Server Error - External API failure (e.g., Forbidden or Invalid API Key).
 */
