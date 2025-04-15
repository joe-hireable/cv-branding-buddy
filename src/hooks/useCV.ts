/**
 * @file CV Hook
 * @description Custom hook for CV operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cvService } from '@/services';
import type { CVDocument } from '@/types/cv';

/**
 * Custom hook for CV operations
 * @param {string} userId - The ID of the user
 * @returns {Object} CV operations and state
 */
export const useCV = (userId: string) => {
  const queryClient = useQueryClient();

  // Query for fetching user's CVs
  const {
    data: cvs,
    isLoading: isLoadingCVs,
    error: cvsError
  } = useQuery<CVDocument[], Error>({
    queryKey: ['cvs', userId],
    queryFn: () => cvService.getUserCVs(userId)
  });

  // Mutation for creating a new CV
  const createCVMutation = useMutation({
    mutationFn: (cv: Partial<CVDocument>) => cvService.createCV(cv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs', userId] });
    }
  });

  // Mutation for updating a CV
  const updateCVMutation = useMutation({
    mutationFn: ({ id, cv }: { id: string; cv: Partial<CVDocument> }) =>
      cvService.updateCV(id, cv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs', userId] });
    }
  });

  // Mutation for deleting a CV
  const deleteCVMutation = useMutation({
    mutationFn: (id: string) => cvService.deleteCV(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs', userId] });
    }
  });

  return {
    // Data
    cvs,
    isLoadingCVs,
    cvsError,

    // Mutations
    createCV: createCVMutation.mutate,
    updateCV: updateCVMutation.mutate,
    deleteCV: deleteCVMutation.mutate,

    // Mutation states
    isCreating: createCVMutation.isPending,
    isUpdating: updateCVMutation.isPending,
    isDeleting: deleteCVMutation.isPending,
    createError: createCVMutation.error,
    updateError: updateCVMutation.error,
    deleteError: deleteCVMutation.error
  };
}; 