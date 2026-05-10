import { PaginationRequest } from "@/shared/domain/model/request/pagination_request";

export interface ToolRequest extends PaginationRequest {
  search?: string;
}
