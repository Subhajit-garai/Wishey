import axios, { AxiosError } from "axios";

export class ApiClient {
  private baseUrl: string;
  private static instance: ApiClient;

  public static getInstance(baseUrl?: string) {
    if (!this.instance) {
      this.instance = new ApiClient(baseUrl || "");
    }
    return this.instance;
  }
  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  createUrl(endpoint: string) {
    return `${this.baseUrl}/api${endpoint}`;
  }

  request = async <T = any>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE";
      data?: any;
    } = {}
  ): Promise<T> => {
    try {
      const url = this.createUrl(endpoint);

      const response = await axios({
        url,
        method: options.method || "GET",
        data: options.data,
        withCredentials: true,
      });

      return response.data as T;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return (error.response?.data || { message: "Unknown error" }) as T;
    }
  };

  apiDispatcher = async <T = any>(
    endpoint: string,
    dispatch: any,
    next: (data: T) => any
  ) => {
    const response = await this.request(endpoint, {
      method: "GET",
      data: {},
    });

    if (response.success) {
      dispatch(next(response.data));
      return response
    } else {
      return response
    }

  };
}
