import { PaginationRequest } from "../../../../../../shared/domain/model/request/pagination_request";

export interface PortofolioRequest extends PaginationRequest {
  search?: string;
  work_id?: string | null;
}
