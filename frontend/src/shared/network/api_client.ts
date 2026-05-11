import axios, { AxiosError, AxiosInstance } from "axios";
import { SessionData } from "../constant/session";
import { Env } from "../constant/env";
import { HttpMethod } from "../domain/model/enum/http_method";
import { ResponseHttpType } from "../domain/model/enum/response_http_type";
import { ResponseModel } from "../domain/model/response_model";

const UNAUTHORIZED_EVENT = "app:unauthorized";

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private localDb = new SessionData();

  constructor(baseURL: string = Env.endpointUrl ?? "") {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
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

    try {
      const res = await this.axiosInstance.request({
        url: endpoint,
        method,
        params,
        data,
        responseType,
        signal,
      });

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

      if (
        typeof window !== "undefined" &&
        (err.response?.status === 401 ||
          message.toLowerCase().includes("unauthorized"))
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
}
