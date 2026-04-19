import { PaginationRequest } from "../../../../../../shared/domain/model/request/pagination_request";

export interface AchievementRequest extends PaginationRequest {
  search?: string;
}
