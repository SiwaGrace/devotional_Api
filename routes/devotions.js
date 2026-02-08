const {
  getDevotions,
  getDevotionById,
  createADevotion,
  deleteADevotion,
  getTodayDevotion,
  getRandomDevotion,
} = require("../controllers/devotions");
const express = require("express");
const router = express.Router();

router.get("/devotions", getDevotions);
router.post("/devotions", createADevotion); //??
router.get("/devotions/today", getTodayDevotion);
router.get("/devotions/random", getRandomDevotion);
router.get("/devotions/:id", getDevotionById);
router.delete("/devotions/:id", deleteADevotion); //?does it works

module.exports = router;
