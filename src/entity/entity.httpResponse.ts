class HttpResponse {
    public status: number;
    public body: any;
  
    constructor({ status = 200, body = {} }: { status?: number, body?: any } = {}) {
      this.status = status;
      this.body = body;
    }
  }
  
  export default HttpResponse;