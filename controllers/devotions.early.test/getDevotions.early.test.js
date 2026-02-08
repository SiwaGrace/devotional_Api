


const  = require('../devotions');



// jest.mock("../../config/databasepg");

describe('getDevotions() getDevotions method', () => {
  // Happy Paths
  describe('Happy Paths', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should return all devotions as JSON when query succeeds with multiple rows', async () => {
      // This test aims to verify that getDevotions returns the correct JSON response when the database query returns multiple rows.
      const mockRows = [
        { id: 1, title: 'Devotion 1' },
        { id: 2, title: 'Devotion 2' }
      ];
      pool.query.mockResolvedValue({ rows: mockRows });

      const req = {};
      const res = {
        json: jest.fn()
      };

      await getDevotions(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM devotions');
      expect(res.json).toHaveBeenCalledWith(mockRows);
    });

    test('should return empty array when no devotions exist', async () => {
      // This test aims to verify that getDevotions returns an empty array when the database query returns no rows.
      pool.query.mockResolvedValue({ rows: [] });

      const req = {};
      const res = {
        json: jest.fn()
      };

      await getDevotions(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM devotions');
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should handle single devotion row', async () => {
      // This test aims to verify that getDevotions correctly returns a single devotion row.
      const mockRows = [{ id: 1, title: 'Devotion 1' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const req = {};
      const res = {
        json: jest.fn()
      };

      await getDevotions(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM devotions');
      expect(res.json).toHaveBeenCalledWith(mockRows);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should handle database query throwing an error', async () => {
      // This test aims to verify that getDevotions responds with a 500 status and error message when the database query throws an error.
      const mockError = new Error('Database failure');
      pool.query.mockRejectedValue(mockError);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getDevotions(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM devotions');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });

    test('should handle result.rows being undefined', async () => {
      // This test aims to verify that getDevotions handles the case where result.rows is undefined gracefully.
      pool.query.mockResolvedValue({});

      const req = {};
      const res = {
        json: jest.fn()
      };

      await getDevotions(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM devotions');
      expect(res.json).toHaveBeenCalledWith(undefined);
    });

    test('should handle result.rows being null', async () => {
      // This test aims to verify that getDevotions handles the case where result.rows is null gracefully.
      pool.query.mockResolvedValue({ rows: null });

      const req = {};
      const res = {
        json: jest.fn()
      };

      await getDevotions(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM devotions');
      expect(res.json).toHaveBeenCalledWith(null);
    });
  });
});