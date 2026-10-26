const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  token?: string | null;
  body?: unknown;
  headers?: Record<string, string>;
};

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Registra um callback disparado quando uma requisição autenticada retorna 401. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

async function extractErrorMessage(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    message?: string | string[];
  } | null;
  const message = body?.message;

  if (Array.isArray(message)) return message.join(", ");
  return message ?? `Erro na API: ${response.status} ${response.statusText}`;
}

export async function apiRequest<T>(
  path: string,
  { token, body, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new ApiError("A variável NEXT_PUBLIC_API_URL não está configurada.", 0);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique se o servidor está em execução.",
      0,
    );
  }

  if (!response.ok) {
    if (response.status === 401 && token) unauthorizedHandler?.();
    throw new ApiError(await extractErrorMessage(response), response.status);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

export function getErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente.") {
  return error instanceof Error ? error.message : fallback;
}
