import { PaginationRequest } from "../../../../../../shared/domain/model/request/pagination_request";

export interface CodeLanguageRequest extends PaginationRequest {
  search?: string;
}
