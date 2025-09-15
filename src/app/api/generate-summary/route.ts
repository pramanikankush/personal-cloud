import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, storagePath } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    let fileContent = '';
    
    // Try to extract text content from file
    try {
      const { data } = await supabase.storage
        .from('files')
        .download(storagePath);
      
      if (data) {
        if (fileType === 'text' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
          fileContent = await data.text();
        } else if (fileName.endsWith('.json')) {
          fileContent = await data.text();
        }
      }
    } catch (error) {
      console.log('Could not extract file content:', error);
    }
    
    const prompt = fileContent 
      ? `Analyze this file content and generate a brief, informative summary (2-3 sentences):

File Name: ${fileName}
File Type: ${fileType}

Content:
${fileContent.substring(0, 2000)}

Focus on the main topics, purpose, and key information. Be concise and professional.`
      : `Generate a brief, informative summary (2-3 sentences) about what this file likely contains based on its name and type:

File Name: ${fileName}
File Type: ${fileType}

Focus on the probable content, purpose, and context. Be concise and professional.`;
    
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}