import { getCloudinaryThumbnail } from '@/src/utils/imageUtils';

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function evaluateAnswerByAI(imageUrls: string[]) {
  try {
    // 1. Validate input
    if (!imageUrls || imageUrls.length === 0) {
      throw new Error('No images provided');
    }

    // 2. Get API key
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // 3. Use compressed images to reduce payload size
    console.log('Converting images to base64...', imageUrls.length, 'images');
    const compressedUrls = imageUrls.map((url) => getCloudinaryThumbnail(url));
    console.log('Using compressed images:', compressedUrls);
    const imagePromises = compressedUrls.map((url) => urlToBase64(url));
    const base64Images = await Promise.all(imagePromises);
    console.log('Base64 conversion complete');
    // 4. User prompt
    const userPrompt = `Analyze this UPSC Mains answer from the image.
First, extract and read the question written at the top of the answer sheet. Evaluate whether the answer meets the demand of the question based on:
- Directive words (Discuss, Evaluate, Critically Examine, Comment, Analyze, etc.)
- Core theme and scope of the question
- Required dimensions and depth
If the question text is unclear or partially visible, state: "question not fully visible" and do not guess missing parts.

Provide feedback strictly in this JSON format:
{
  "question_detected": "extracted question here",
  "question_clarity": "clear / partially visible / unclear",

  "param1_score": X,
  "param1_name": "Relevance & Understanding",
  "param1_feedback": "How well the answer addresses the question and directive",

  "param2_score": X,
  "param2_name": "Structure & Organization",
  "param2_feedback": "Clarity of intro, body, conclusion and logical flow",

  "param3_score": X,
  "param3_name": "Content Depth & Examples",
  "param3_feedback": "Use of concepts, examples, case laws, committees, reports, data or real incidents (without fabricating specifics)",

  "param4_score": X,
  "param4_name": "Presentation & Neatness",
  "param4_feedback": "Handwriting, spacing, headings, sub-headings, readability",

  "param5_score": X,
  "param5_name": "Innovation & Value Addition",
  "param5_feedback": "Use of multidimensional approach, concluding insight, balanced perspective",

  "visual_elements_used": true/false,
  "visual_feedback": "mention if diagrams, flowcharts, tables or maps are used and how effective they are",

  "suggested_fact": "Suggest one relevant report, committee, case law or real data category without fabricating numeric values",

  "total_score": XX,
  "summary": "Brief honest assessment in 2-3 natural sentences",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "suggestions": "Practical actionable advice in 2-3 sentences",

  "transcript": "Extracted handwritten text here (minimal formatting)"
}

Be specific and factual. No emojis. No fancy formatting. No unnecessary praise. Avoid jargon and overly complex language. If unsure about any part, say 'not clear'.
Return ONLY valid JSON output with no explanation outside the object.`;

    // 5. System instruction
    const systemInstruction = `You are an experienced UPSC coach who helps students improve their answer writing. You provide honest, practical feedback without unnecessary formality or jargon.

Read the handwritten answer from the image and evaluate it on these 5 parameters:
1. Relevance & Understanding (0-10)
2. Structure & Organization (0-10)
3. Content Depth & Examples (0-10)
4. Presentation & Neatness (0-10)
5. Innovation & Value Addition (0-10)

Be direct, specific, and actionable. Avoid:
- Emojis
- Excessive formatting (em dashes, fancy bullets)
- Generic praise like "well done" or "excellent"
- Jargon or overly formal language

Write feedback like you're talking to a friend - clear, honest, helpful.`;

    // 6. Build content parts (text + images)
    const parts = [
      { text: userPrompt },
      ...base64Images.map((base64Data) => ({
        inline_data: {
          mime_type: 'image/jpeg',
          data: base64Data,
        },
      })),
    ];
    console.log('Calling Gemini API...');

    const requestBody = {
      system_instruction: {
        parts: {
          text: systemInstruction,
        },
      },
      contents: [
        {
          role: 'user',
          parts: parts,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    };

    console.log(
      'Request body size (KB):',
      JSON.stringify(requestBody).length / 1024
    );

    // 7. Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log('API Response status:', response.status);

    // 8. Check response status
    if (!response.ok) {
      let errorMessage = 'Gemini API request failed';
      try {
        const errorData = await response.json();
        console.log('API Error:', errorData);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (parseError) {
        console.log('Could not parse error response');
      }
      throw new Error(errorMessage);
    }

    // 9. Parse response
    const data = await response.json();
    console.log('API Response:', data);

    // 10. Validate response structure
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(
        'No response generated. Content may have been blocked by safety filters.'
      );
    }

    if (
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      data.candidates[0].content.parts.length === 0
    ) {
      throw new Error('Invalid response structure from API');
    }

    let aiResponse = data.candidates[0].content.parts[0].text;
    console.log(aiResponse);

    if (!aiResponse) {
      throw new Error('Empty response from API');
    }

    // 11. Clean markdown code blocks if present
    aiResponse = aiResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // 12. Parse JSON from AI
    let evaluation;
    try {
      evaluation = JSON.parse(aiResponse);
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError);
      console.error('Partial response received:', aiResponse.substring(0, 500));
      throw new Error(
        'Response was incomplete or malformed. The AI may have generated too much content. Try with fewer images or simpler content.'
      );
    }

    // 13. Return success
    return {
      success: true,
      data: evaluation,
      error: null,
    };
  } catch (error: any) {
    console.error('AI Evaluation Error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return {
      success: false,
      data: null,
      error: error.message || 'Unknown error occurred',
    };
  }
}
