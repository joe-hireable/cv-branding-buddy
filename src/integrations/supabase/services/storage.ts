import { supabase } from '../supabaseClient'

export class SupabaseError extends Error {
  constructor(public originalError: any, public context?: string) {
    super(originalError.message)
    this.name = 'SupabaseError'
  }
}

export const storageService = {
  async uploadCV(file: File, candidateId: string) {
    const filename = `${candidateId}/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('cv_files')
      .upload(filename, file)

    if (error) throw new SupabaseError(error, 'CV Upload')
    return data
  },

  async uploadCompanyLogo(file: File, companyId: string) {
    const filename = `${companyId}/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('company_logos')
      .upload(filename, file)

    if (error) throw new SupabaseError(error, 'Company Logo Upload')
    return data
  },

  async uploadGeneratedDocument(file: File, cvId: string) {
    const filename = `${cvId}/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('generated_documents')
      .upload(filename, file)

    if (error) throw new SupabaseError(error, 'Generated Document Upload')
    return data
  },

  async getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  },

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) throw new SupabaseError(error, 'Get Signed URL')
    return data.signedUrl
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw new SupabaseError(error, 'Delete File')
  },

  async listFiles(bucket: string, path: string = '') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path)

    if (error) throw new SupabaseError(error, 'List Files')
    return data
  },
} 