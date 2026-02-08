const {
  getAllDevotions,
  findDevotionById,
  createDevotion,
} = require("../devotions");
const pool = require("../../config/databasepg");

// Mock the pool.query method
jest.mock("../../config/databasepg", () => ({
  query: jest.fn(),
}));

describe("deleteDevotion() deleteDevotion method", () => {
  // Happy Paths

  /**
   * Test: Should delete a devotion with a valid numeric id.
   * This test ensures that the function calls the database with the correct query and parameters.
   */
  test("should delete a devotion with a valid numeric id", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const id = 5;
    const result = await deleteDevotion(id);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
    expect(result).toEqual({ rowCount: 1 });
  });

  /**
   * Test: Should delete a devotion with a valid string id (numeric string).
   * This test ensures that string numbers are accepted and passed to the query.
   */
  test("should delete a devotion with a valid string id (numeric string)", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const id = "10";
    const result = await deleteDevotion(id);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
    expect(result).toEqual({ rowCount: 1 });
  });

  // Edge Cases

  /**
   * Test: Should handle deletion when id does not exist (no rows deleted).
   * This test ensures that the function returns the correct result when no rows are affected.
   */
  test("should handle deletion when id does not exist (no rows deleted)", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const id = 9999;
    const result = await deleteDevotion(id);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
    expect(result).toEqual({ rowCount: 0 });
  });

  /**
   * Test: Should throw an error if pool.query rejects (database error).
   * This test ensures that errors from the database are propagated.
   */
  test("should throw an error if pool.query rejects (database error)", async () => {
    const error = new Error("Database failure");
    pool.query.mockRejectedValueOnce(error);

    const id = 1;
    await expect(deleteDevotion(id)).rejects.toThrow("Database failure");
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
  });

  /**
   * Test: Should handle null id gracefully.
   * This test ensures that null id is passed to the query and does not throw synchronously.
   */
  test("should handle null id gracefully", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const id = null;
    const result = await deleteDevotion(id);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
    expect(result).toEqual({ rowCount: 0 });
  });

  /**
   * Test: Should handle undefined id gracefully.
   * This test ensures that undefined id is passed to the query and does not throw synchronously.
   */
  test("should handle undefined id gracefully", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    let id;
    const result = await deleteDevotion(id);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
    expect(result).toEqual({ rowCount: 0 });
  });

  /**
   * Test: Should handle non-numeric string id.
   * This test ensures that non-numeric strings are passed to the query and do not throw synchronously.
   */
  test("should handle non-numeric string id", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const id = "abc";
    const result = await deleteDevotion(id);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
    expect(result).toEqual({ rowCount: 0 });
  });

  /**
   * Test: Should handle object as id.
   * This test ensures that objects are passed to the query and do not throw synchronously.
   */
  test("should handle object as id", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const id = { foo: "bar" };
    const result = await deleteDevotion(id);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
    expect(result).toEqual({ rowCount: 0 });
  });

  /**
   * Test: Should handle array as id.
   * This test ensures that arrays are passed to the query and do not throw synchronously.
   */
  test("should handle array as id", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const id = [1, 2, 3];
    const result = await deleteDevotion(id);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM devotions WHERE id=$1",
      [id],
    );
    expect(result).toEqual({ rowCount: 0 });
  });
});
