export class HttpError extends Error {
  readonly status: number
  readonly payload: unknown

  constructor(
    message: string,
    status: number,
    payload: unknown,
  ) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.payload = payload
  }
}

export class NetworkError extends Error {
  constructor(message = 'Não foi possível acessar a API.') {
    super(message)
    this.name = 'NetworkError'
  }
}

async function lerJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return undefined
  }

  return response.json()
}

export async function requestJson<T>(
  caminho: `/${string}`,
  init?: RequestInit,
): Promise<T> {
  let response: Response

  try {
    const url = new URL(caminho, window.location.origin)
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new NetworkError()
  }

  const payload = await lerJson(response)

  if (!response.ok) {
    throw new HttpError(
      `A API respondeu com status ${response.status}.`,
      response.status,
      payload,
    )
  }

  return payload as T
}
