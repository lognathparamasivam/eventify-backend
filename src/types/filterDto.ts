export interface FilterDto {
  [key: string]: string | number | boolean | Record<string, unknown> | undefined;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  