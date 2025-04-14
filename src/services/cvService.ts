import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/integrations/supabase/utils/error-handler';

export interface CV {
  id: string;
  candidate_id: string;
  uploader_id: string;
  original_filename: string;
  original_file_storage_path: string;
  parsed_data: any;
  status: 'Uploaded' | 'Error' | 'Parsing' | 'Parsed' | 'Optimizing_PS' | 'Optimizing_CS' | 'Optimizing_KA' | 'Optimizing_Role' | 'Scoring' | 'OptimizationComplete' | 'Generating' | 'Generated';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCVData {
  candidate_id: string;
  uploader_id: string;
  original_filename: string;
  original_file_storage_path: string;
  parsed_data?: any;
  status?: CV['status'];
  error_message?: string;
}

class CVService {
  async create(data: CreateCVData): Promise<CV> {
    const { data: cv, error } = await supabase
      .from('cvs')
      .insert(data)
      .select()
      .single();

    if (error) throw handleError(error);
    return cv;
  }

  async getById(id: string): Promise<CV | null> {
    const { data: cv, error } = await supabase
      .from('cvs')
      .select()
      .eq('id', id)
      .single();

    if (error) throw handleError(error);
    return cv;
  }

  async getByCandidateId(candidateId: string): Promise<CV[]> {
    const { data: cvs, error } = await supabase
      .from('cvs')
      .select()
      .eq('candidate_id', candidateId);

    if (error) throw handleError(error);
    return cvs;
  }

  async update(id: string, data: Partial<CreateCVData>): Promise<CV> {
    const { data: cv, error } = await supabase
      .from('cvs')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw handleError(error);
    return cv;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id);

    if (error) throw handleError(error);
  }

  async uploadCV(formData: FormData): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch('https://europe-west9-hireable-places.cloudfunctions.net/cv_optimizer', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload CV');
      }

      const data = await response.json();
      return {
        status: 'success',
        message: 'CV uploaded successfully',
      };
    } catch (error) {
      console.error('Error uploading CV:', error);
      return {
        status: 'error',
        message: 'Failed to upload CV',
      };
    }
  }
}

export const cvService = new CVService(); 