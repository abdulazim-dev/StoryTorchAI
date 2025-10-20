import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Server-side input validation schema
const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  tone: z.string().trim().min(1).max(50),
  projectId: z.string().uuid(),
  chapterId: z.string().uuid(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with auth token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get authenticated user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Parse and validate request body
    const requestBody = await req.json();
    const validationResult = requestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, tone, projectId, chapterId } = validationResult.data;

    // Check subscription and credits
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('subscription_tier, monthly_chapter_credits, credits_used_this_month')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify subscription' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const creditsUsed = profile.credits_used_this_month || 0;
    const creditsAllowed = profile.monthly_chapter_credits || 5;

    if (creditsUsed >= creditsAllowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Credit limit reached',
          message: `You've used all ${creditsAllowed} credits this month. Upgrade to get more!`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Verify user owns the project
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !project || project.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Project not found or access denied' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are StoryForge, an expert creative writing assistant specialized in ${tone}-style storytelling. 
Create engaging, vivid prose that captures character emotions and maintains narrative momentum. 
Focus on showing rather than telling, with rich sensory details and compelling dialogue.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI generation failed');
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || '';

    // Increment credits used
    await supabaseClient
      .from('profiles')
      .update({ 
        credits_used_this_month: creditsUsed + 1 
      })
      .eq('id', user.id);

    // Log the prompt
    await supabaseClient
      .from('prompts_log')
      .insert({
        user_id: user.id,
        project_id: projectId,
        prompt_type: 'story_generation',
        input_prompt: prompt,
        output_text: generatedText,
        model_used: 'google/gemini-2.5-flash',
      });

    return new Response(
      JSON.stringify({ text: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err);
    // Don't expose internal error details to client
    return new Response(
      JSON.stringify({ error: 'An error occurred while generating content' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
