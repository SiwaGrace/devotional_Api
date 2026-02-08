const { getAllDevotions } = require("../devotions");
const pool = require("../../config/databasepg");

// models/devotions.test.js
jest.mock("../../config/databasepg");

describe("getAllDevotions() getAllDevotions method", () => {
  // Happy Paths
  describe("Happy Paths", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should return all devotions when database returns multiple rows", async () => {
      // This test aims to verify that getAllDevotions returns all rows from the devotions table.
      const mockRows = [
        { id: 1, title: "Devotion 1", content: "Content 1" },
        { id: 2, title: "Devotion 2", content: "Content 2" },
      ];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await getAllDevotions();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM devotions");
      expect(result).toEqual({ rows: mockRows });
    });

    test("should return an empty array when there are no devotions in the database", async () => {
      // This test aims to verify that getAllDevotions returns an empty array when the table is empty.
      pool.query.mockResolvedValue({ rows: [] });

      const result = await getAllDevotions();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM devotions");
      expect(result).toEqual({ rows: [] });
    });

    test("should return a single devotion when only one exists in the database", async () => {
      // This test aims to verify that getAllDevotions returns a single row when only one devotion exists.
      const mockRows = [{ id: 1, title: "Devotion 1", content: "Content 1" }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await getAllDevotions();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM devotions");
      expect(result).toEqual({ rows: mockRows });
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should propagate database errors", async () => {
      // This test aims to verify that getAllDevotions propagates errors thrown by the database.
      const error = new Error("Database connection failed");
      pool.query.mockRejectedValue(error);

      await expect(getAllDevotions()).rejects.toThrow(
        "Database connection failed",
      );
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM devotions");
    });

    test("should handle unexpected response structure from database", async () => {
      // This test aims to verify that getAllDevotions returns the raw response if the database returns an unexpected structure.
      const unexpectedResponse = { unexpected: "value" };
      pool.query.mockResolvedValue(unexpectedResponse);

      const result = await getAllDevotions();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM devotions");
      expect(result).toEqual(unexpectedResponse);
    });

    test("should handle null response from database", async () => {
      // This test aims to verify that getAllDevotions returns null if the database returns null.
      pool.query.mockResolvedValue(null);

      const result = await getAllDevotions();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM devotions");
      expect(result).toBeNull();
    });
  });
});
