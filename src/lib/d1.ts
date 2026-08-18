// Cloudflare D1 HTTP API client
// Docs: https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/

const ACCOUNT_ID = import.meta.env.D1_ACCOUNT_ID || process.env.D1_ACCOUNT_ID;
const DATABASE_ID = import.meta.env.D1_DATABASE_ID || process.env.D1_DATABASE_ID;
const API_TOKEN = import.meta.env.D1_API_TOKEN || process.env.D1_API_TOKEN;

interface D1Result {
  results: Record<string, unknown>[];
  success: boolean;
  meta: Record<string, unknown>;
}

// Execute a SQL query against the D1 database via the HTTP API
export async function d1Query(
  sql: string,
  params: unknown[] = []
): Promise<D1Result> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const json = await res.json() as { result: D1Result[]; success: boolean; errors: { message: string }[] };

  if (!json.success || !json.result?.length) {
    const msg = json.errors?.[0]?.message || 'D1 query failed';
    throw new Error(msg);
  }

  return json.result[0];
}
