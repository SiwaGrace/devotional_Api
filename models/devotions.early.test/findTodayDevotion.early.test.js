const {
  getAllDevotions,
  findDevotionById,
  createDevotion,
} = require("../devotions");
const pool = require("../../config/databasepg");

// models/devotions.findTodayDevotion.test.js
jest.mock("../../config/databasepg");

describe("findTodayDevotion() findTodayDevotion method", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return the correct devotion for today when there are multiple devotions", async () => {
      // Test: Ensures correct devotion is returned for today when devotions exist
      // Setup: 5 devotions, today is day 100 of the year
      const totalDevotions = 5;
      const mockDevotion = { id: 2, title: "Test Devotion" };

      // Mock COUNT(*) query
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: totalDevotions.toString() }] })
        // Mock SELECT * query
        .mockResolvedValueOnce({ rows: [mockDevotion] });

      // Mock Date to a fixed day of year (e.g., April 10th, 2024 = day 101)
      const mockDate = new Date("2024-04-10T12:00:00Z");
      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const result = await findTodayDevotion();

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT COUNT(*) FROM devotions",
      );
      // Calculate expected index
      const start = new Date(mockDate.getFullYear(), 0, 0);
      const diff = mockDate - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      const index = (dayOfYear % totalDevotions) + 1;

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "SELECT * FROM devotions ORDER BY id ASC OFFSET $1 LIMIT 1",
        [index - 1],
      );
      expect(result).toEqual({ rows: [mockDevotion] });
    });

    it("should return the first devotion when today is the first day of the year", async () => {
      // Test: Ensures first devotion is returned on Jan 1st
      const totalDevotions = 3;
      const mockDevotion = { id: 1, title: "First Devotion" };

      pool.query
        .mockResolvedValueOnce({ rows: [{ count: totalDevotions.toString() }] })
        .mockResolvedValueOnce({ rows: [mockDevotion] });

      const mockDate = new Date("2024-01-01T00:00:00Z");
      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const result = await findTodayDevotion();

      // Jan 1st: dayOfYear = 1, index = (1 % 3) + 1 = 2
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "SELECT * FROM devotions ORDER BY id ASC OFFSET $1 LIMIT 1",
        [1],
      );
      expect(result).toEqual({ rows: [mockDevotion] });
    });

    it("should cycle through devotions if day of year exceeds total devotions", async () => {
      // Test: Ensures cycling through devotions when dayOfYear > total
      const totalDevotions = 2;
      const mockDevotion = { id: 1, title: "Cycled Devotion" };

      pool.query
        .mockResolvedValueOnce({ rows: [{ count: totalDevotions.toString() }] })
        .mockResolvedValueOnce({ rows: [mockDevotion] });

      // Dec 31st, 2024: dayOfYear = 366 (leap year)
      const mockDate = new Date("2024-12-31T00:00:00Z");
      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const result = await findTodayDevotion();

      // dayOfYear = 366, index = (366 % 2) + 1 = 1
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "SELECT * FROM devotions ORDER BY id ASC OFFSET $1 LIMIT 1",
        [0],
      );
      expect(result).toEqual({ rows: [mockDevotion] });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return null if there are no devotions in the database", async () => {
      // Test: Ensures null is returned when no devotions exist
      pool.query.mockResolvedValueOnce({ rows: [{ count: "0" }] });

      const result = await findTodayDevotion();

      expect(pool.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM devotions");
      expect(result).toBeNull();
    });

    it("should handle database error when counting devotions", async () => {
      // Test: Ensures error is thrown if COUNT query fails
      pool.query.mockRejectedValueOnce(new Error("DB error"));

      await expect(findTodayDevotion()).rejects.toThrow("DB error");
      expect(pool.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM devotions");
    });

    it("should handle database error when fetching devotion by index", async () => {
      // Test: Ensures error is thrown if SELECT query fails
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: "2" }] })
        .mockRejectedValueOnce(new Error("SELECT error"));

      await expect(findTodayDevotion()).rejects.toThrow("SELECT error");
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT COUNT(*) FROM devotions",
      );
    });

    it("should handle non-integer count value gracefully", async () => {
      // Test: Ensures function throws if count is not a number
      pool.query.mockResolvedValueOnce({ rows: [{ count: "notanumber" }] });

      await expect(findTodayDevotion()).rejects.toThrow();
    });

    it("should handle missing rows property in COUNT result", async () => {
      // Test: Ensures function throws if rows property is missing
      pool.query.mockResolvedValueOnce({});

      await expect(findTodayDevotion()).rejects.toThrow();
    });

    it("should handle missing count property in COUNT result", async () => {
      // Test: Ensures function throws if count property is missing
      pool.query.mockResolvedValueOnce({ rows: [{}] });

      await expect(findTodayDevotion()).rejects.toThrow();
    });

    it("should handle devotion query returning empty rows", async () => {
      // Test: Ensures function returns empty result if devotion query returns no rows
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: "1" }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await findTodayDevotion();

      expect(result).toEqual({ rows: [] });
    });
  });
});
