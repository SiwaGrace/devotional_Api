const asyncHandler = require("express-async-handler");
const {
  getAllDevotions,
  findDevotionById,
  createDevotion,
  deleteDevotion,
  findTodayDevotion,
  findRandomDevotion,
} = require("../models/devotions");
/**
 * Retrieves all devotions from the database and sends them as a JSON response.
 * Handles any database errors by sending a 500 status with an error message.
 */
const getDevotions = asyncHandler(async (req, res) => {
  const result = await getAllDevotions();
  res.json(result.rows);
});

const getDevotionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await findDevotionById(id);
  res.json(result.rows);
});

const createADevotion = asyncHandler(async (req, res) => {
  const {
    title,
    focus,
    verse,
    insight,
    realLifeReflection,
    prayer,
    action,
    author,
  } = req.body;

  const result = await createDevotion(
    title,
    focus,
    verse,
    insight,
    realLifeReflection,
    prayer,
    action,
    author,
  );

  res.status(201).json(result.rows[0]);
});

const deleteADevotion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteDevotion(id);
  res.json(result.rows);
});

const getTodayDevotion = asyncHandler(async (req, res) => {
  const result = await findTodayDevotion();
  res.json(result.rows[0]);
});

const getRandomDevotion = asyncHandler(async (req, res) => {
  const result = await findRandomDevotion();
  res.json(result.rows[0]);
});
// const  = asyncHandler(async (req, res) => {});
module.exports = {
  getDevotions,
  getDevotionById,
  createADevotion,
  deleteADevotion,
  getTodayDevotion,
  getRandomDevotion,
};
