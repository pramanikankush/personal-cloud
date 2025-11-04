import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  let fileName = '';
  let fileType = '';
  
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'Google API key not configured' }, { status: 500 });
    }

    const body = await request.json();
    fileName = body.fileName;
    fileType = body.fileType;
    const storagePath = body.storagePath;
    
    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    let fileContent = '';
    let prompt = '';
    
    // Try to extract and analyze file content
    if (storagePath) {
      try {
        const { data } = await supabase.storage.from('files').download(storagePath);
        
        if (data) {
          // Handle text-based files
          if (fileType === 'text' || fileName.match(/\.(txt|md|json|csv|xml|html|css|js|ts|py|java|cpp|c|h)$/i)) {
            fileContent = await data.text();
            prompt = `Analyze this document content and provide a concise summary (2-3 sentences):

File: ${fileName}
Content:
${fileContent.substring(0, 3000)}

Summarize the main topics, purpose, and key information.`;
          }
          // Handle images with vision model
          else if (fileType === 'image' || fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
            const imageBytes = await data.arrayBuffer();
            const base64Image = Buffer.from(imageBytes).toString('base64');
            
            const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
            const result = await visionModel.generateContent([
              'Analyze this image and provide a brief description (2-3 sentences) of what you see:',
              {
                inlineData: {
                  data: base64Image,
                  mimeType: data.type || 'image/jpeg'
                }
              }
            ]);
            
            return NextResponse.json({ summary: result.response.text() });
          }
        }
      } catch (error) {
        console.log('Could not extract file content:', error);
      }
    }
    
    // Fallback to filename-based analysis if content extraction failed
    if (!prompt) {
      prompt = `Based on the filename and type, provide a brief description (2-3 sentences) of what this file likely contains:

File Name: ${fileName}
File Type: ${fileType || 'unknown'}

Focus on probable content, purpose, and context.`;
    }
    
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ 
      summary: `Unable to analyze ${fileName || 'file'}. This ${fileType || 'file'} may contain relevant content based on its name and format.` 
    });
  }
}