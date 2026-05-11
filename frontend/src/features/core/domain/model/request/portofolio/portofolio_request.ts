import { PaginationRequest } from "../../../../../../shared/domain/model/request/pagination_request";

export interface PortofolioRequest extends PaginationRequest {
  search?: string;
  work_ids?: string[] | string | null;
  category_id?: string[] | string | null;
  framework_id?: string[] | string | null;
  code_language_id?: string[] | string | null;
}
