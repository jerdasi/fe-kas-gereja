import {useAuth} from "~/composables/auth";

interface IRequestOptions {
  baseURL?: string;
  method: string;
  body?: unknown;
  query?: Record<string, unknown>;
  headers: Record<string, string>;
  onResponse: typeof onResponse;
  onResponseError: typeof onResponseError;
  _retry?: boolean;
  _shoudRetry?: boolean;
}

type TApiErrorData = {
  error?: {
    message: string;
  };
  [key: string]: unknown;
}

type TOnResponseContext = {
  request: Request;
  options: IRequestOptions;
  response: {
    ok?: boolean;
    _data?: unknown;
  }
}

type TOnResponseErrorContext = {
  options: IRequestOptions;
  response: {
    status: number;
    _data: TApiErrorData;
    ok?: boolean;
  }
}

export const GET = <T = unknown>(url: string, query?: Record<string, unknown>): Promise<T> =>
  createApiFetch(url, "GET", null, query);
export const POST = <T = unknown>(url: string, body: unknown = null): Promise<T> =>
  createApiFetch(url, "POST", body);
export const PATCH = <T = unknown>(url: string, body: unknown = null): Promise<T> =>
  createApiFetch(url, "PATCH", body);
export const DELETE = <T = unknown>(url: string, body: unknown = null): Promise<T> =>
  createApiFetch(url, "DELETE", body);

export const createApiFetch = async <T = unknown>(
  url: string,
  method: string,
  body: unknown,
  query?: Record<string, unknown>
): Promise<T> => {
  const { accessToken } = useAuth();

  const requestOptions: IRequestOptions = {
    baseURL: import.meta.env.VITE_API_AUTH,
    method,
    body,
    query,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    onResponse,
    onResponseError
  };

  try {
    return await $fetch<T>(url, requestOptions as any);
  } catch (error) {
    throw error;
  }
};

const onResponse = async ({ response }: TOnResponseContext): Promise<void> => {
  if (import.meta.env.VITE_APP_MODE === "development") {
    console.log({
      "response.ok": response?.ok,
      "success.data": response._data
    })
  }
};

const onResponseError = async (context: TOnResponseErrorContext): Promise<void> => {
  const toast = useToast();
  const { response } = context;

  // const errorMessage = response?._data.error.message;

  console.log({
    "response.status": response?.status,
    "response.data.error": response?._data.error,
  })

  toast.add({
    title: "Error",
    description: response?._data.error?.message,
    color: 'error'
  })

  throw response?._data.error
};
