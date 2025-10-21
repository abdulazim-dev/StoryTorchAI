-- Add INSERT policy for profiles table
-- Allows users to create their own profile as a fallback if trigger fails
CREATE POLICY "Users can create own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add DELETE policy for profiles table
-- Allows users to delete their own profile data (GDPR compliance)
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);