import { PaginationRequest } from "../../../../../../shared/domain/model/request/pagination_request";

export interface FrameworkRequest extends PaginationRequest {
  search?: string;
}
