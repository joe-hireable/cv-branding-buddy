/**
 * @file CV Service
 * @description Service for handling CV-related API operations
 */

import { APIService, APIError } from './api';
import type { CVDocument, CVParsingResult } from '@/types/cv';

/**
 * Service for handling CV-related operations
 * @class CVService
 * @extends {APIService}
 */
export class CVService extends APIService {
  /**
   * Creates a new CV document
   * @param {Partial<CVDocument>} cv - The CV document to create
   * @returns {Promise<CVDocument>} The created CV document
   */
  async createCV(cv: Partial<CVDocument>): Promise<CVDocument> {
    return this.makeRequest(
      this.supabase
        .from('cvs')
        .insert({
          user_id: cv.userId,
          title: cv.title,
          is_primary: cv.isPrimary,
          content: cv
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw new APIError(error.message, 400, 'CV_CREATE_ERROR');
          return this.transformCVResponse(data);
        })
    );
  }

  /**
   * Updates an existing CV document
   * @param {string} id - The ID of the CV to update
   * @param {Partial<CVDocument>} cv - The CV document updates
   * @returns {Promise<CVDocument>} The updated CV document
   */
  async updateCV(id: string, cv: Partial<CVDocument>): Promise<CVDocument> {
    return this.makeRequest(
      this.supabase
        .from('cvs')
        .update({
          title: cv.title,
          is_primary: cv.isPrimary,
          content: cv,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw new APIError(error.message, 400, 'CV_UPDATE_ERROR');
          return this.transformCVResponse(data);
        })
    );
  }

  /**
   * Deletes a CV document
   * @param {string} id - The ID of the CV to delete
   * @returns {Promise<void>}
   */
  async deleteCV(id: string): Promise<void> {
    return this.makeRequest(
      this.supabase
        .from('cvs')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw new APIError(error.message, 400, 'CV_DELETE_ERROR');
        })
    );
  }

  /**
   * Gets a CV document by ID
   * @param {string} id - The ID of the CV to get
   * @returns {Promise<CVDocument>} The CV document
   */
  async getCV(id: string): Promise<CVDocument> {
    return this.makeRequest(
      this.supabase
        .from('cvs')
        .select()
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw new APIError(error.message, 404, 'CV_NOT_FOUND');
          return this.transformCVResponse(data);
        })
    );
  }

  /**
   * Gets all CVs for a user
   * @param {string} userId - The ID of the user
   * @returns {Promise<CVDocument[]>} Array of CV documents
   */
  async getUserCVs(userId: string): Promise<CVDocument[]> {
    return this.makeRequest(
      this.supabase
        .from('cvs')
        .select()
        .eq('user_id', userId)
        .then(({ data, error }) => {
          if (error) throw new APIError(error.message, 400, 'CV_FETCH_ERROR');
          return data.map(this.transformCVResponse);
        })
    );
  }

  /**
   * Transforms a Supabase CV response into a CVDocument
   * @param {any} data - The Supabase response data
   * @returns {CVDocument} The transformed CV document
   */
  private transformCVResponse(data: any): CVDocument {
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isPrimary: data.is_primary,
      sections: data.content.sections
    };
  }
}

// Export a singleton instance
export const cvService = new CVService(); 