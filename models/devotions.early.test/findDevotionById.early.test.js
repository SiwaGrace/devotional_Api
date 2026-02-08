const { getAllDevotions } = require("../devotions");
const pool = require("../../config/databasepg");

// models/devotions.test.js
// Mock the pool.query method
jest.mock("../../config/databasepg", () => ({
  query: jest.fn(),
}));

describe("findDevotionById() findDevotionById method", () => {
  // Happy Paths
  describe("Happy Paths", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should retrieve a devotion by a valid numeric id", async () => {
      // This test aims to verify that the function returns the correct result for a valid id.
      const mockId = 1;
      const mockResult = { rows: [{ id: 1, title: "Test Devotion" }] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await findDevotionById(mockId);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions WHERE id=1",
      );
      expect(result).toBe(mockResult);
    });

    test("should handle string id that is a valid number", async () => {
      // This test aims to verify that the function works when id is a string representing a number.
      const mockId = "2";
      const mockResult = { rows: [{ id: 2, title: "Another Devotion" }] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await findDevotionById(mockId);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions WHERE id=2",
      );
      expect(result).toBe(mockResult);
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should handle id as 0", async () => {
      // This test aims to verify that the function works when id is 0.
      const mockId = 0;
      const mockResult = { rows: [] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await findDevotionById(mockId);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions WHERE id=0",
      );
      expect(result).toBe(mockResult);
    });

    test("should handle negative id", async () => {
      // This test aims to verify that the function works when id is negative.
      const mockId = -5;
      const mockResult = { rows: [] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await findDevotionById(mockId);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions WHERE id=-5",
      );
      expect(result).toBe(mockResult);
    });

    test("should handle id as a non-numeric string", async () => {
      // This test aims to verify that the function handles non-numeric string id.
      const mockId = "abc";
      const mockError = new Error('invalid input syntax for integer: "abc"');
      pool.query.mockRejectedValueOnce(mockError);

      await expect(findDevotionById(mockId)).rejects.toThrow(mockError);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions WHERE id=abc",
      );
    });

    test("should handle id as undefined", async () => {
      // This test aims to verify that the function handles undefined id.
      const mockId = undefined;
      const mockError = new Error('column "id" does not exist');
      pool.query.mockRejectedValueOnce(mockError);

      await expect(findDevotionById(mockId)).rejects.toThrow(mockError);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions WHERE id=undefined",
      );
    });

    test("should handle id as null", async () => {
      // This test aims to verify that the function handles null id.
      const mockId = null;
      const mockError = new Error('column "id" does not exist');
      pool.query.mockRejectedValueOnce(mockError);

      await expect(findDevotionById(mockId)).rejects.toThrow(mockError);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions WHERE id=null",
      );
    });

    test("should propagate database errors", async () => {
      // This test aims to verify that the function propagates errors thrown by the database.
      const mockId = 3;
      const mockError = new Error("Database connection error");
      pool.query.mockRejectedValueOnce(mockError);

      await expect(findDevotionById(mockId)).rejects.toThrow(mockError);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM devotions WHERE id=3",
      );
    });
  });
});
