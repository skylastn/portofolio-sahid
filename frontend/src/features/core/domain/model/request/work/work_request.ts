import { PaginationRequest } from "../../../../../../shared/domain/model/request/pagination_request";

export interface WorkRequest extends PaginationRequest {
  search?: string;
}
