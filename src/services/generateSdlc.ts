import Anthropic from '@anthropic-ai/sdk';
import { SDLC_DATA, type Phase } from '../data/sdlcData';

// Returns the index of the closing bracket that matches the opening bracket at openPos.
// Returns -1 if the JSON is truncated (never closes).
function findMatchingBracket(str: string, openPos: number): number {
  let depth = 0;
  for (let i = openPos; i < str.length; i++) {
    if (str[i] === '[') depth++;
    else if (str[i] === ']') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

export async function generateCustomSdlc(
  projectIdea: string,
  apiKey: string,
  onProgress?: (charsReceived: number) => void,
): Promise<Phase[]> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: `You are an SDLC consultant. Respond with ONLY a valid JSON array. No markdown, no code fences, no explanation — just the raw JSON array starting with [ and ending with ]. Keep every definition and example to one short sentence (max 15 words each).`,
    messages: [
      {
        role: 'user',
        content: `Generate SDLC content for this project: "${projectIdea}"

Return a raw JSON array with exactly ${SDLC_DATA.length} phases in this exact order:
${SDLC_DATA.map((p, i) => `${i + 1}. ${p.phase}`).join('\n')}

Each phase object:
{
  "phase": "<exact phase name>",
  "summary": "<one short sentence about this phase for the project>",
  "terms": [ /* exactly 5 terms */ ]
}

Each term:
{
  "term": "<name>",
  "abbreviation": "<short form, omit key if none>",
  "definition": "<one sentence, max 15 words>",
  "example": "<one sentence referencing the project, max 15 words>",
  "tags": ["tag1", "tag2"],
  "category": "<group name>"
}

Rules: exactly 5 terms per phase, 2-3 categories per phase. Start your response with [ and end with ].`,
      },
    ],
  });

  let buffer = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      buffer += event.delta.text;
      onProgress?.(buffer.length);
    }
  }

  const start = buffer.indexOf('[');
  if (start === -1) {
    console.error('[generateSdlc] No [ found. Full response:', buffer);
    throw new Error('No JSON array in response. Please try again.');
  }

  const end = findMatchingBracket(buffer, start);
  if (end === -1) {
    console.error('[generateSdlc] JSON truncated. Buffer length:', buffer.length, '| Tail:', buffer.slice(-300));
    throw new Error('Response was cut off before completing. Please try again.');
  }

  let parsed: Array<{ phase: string; summary: string; terms: Phase['terms'] }>;
  try {
    parsed = JSON.parse(buffer.slice(start, end + 1));
  } catch (err) {
    console.error('[generateSdlc] Parse error:', err, '| Tail:', buffer.slice(-300));
    throw new Error('The AI returned malformed JSON. Please try again.');
  }

  return parsed.map((gen, i) => ({
    phase: SDLC_DATA[i]?.phase ?? gen.phase,
    color: SDLC_DATA[i]?.color ?? '#38bdf8',
    icon: SDLC_DATA[i]?.icon ?? '📋',
    summary: gen.summary,
    terms: gen.terms ?? [],
  }));
}
