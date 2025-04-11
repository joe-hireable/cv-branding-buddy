import { createClient } from '../client'
import { handleError } from './error-handler'

export class TestUtils {
  private client = createClient()

  async createTestUser(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password
    })

    if (error) handleError(error)
    return data
  }

  async createTestProfile(userId: string, companyId: string) {
    const { data, error } = await this.client
      .from('profiles')
      .insert({
        id: userId,
        company_id: companyId,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User'
      })
      .select()
      .single()

    if (error) handleError(error)
    return data
  }

  async createTestCompany(name: string) {
    const { data, error } = await this.client
      .from('companies')
      .insert({
        name,
        description: 'Test company'
      })
      .select()
      .single()

    if (error) handleError(error)
    return data
  }

  async createTestCandidate(companyId: string) {
    const { data, error } = await this.client
      .from('candidates')
      .insert({
        first_name: 'Test',
        last_name: 'Candidate',
        current_company: 'Test Company',
        current_position: 'Test Position',
        owner_id: companyId
      })
      .select()
      .single()

    if (error) handleError(error)
    return data
  }

  async createTestCV(candidateId: string, uploaderId: string) {
    const { data, error } = await this.client
      .from('cvs')
      .insert({
        candidate_id: candidateId,
        uploader_id: uploaderId,
        status: 'Uploaded',
        original_filename: 'test.pdf'
      })
      .select()
      .single()

    if (error) handleError(error)
    return data
  }

  async cleanupTestData() {
    // Delete in reverse order of dependencies
    await this.client.from('cv_chats').delete().neq('id', 0)
    await this.client.from('cv_analysis_results').delete().neq('id', '')
    await this.client.from('generated_documents').delete().neq('id', '')
    await this.client.from('cvs').delete().neq('id', '')
    await this.client.from('candidates').delete().neq('id', '')
    await this.client.from('companies').delete().neq('id', '')
    await this.client.from('profiles').delete().neq('id', '')
    
    // Delete test users
    const { data: users } = await this.client.auth.admin.listUsers()
    if (users) {
      for (const user of users.users) {
        if (user.email?.includes('test@')) {
          await this.client.auth.admin.deleteUser(user.id)
        }
      }
    }
  }
}

export const testUtils = new TestUtils() 