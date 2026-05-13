import axios, { AxiosError, AxiosInstance } from "axios";
import { SessionData } from "../constant/session";
import { Env } from "../constant/env";
import { HttpMethod } from "../domain/model/enum/http_method";
import { ResponseHttpType } from "../domain/model/enum/response_http_type";
import { ResponseModel } from "../domain/model/response_model";
import { UrlPath } from "../constant/url_path";

const UNAUTHORIZED_EVENT = "app:unauthorized";
let refreshPromise: Promise<string | null> | null = null;

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private localDb = new SessionData();

  constructor(baseURL: string = Env.endpointUrl ?? "") {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
      withCredentials: true,
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.localDb.token;
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async request<TResponse = unknown, TParams = unknown, TBody = unknown>(args: {
    path: string;
    method: HttpMethod;
    params?: TParams;
    data?: TBody;
    url?: string;
    responseType?: ResponseHttpType;
    signal?: AbortSignal;
  }): Promise<ResponseModel<TResponse>> {
    const {
      path,
      method,
      params,
      data,
      url,
      responseType = ResponseHttpType.JSON,
      signal,
    } = args;

    const cleanPath = path.replace(/^\/+/, "");
    const endpoint = url
      ? `${url.replace(/\/+$/, "")}/${cleanPath}`
      : `/${cleanPath}`;

    const requestConfig = {
      url: endpoint,
      method,
      params,
      data,
      responseType,
      signal,
    };

    try {
      const res = await this.axiosInstance.request(requestConfig);

      if (Array.isArray(res.data)) {
        const result = new ResponseModel<TResponse>();
        result.status = true;
        result.message = "Success";
        result.data = res.data as TResponse;
        return result;
      }
      return ResponseModel.from<TResponse>(res);
    } catch (error: unknown) {
      const err = error as AxiosError<{
        message?: string;
        data?: TResponse;
      }>;
      const message =
        err.response?.data?.message ?? err.message ?? "Network error";
      const shouldTryRefresh =
        err.response?.status === 401 &&
        !cleanPath.includes(UrlPath.LOGIN) &&
        !cleanPath.includes(UrlPath.REFRESH) &&
        !cleanPath.includes(UrlPath.LOGOUT);
      const shouldDispatchUnauthorized =
        shouldTryRefresh &&
        (err.response?.status === 401 ||
          message.toLowerCase().includes("unauthorized"));

      if (shouldTryRefresh) {
        const token = await this.refreshAccessToken();
        if (token) {
          const retry = await this.axiosInstance.request(requestConfig);
          return ResponseModel.from<TResponse>(retry);
        }
      }

      if (
        typeof window !== "undefined" &&
        shouldDispatchUnauthorized
      ) {
        window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
      }

      const result = new ResponseModel<TResponse>();
      result.status = false;
      result.message = message;
      result.data = err.response?.data?.data;

      return result;
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
      refreshPromise = this.axiosInstance
        .post(`/${UrlPath.REFRESH}`, {})
        .then((res) => {
          const token = res.data?.data?.access_token;
          if (typeof token === "string" && token) {
            this.localDb.saveToken(token);
            return token;
          }
          return null;
        })
        .catch(() => null)
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  }
}
