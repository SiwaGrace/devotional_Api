const pool = require("../config/databasepg");
const data = require("./data");

async function seed() {
  try {
    for (const d of data) {
      await pool.query(
        "INSERT INTO devotions (title, focus, verse, insight, realLifeReflection, prayer, action, author) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          d.title,
          d.focus,
          d.verse,
          d.insight,
          d.realLifeReflection,
          d.prayer,
          d.action,
          d.author,
        ],
      );
    }
    console.log("seeding complete!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
