import { createClient } from '../client'
import { handleError } from './error-handler'

export class SupabaseMiddleware {
  private client = createClient()

  async requireAuth() {
    const { data: { session }, error } = await this.client.auth.getSession()
    
    if (error) handleError(error)
    if (!session) throw new Error('Authentication required')
    
    return session
  }

  async requireCompanyAccess(companyId: string) {
    const session = await this.requireAuth()
    
    const { data: profile, error } = await this.client
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single()

    if (error) handleError(error)
    if (!profile || profile.company_id !== companyId) {
      throw new Error('No access to this company')
    }
    
    return profile
  }

  async requireCVAccess(cvId: string) {
    const session = await this.requireAuth()
    
    const { data: cv, error } = await this.client
      .from('cvs')
      .select('candidate_id, uploader_id')
      .eq('id', cvId)
      .single()

    if (error) handleError(error)
    if (!cv) throw new Error('CV not found')
    
    // Check if user is the uploader or has access to the candidate
    if (cv.uploader_id !== session.user.id) {
      const { data: candidate, error: candidateError } = await this.client
        .from('candidates')
        .select('owner_id')
        .eq('id', cv.candidate_id)
        .single()

      if (candidateError) handleError(candidateError)
      if (!candidate || candidate.owner_id !== session.user.id) {
        throw new Error('No access to this CV')
      }
    }
    
    return cv
  }
}

export const middleware = new SupabaseMiddleware() 