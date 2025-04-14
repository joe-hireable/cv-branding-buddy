import { createClient } from '@supabase/supabase-js';
import { QueryBuilder } from '../queryBuilder';
import { Database } from '../types';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('QueryBuilder', () => {
  let queryBuilder: QueryBuilder<Database>;
  let mockSupabaseClient: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock Supabase client with Promise-based responses
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      like: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      single: jest.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
      maybeSingle: jest.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
      throwOnError: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => Promise.resolve(callback({ data: null, error: null }))),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

    // Create query builder instance
    queryBuilder = new QueryBuilder<Database>(mockSupabaseClient);
  });

  describe('select', () => {
    it('should build a select query', async () => {
      mockSupabaseClient.then.mockImplementationOnce((callback) => 
        Promise.resolve(callback({ 
          data: { id: '123', name: 'Test', email: 'test@example.com' }, 
          error: null 
        }))
      );

      const result = await queryBuilder
        .from('profiles')
        .select('id, name, email')
        .eq('id', '123')
        .single();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('id, name, email');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
      expect(result).toEqual({ 
        data: { id: '123', name: 'Test', email: 'test@example.com' }, 
        error: null 
      });
    });
  });

  describe('insert', () => {
    it('should build an insert query', async () => {
      const data = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
      };

      mockSupabaseClient.then.mockImplementationOnce((callback) => 
        Promise.resolve(callback({ 
          data: { ...data }, 
          error: null 
        }))
      );

      const result = await queryBuilder
        .from('profiles')
        .insert(data)
        .select()
        .single();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(data);
      expect(mockSupabaseClient.select).toHaveBeenCalled();
      expect(result).toEqual({ 
        data: { ...data }, 
        error: null 
      });
    });
  });

  describe('update', () => {
    it('should build an update query', async () => {
      const data = {
        name: 'Updated Name',
      };

      mockSupabaseClient.then.mockImplementationOnce((callback) => 
        Promise.resolve(callback({ 
          data: { id: '123', ...data }, 
          error: null 
        }))
      );

      const result = await queryBuilder
        .from('profiles')
        .update(data)
        .eq('id', '123')
        .select()
        .single();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(data);
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
      expect(mockSupabaseClient.select).toHaveBeenCalled();
      expect(result).toEqual({ 
        data: { id: '123', ...data }, 
        error: null 
      });
    });
  });

  describe('delete', () => {
    it('should build a delete query', async () => {
      mockSupabaseClient.then.mockImplementationOnce((callback) => 
        Promise.resolve(callback({ 
          data: { id: '123' }, 
          error: null 
        }))
      );

      const result = await queryBuilder
        .from('profiles')
        .delete()
        .eq('id', '123')
        .select()
        .single();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
      expect(mockSupabaseClient.select).toHaveBeenCalled();
      expect(result).toEqual({ 
        data: { id: '123' }, 
        error: null 
      });
    });
  });

  describe('filtering', () => {
    it('should support various filter operators', async () => {
      mockSupabaseClient.then.mockImplementationOnce((callback) => 
        Promise.resolve(callback({ 
          data: [{ id: '123' }], 
          error: null 
        }))
      );

      const result = await queryBuilder
        .from('profiles')
        .select()
        .eq('id', '123')
        .neq('status', 'deleted')
        .gt('age', 18)
        .gte('created_at', '2024-01-01')
        .lt('points', 100)
        .lte('last_login', '2024-03-20')
        .like('name', '%John%')
        .ilike('email', '%@example.com')
        .in('role', ['admin', 'user'])
        .execute();

      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
      expect(mockSupabaseClient.neq).toHaveBeenCalledWith('status', 'deleted');
      expect(mockSupabaseClient.gt).toHaveBeenCalledWith('age', 18);
      expect(mockSupabaseClient.gte).toHaveBeenCalledWith('created_at', '2024-01-01');
      expect(mockSupabaseClient.lt).toHaveBeenCalledWith('points', 100);
      expect(mockSupabaseClient.lte).toHaveBeenCalledWith('last_login', '2024-03-20');
      expect(mockSupabaseClient.like).toHaveBeenCalledWith('name', '%John%');
      expect(mockSupabaseClient.ilike).toHaveBeenCalledWith('email', '%@example.com');
      expect(mockSupabaseClient.in).toHaveBeenCalledWith('role', ['admin', 'user']);
      expect(result).toEqual({ 
        data: [{ id: '123' }], 
        error: null 
      });
    });
  });

  describe('pagination', () => {
    it('should support pagination', async () => {
      mockSupabaseClient.then.mockImplementationOnce((callback) => 
        Promise.resolve(callback({ 
          data: [{ id: '123' }], 
          error: null 
        }))
      );

      const result = await queryBuilder
        .from('profiles')
        .select()
        .order('created_at', { ascending: false })
        .limit(10)
        .offset(20)
        .execute();

      expect(mockSupabaseClient.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockSupabaseClient.limit).toHaveBeenCalledWith(10);
      expect(mockSupabaseClient.offset).toHaveBeenCalledWith(20);
      expect(result).toEqual({ 
        data: [{ id: '123' }], 
        error: null 
      });
    });
  });

  describe('error handling', () => {
    it('should throw on error when configured', async () => {
      const error = { message: 'Test error', code: 'TEST_ERROR' };
      
      // Create a simpler mock that directly returns a promise
      const mockQuery = {
        data: null,
        error,
        then: jest.fn().mockImplementation((callback) => Promise.resolve(callback({ data: null, error })))
      };

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        throwOnError: jest.fn().mockReturnValue(mockQuery)
      });

      await expect(
        queryBuilder
          .from('profiles')
          .select()
          .throwOnError()
          .execute()
      ).rejects.toEqual(error);
    });

    it('should not throw on error when not configured', async () => {
      const error = { message: 'Test error', code: 'TEST_ERROR' };
      
      // Create a simpler mock that directly returns a promise
      const mockQuery = {
        data: null,
        error,
        then: jest.fn().mockImplementation((callback) => Promise.resolve(callback({ data: null, error })))
      };

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery)
      });

      const result = await queryBuilder
        .from('profiles')
        .select()
        .execute();

      expect(result).toEqual({ data: null, error });
    });
  });
}); 