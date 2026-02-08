const { createDevotion } = require("../devotions");
const pool = require("../../config/databasepg");

jest.mock("../../config/databasepg");

describe("createDevotion() createDevotion method", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    test("should successfully create a devotion with all valid fields", async () => {
      // This test ensures that a devotion is created when all fields are provided and valid.
      const devotionData = [
        "Title",
        "Focus",
        "Verse",
        "Insight",
        "Real Life Reflection",
        "Prayer",
        "Action",
        "Author",
      ];
      const expectedResult = {
        rows: [
          {
            id: 1,
            ...Object.fromEntries([
              ["title", devotionData[0]],
              ["focus", devotionData[1]],
              ["verse", devotionData[2]],
              ["insight", devotionData[3]],
              ["realLifeReflection", devotionData[4]],
              ["prayer", devotionData[5]],
              ["action", devotionData[6]],
              ["author", devotionData[7]],
            ]),
          },
        ],
      };

      pool.query.mockResolvedValue(expectedResult);

      const result = await createDevotion(...devotionData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData,
      );
      expect(result).toEqual(expectedResult);
    });

    test("should create a devotion with minimal non-empty strings", async () => {
      // This test ensures that the function works with minimal valid string inputs.
      const devotionData = ["T", "F", "V", "I", "R", "P", "A", "Au"];
      const expectedResult = {
        rows: [
          {
            id: 2,
            ...Object.fromEntries([
              ["title", devotionData[0]],
              ["focus", devotionData[1]],
              ["verse", devotionData[2]],
              ["insight", devotionData[3]],
              ["realLifeReflection", devotionData[4]],
              ["prayer", devotionData[5]],
              ["action", devotionData[6]],
              ["author", devotionData[7]],
            ]),
          },
        ],
      };

      pool.query.mockResolvedValue(expectedResult);

      const result = await createDevotion(...devotionData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData,
      );
      expect(result).toEqual(expectedResult);
    });

    test("should create a devotion with special characters in fields", async () => {
      // This test ensures that special characters are handled correctly.
      const devotionData = [
        "Title!@#$",
        "Focus%^&*",
        "Verse()_+",
        "Insight{}|",
        'Reflection:"<>?',
        "Prayer[];",
        "Action,./",
        "Author`~",
      ];
      const expectedResult = {
        rows: [
          {
            id: 3,
            ...Object.fromEntries([
              ["title", devotionData[0]],
              ["focus", devotionData[1]],
              ["verse", devotionData[2]],
              ["insight", devotionData[3]],
              ["realLifeReflection", devotionData[4]],
              ["prayer", devotionData[5]],
              ["action", devotionData[6]],
              ["author", devotionData[7]],
            ]),
          },
        ],
      };

      pool.query.mockResolvedValue(expectedResult);

      const result = await createDevotion(...devotionData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("should handle empty strings for all fields", async () => {
      // This test checks if the function can handle empty string inputs.
      const devotionData = ["", "", "", "", "", "", "", ""];
      const expectedResult = {
        rows: [
          {
            id: 4,
            ...Object.fromEntries([
              ["title", devotionData[0]],
              ["focus", devotionData[1]],
              ["verse", devotionData[2]],
              ["insight", devotionData[3]],
              ["realLifeReflection", devotionData[4]],
              ["prayer", devotionData[5]],
              ["action", devotionData[6]],
              ["author", devotionData[7]],
            ]),
          },
        ],
      };

      pool.query.mockResolvedValue(expectedResult);

      const result = await createDevotion(...devotionData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData,
      );
      expect(result).toEqual(expectedResult);
    });

    test("should handle null values for all fields", async () => {
      // This test checks if the function can handle null inputs.
      const devotionData = [null, null, null, null, null, null, null, null];
      const expectedResult = {
        rows: [
          {
            id: 5,
            ...Object.fromEntries([
              ["title", devotionData[0]],
              ["focus", devotionData[1]],
              ["verse", devotionData[2]],
              ["insight", devotionData[3]],
              ["realLifeReflection", devotionData[4]],
              ["prayer", devotionData[5]],
              ["action", devotionData[6]],
              ["author", devotionData[7]],
            ]),
          },
        ],
      };

      pool.query.mockResolvedValue(expectedResult);

      const result = await createDevotion(...devotionData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData,
      );
      expect(result).toEqual(expectedResult);
    });

    test("should throw an error if pool.query rejects", async () => {
      // This test ensures that errors from the database are propagated.
      const devotionData = [
        "Title",
        "Focus",
        "Verse",
        "Insight",
        "Reflection",
        "Prayer",
        "Action",
        "Author",
      ];
      const error = new Error("Database error");
      pool.query.mockRejectedValue(error);

      await expect(createDevotion(...devotionData)).rejects.toThrow(
        "Database error",
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData,
      );
    });

    test("should handle missing arguments (undefined)", async () => {
      // This test checks if the function can handle undefined arguments.
      const devotionData = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ];
      const expectedResult = {
        rows: [
          {
            id: 6,
            ...Object.fromEntries([
              ["title", devotionData[0]],
              ["focus", devotionData[1]],
              ["verse", devotionData[2]],
              ["insight", devotionData[3]],
              ["realLifeReflection", devotionData[4]],
              ["prayer", devotionData[5]],
              ["action", devotionData[6]],
              ["author", devotionData[7]],
            ]),
          },
        ],
      };

      pool.query.mockResolvedValue(expectedResult);

      const result = await createDevotion(...devotionData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData,
      );
      expect(result).toEqual(expectedResult);
    });

    test("should handle extra arguments (ignores extras)", async () => {
      // This test checks if extra arguments are ignored and only the first 8 are used.
      const devotionData = [
        "Title",
        "Focus",
        "Verse",
        "Insight",
        "Reflection",
        "Prayer",
        "Action",
        "Author",
        "Extra1",
        "Extra2",
      ];
      const expectedResult = {
        rows: [
          {
            id: 7,
            ...Object.fromEntries([
              ["title", devotionData[0]],
              ["focus", devotionData[1]],
              ["verse", devotionData[2]],
              ["insight", devotionData[3]],
              ["realLifeReflection", devotionData[4]],
              ["prayer", devotionData[5]],
              ["action", devotionData[6]],
              ["author", devotionData[7]],
            ]),
          },
        ],
      };

      pool.query.mockResolvedValue(expectedResult);

      // Only pass the first 8 arguments
      const result = await createDevotion(...devotionData.slice(0, 8));

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData.slice(0, 8),
      );
      expect(result).toEqual(expectedResult);
    });

    test("should handle very long strings in fields", async () => {
      // This test checks if the function can handle very long string inputs.
      const longString = "a".repeat(10000);
      const devotionData = [
        longString,
        longString,
        longString,
        longString,
        longString,
        longString,
        longString,
        longString,
      ];
      const expectedResult = {
        rows: [
          {
            id: 8,
            ...Object.fromEntries([
              ["title", devotionData[0]],
              ["focus", devotionData[1]],
              ["verse", devotionData[2]],
              ["insight", devotionData[3]],
              ["realLifeReflection", devotionData[4]],
              ["prayer", devotionData[5]],
              ["action", devotionData[6]],
              ["author", devotionData[7]],
            ]),
          },
        ],
      };

      pool.query.mockResolvedValue(expectedResult);

      const result = await createDevotion(...devotionData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO devotions"),
        devotionData,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
