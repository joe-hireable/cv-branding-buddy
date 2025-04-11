import { createClient } from '../client'

export class StorageHelper {
  private client = createClient()

  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options: { cacheControl?: string; upsert?: boolean } = {}
  ) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, options)

    if (error) throw error
    return data
  }

  async downloadFile(bucket: string, path: string) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(path)

    if (error) throw error
    return data
  }

  async deleteFile(bucket: string, path: string) {
    const { error } = await this.client.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }

  getPublicUrl(bucket: string, path: string) {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  async listFiles(bucket: string, path: string) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .list(path)

    if (error) throw error
    return data
  }
}

export const storageHelper = new StorageHelper() 