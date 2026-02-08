const {
  getAllDevotions,
  findDevotionById,
  createDevotion,
} = require("../devotions");
const pool = require("../../config/databasepg");

// models/devotions.findRandomDevotion.test.js
jest.mock("../../config/databasepg");

describe("findRandomDevotion() findRandomDevotion method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should return a single devotion when one exists", async () => {
      // This test ensures that the function returns a devotion when the database has one record.
      const mockDevotion = {
        id: 1,
        title: "Faith",
        focus: "Trust",
        verse: "John 3:16",
      };
      pool.query.mockResolvedValueOnce({ rows: [mockDevotion], rowCount: 1 });

      const result = await findRandomDevotion();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions ORDER BY RANDOM() LIMIT 1",
      );
      expect(result).toEqual({ rows: [mockDevotion], rowCount: 1 });
    });

    test("should return a random devotion when multiple devotions exist", async () => {
      // This test ensures that the function returns a devotion when multiple records exist.
      const mockDevotions = [
        { id: 1, title: "Faith" },
        { id: 2, title: "Hope" },
        { id: 3, title: "Love" },
      ];
      // Simulate that the query returns one random devotion
      pool.query.mockResolvedValueOnce({
        rows: [mockDevotions[1]],
        rowCount: 1,
      });

      const result = await findRandomDevotion();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions ORDER BY RANDOM() LIMIT 1",
      );
      expect(result).toEqual({ rows: [mockDevotions[1]], rowCount: 1 });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should return an empty result when no devotions exist", async () => {
      // This test ensures that the function returns an empty result when the database has no records.
      pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

      const result = await findRandomDevotion();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions ORDER BY RANDOM() LIMIT 1",
      );
      expect(result).toEqual({ rows: [], rowCount: 0 });
    });

    test("should propagate database errors", async () => {
      // This test ensures that the function throws an error if the database query fails.
      const error = new Error("Database connection failed");
      pool.query.mockRejectedValueOnce(error);

      await expect(findRandomDevotion()).rejects.toThrow(
        "Database connection failed",
      );
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions ORDER BY RANDOM() LIMIT 1",
      );
    });

    test("should handle unexpected result structure gracefully", async () => {
      // This test ensures that the function can handle unexpected result structure from the database.
      pool.query.mockResolvedValueOnce({ unexpected: "value" });

      const result = await findRandomDevotion();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions ORDER BY RANDOM() LIMIT 1",
      );
      expect(result).toEqual({ unexpected: "value" });
    });
  });
});
