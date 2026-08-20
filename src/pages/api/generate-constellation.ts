import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { requireEditorAuth } from '../../lib/auth';

export const prerender = false;

const PROMPT = `You design constellations for a children's storytelling app. Given a concept name, think carefully about its shape and silhouette, then place stars to suggest that form abstractly — like how real constellations only loosely resemble their names, but you can still see it if you squint.

THINK ABOUT:
- What is the concept's natural ORIENTATION? Horizontal animals (bear, whale, fox) should be WIDER than tall. Vertical things (tree, person) should be taller than wide.
- What are 2-3 DISTINCTIVE features? (fox → pointed ears + bushy tail, bear → bulky horizontal body + round head + short legs)
- Trace the OUTLINE of the silhouette with a chain of stars. Add 1-2 branches for features like legs, wings, ears, tail.
- The lines should follow the contour/skeleton of the shape, NOT make a generic tree pattern.

RULES:
- 7-8 stars, 6-7 lines. MUST be a tree (NO closed loops)
- Stars are [x,y] coordinates, multiples of 20, centered around (0,0). Negative Y = up, positive Y = down.
- Spread across ~150-250 unit range in the dominant direction
- NOT symmetric. Irregular spacing like real stars.

EXAMPLES:

Bear — HORIZONTAL body profile, head on right with ears, legs below:
{"stars":[[-80,-60],[-40,-80],[30,-70],[70,-40],[110,-55],[90,-75],[-60,20],[50,10]],"lines":[[0,1],[1,2],[2,3],[3,4],[3,5],[0,6],[3,7]]}
Key: body chain goes LEFT to RIGHT (0→1→2→3), ears branch UP (4,5), legs branch DOWN (6,7)

Fox — VERTICAL, pointed ears at top converging to body, tail trailing:
{"stars":[[-40,-90],[40,-90],[0,-40],[0,10],[-30,60],[60,50],[30,35]],"lines":[[0,2],[1,2],[2,3],[3,4],[3,6],[6,5]]}
Key: two ear tips (0,1) meet at head hub (2), body drops down (3), tail branches off (4,5,6)

Whale — HORIZONTAL, long flowing body with tail fluke:
{"stars":[[-100,-10],[-50,-30],[20,-25],[80,-15],[110,-40],[105,15],[-40,20]],"lines":[[0,1],[1,2],[2,3],[3,4],[3,5],[0,6]]}
Key: body chain sweeps LEFT to RIGHT, tail splits into fluke (4,5), fin branches down (6)

Tree — VERTICAL, crown branches at top, trunk center, roots split at bottom:
{"stars":[[0,-100],[-50,-50],[55,-45],[0,-10],[0,70],[-30,100],[35,95]],"lines":[[0,3],[1,3],[2,3],[3,4],[4,5],[4,6]]}
Key: branches fan out at top (0,1,2), trunk drops straight (3→4), roots split (5,6)

Respond with ONLY the JSON: {"stars":[[x,y],...],"lines":[[from,to],...]}`;

export const POST: APIRoute = async ({ request }) => {
  if (!requireEditorAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name } = await request.json();
  if (!name) {
    return new Response(JSON.stringify({ error: 'Name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = new Anthropic({ apiKey });

    // Build adjacency list and check for cycles using DFS
    function hasLoop(lines: number[][]): boolean {
      const adj = new Map<number, number[]>();
      for (const [a, b] of lines) {
        if (!adj.has(a)) adj.set(a, []);
        if (!adj.has(b)) adj.set(b, []);
        adj.get(a)!.push(b);
        adj.get(b)!.push(a);
      }
      const visited = new Set<number>();
      function dfs(node: number, parent: number): boolean {
        visited.add(node);
        for (const neighbor of adj.get(node) || []) {
          if (!visited.has(neighbor)) {
            if (dfs(neighbor, node)) return true;
          } else if (neighbor !== parent) {
            return true; // cycle found
          }
        }
        return false;
      }
      for (const node of adj.keys()) {
        if (!visited.has(node)) {
          if (dfs(node, -1)) return true;
        }
      }
      return false;
    }

    // Remove the line that creates a loop (the one closing the cycle)
    function removeLoops(lines: number[][]): number[][] {
      const result = [...lines];
      // Try removing lines from the end until no loops remain
      for (let i = result.length - 1; i >= 0; i--) {
        if (hasLoop(result)) {
          result.splice(i, 1);
        }
      }
      return result;
    }

    async function generate() {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 16000,
        thinking: { type: 'enabled', budget_tokens: 15000 },
        messages: [
          { role: 'user', content: `Create a constellation for: ${name}` },
        ],
        system: PROMPT,
      });

      const textBlock = message.content.find((b: { type: string }) => b.type === 'text') as { type: 'text'; text: string } | undefined;
      let text = textBlock?.text || '';
      text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      text = text.replace(/\u2212/g, '-');
      // Extract JSON object if surrounded by other text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      return JSON.parse(jsonMatch[0]);
    }

    const data = await generate();

    if (!Array.isArray(data.stars) || !Array.isArray(data.lines)) {
      throw new Error('Invalid response format');
    }

    // Fix any loops by removing cycle-closing lines
    if (hasLoop(data.lines)) {
      data.lines = removeLoops(data.lines);
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
