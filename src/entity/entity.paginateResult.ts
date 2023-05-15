class PaginateResult {
    docs: any[];
    totalDocs: number;
    limit: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    page: number;
    totalItems: number;
    offset: number;
    prevPage: number | null;
    nextPage: number | null;
  
    constructor(result: {
      docs: any[];
      totalDocs: number;
      limit: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
      page: number;
      total: number;
      offset: number;
      prevPage: number | null;
      nextPage: number | null;
    }) {
      this.docs = result.docs;
      this.totalDocs = result.totalDocs;
      this.limit = result.limit;
      this.hasPrevPage = result.hasPrevPage;
      this.hasNextPage = result.hasNextPage;
      this.page = result.page;
      this.totalItems = result.total;
      this.offset = result.offset;
      this.prevPage = result.prevPage != null ? result.prevPage : null;
      this.nextPage = result.nextPage != null ? result.nextPage : null;
    }
  }
  
  export default PaginateResult;