import { testUtils, TestUtils } from '../utils/test-utils'
import { createClient } from '../client'
import { handleError } from '../utils/error-handler'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../../../lib/supabase/types'

// Mock Supabase client
jest.mock('../client', () => ({
  createClient: jest.fn(),
}))

describe('TestUtils', () => {
  let mockClient: jest.Mocked<SupabaseClient<Database>>
  let utils: TestUtils

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Create mock Supabase client
    mockClient = {
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
            },
          },
          error: null,
        }),
        admin: {
          listUsers: jest.fn().mockResolvedValue({
            data: {
              users: [
                {
                  id: 'test-user-id',
                  email: 'test@example.com',
                },
              ],
            },
            error: null,
          }),
          deleteUser: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        },
      },
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'test-id',
          name: 'Test Company',
          first_name: 'Test',
          last_name: 'Candidate',
          candidate_id: 'test-candidate-id',
          uploader_id: 'test-user-id',
        },
        error: null,
      }),
      delete: jest.fn().mockReturnThis(),
      neq: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      eq: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    } as unknown as jest.Mocked<SupabaseClient<Database>>

    // Set up createClient mock
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    // Create new instance for each test
    utils = new TestUtils()
  })

  it('should create test user', async () => {
    const testUser = await utils.createTestUser('test@example.com', 'testpassword123')
    expect(testUser.user).toBeDefined()
    expect(testUser.user.email).toBe('test@example.com')
    expect(mockClient.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'testpassword123',
    })
  })

  it('should create test company', async () => {
    const testCompany = await utils.createTestCompany('Test Company')
    expect(testCompany).toBeDefined()
    expect(testCompany.name).toBe('Test Company')
    expect(mockClient.from).toHaveBeenCalledWith('companies')
  })

  it('should create test candidate', async () => {
    const testCandidate = await utils.createTestCandidate('test-company-id')
    expect(testCandidate).toBeDefined()
    expect(testCandidate.first_name).toBe('Test')
    expect(testCandidate.last_name).toBe('Candidate')
    expect(mockClient.from).toHaveBeenCalledWith('candidates')
  })

  it('should create test CV', async () => {
    const testCV = await utils.createTestCV('test-candidate-id', 'test-user-id')
    expect(testCV).toBeDefined()
    expect(testCV.candidate_id).toBe('test-candidate-id')
    expect(testCV.uploader_id).toBe('test-user-id')
    expect(mockClient.from).toHaveBeenCalledWith('cvs')
  })

  it('should clean up test data', async () => {
    await utils.cleanupTestData()

    // Verify cleanup calls
    expect(mockClient.from).toHaveBeenCalledWith('cv_chats')
    expect(mockClient.from).toHaveBeenCalledWith('cv_analysis_results')
    expect(mockClient.from).toHaveBeenCalledWith('generated_documents')
    expect(mockClient.from).toHaveBeenCalledWith('cvs')
    expect(mockClient.from).toHaveBeenCalledWith('candidates')
    expect(mockClient.from).toHaveBeenCalledWith('companies')
    expect(mockClient.from).toHaveBeenCalledWith('profiles')
    expect(mockClient.auth.admin.listUsers).toHaveBeenCalled()
    expect(mockClient.auth.admin.deleteUser).toHaveBeenCalledWith('test-user-id')
  })
}) 