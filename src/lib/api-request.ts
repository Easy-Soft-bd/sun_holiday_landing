export async function parseJsonBody<T extends Record<string, unknown>>(
  request: Request,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const text = await request.text();

    if (!text.trim()) {
      return { data: null, error: 'Request body is required' };
    }

    const parsed = JSON.parse(text) as T;
    return { data: parsed, error: null };
  } catch {
    return { data: null, error: 'Invalid JSON body' };
  }
}

export async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    const text = await response.text();
    if (!text.trim()) {
      return null;
    }

    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
