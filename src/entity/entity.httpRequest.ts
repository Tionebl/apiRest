interface HttpRequest {
    baseUrl?: string;
    path?: string;
    body?: any;
    params?: any;
    query?: any;
    method: string;
    user: any;
    extraQuery?: any;
  }
  
  export default function httpRequest(request: HttpRequest): Readonly<HttpRequest> {
    return Object.freeze<HttpRequest>({
      baseUrl: request.baseUrl,
      path: request.path,
      body: request.body,
      params: request.params,
      query: request.query,
      method: request.method.toUpperCase(),
      user: request.user || null,
      extraQuery: request.extraQuery || {}
    });
  }