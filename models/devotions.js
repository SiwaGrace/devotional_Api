const pool = require("../config/databasepg");

/**
 * Retrieves all records from the 'devotions' table.
 */
const getAllDevotions = () => {
  return pool.query("SELECT * FROM devotions");
};

/**
 * Retrieves a devotion record from the database by its ID.
 *
 * @param {number} id - The unique identifier of the devotion.
 * @returns {Promise<Object>} A promise that resolves to the devotion record.
 * @throws {Error} Throws an error if the database query fails.
 */
const findDevotionById = (id) => {
  return pool.query("SELECT * FROM devotions WHERE id=$1", [id]);
};

/**
 * Inserts a new devotion record into the database with the provided details.
 * Accepts devotion attributes and returns the inserted record.
 */
const createDevotion = (
  title,
  focus,
  verse,
  insight,
  realLifeReflection,
  prayer,
  action,
  author,
) => {
  return pool.query(
    `INSERT INTO devotions
     (title, focus, verse, insight, realLifeReflection, prayer, action, author) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [title, focus, verse, insight, realLifeReflection, prayer, action, author],
  );
};

// Update a devotion PUT /api/devotions/:id
const updateDevotion = () => {};

/**
 * Deletes a devotion record from the database by its ID.
 */
const deleteDevotion = (id) => {
  return pool.query("DELETE FROM devotions WHERE id=$1", [id]);
};

/**
 * Retrieves a daily devotion based on the current day of the year.
 * Calculates the index by cycling through all devotions and fetches the corresponding record.
 * Returns null if no devotions are available.
 */
const findTodayDevotion = async () => {
  // 1. Get total number of devotions
  const totalResult = await pool.query("SELECT COUNT(*) FROM devotions");
  const total = parseInt(totalResult.rows[0].count, 10);

  if (total === 0) return null;

  // 2. Calculate index based on day of year
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = (dayOfYear % total) + 1; // 1-based index

  // 3. Fetch devotion by index
  const result = await pool.query(
    "SELECT * FROM devotions ORDER BY id ASC OFFSET $1 LIMIT 1",
    [index - 1],
  );

  return result;
};

/**
 * Fetches a random devotion record from the database.
 */
const findRandomDevotion = async () => {
  const result = await pool.query(
    "SELECT * FROM devotions ORDER BY RANDOM() LIMIT 1",
  );
  return result;
};

// Search GET /api/devotions/search?q=faith;
const searchDevotions = () => {};

// Paginated feed GET /api/devotions?page=2&limit=5
const listDevotions = () => {};

module.exports = {
  getAllDevotions,
  findDevotionById,
  createDevotion,
  findTodayDevotion,
  findRandomDevotion,
  deleteDevotion,
};
