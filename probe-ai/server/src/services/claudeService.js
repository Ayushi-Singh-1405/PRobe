import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `You are an expert senior software engineer conducting a thorough code review.
Analyze GitHub PR diffs and respond ONLY with a valid JSON object — no markdown, no backticks, no extra text.

JSON format:
{
  "summary": "2-3 sentence overall assessment",
  "overallScore": <1-10>,
  "issues": [
    {
      "id": "unique string",
      "severity": "critical|warning|suggestion",
      "category": "bug|security|performance|style|logic|documentation",
      "file": "filename",
      "line": <number or null>,
      "title": "short title",
      "description": "detailed explanation",
      "suggestion": "how to fix"
    }
  ],
  "positives": ["positive 1", "positive 2"],
  "metrics": { "bugCount": 0, "securityCount": 0, "performanceCount": 0, "styleCount": 0 }
}`;

export async function analyzeCode(prData) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const userMessage = `Review this Pull Request:

Title: ${prData.title}
Description: ${prData.body || 'No description provided'}
Author: ${prData.user}
Files Changed: ${prData.changedFiles}
Additions: +${prData.additions} | Deletions: -${prData.deletions}

--- DIFF ---
${prData.diff}
--- END DIFF ---

Respond ONLY with the JSON object, no other text.`;

  const result = await model.generateContent({
    systemInstruction,
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.2,
    },
  });

  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse Gemini response as JSON: ' + text);
  }
}
