export interface QuestionRequest {
    question: string | number;
    table: string | Record<string, any> | Record<string, any>[];
  }
  
  export interface UploadResponse {
    filename: string;
    status: string;
  }
  
  export interface ProcessResponse {
    tables: Array<{
      data_file?: string;
      json_file?: string;
      csv_file?: string;
      image_file: string;
    }>;
    total_tables: number;
  }