-- Enable RLS on cvs table if not already enabled
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own CVs
CREATE POLICY "Users can view their own CVs"
ON public.cvs
FOR SELECT
TO authenticated
USING ((uploader_id = (SELECT auth.uid())));

-- Allow authenticated users to insert CVs with themselves as uploader
CREATE POLICY "Users can create CVs"
ON public.cvs
FOR INSERT
TO authenticated
WITH CHECK ((uploader_id = (SELECT auth.uid())));

-- Allow authenticated users to update their own CVs
CREATE POLICY "Users can update their own CVs" 
ON public.cvs
FOR UPDATE
TO authenticated
USING ((uploader_id = (SELECT auth.uid())));

-- Allow authenticated users to delete their own CVs
CREATE POLICY "Users can delete their own CVs"
ON public.cvs
FOR DELETE
TO authenticated
USING ((uploader_id = (SELECT auth.uid()))); 