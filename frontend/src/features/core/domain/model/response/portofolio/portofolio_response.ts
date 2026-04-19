import { BaseModelResponse } from "@/shared/domain/model/response/base_model_response";
import { BaseResponse } from "@/shared/domain/model/response/base_response";
import { ConvertResponse } from "@/shared/domain/model/response/convert_response";
import { WorkResponse } from "../work_response";
import { PortofolioAppsSourceResponse } from "./portofolio_apps_source_response";
import { PortofolioImageResponse } from "./portofolio_images_response";
import { PortofolioCategoryMappingResponse } from "./portofolio_category_mapping_response";
import { PortofolioFrameworkMappingResponse } from "./portofolio_framework_mapping_response";

export namespace PortofolioResponse {
  export class Data extends BaseModelResponse {
    work_id?: string | null;
    title?: string;
    description?: string;
    thumbnail_path?: string | null;
    thumbnail_url?: string | null;
    work?: WorkResponse.Data | null;
    apps_sources?: PortofolioAppsSourceResponse.Data[];
    images?: PortofolioImageResponse.Data[];
    category_mappings?: PortofolioCategoryMappingResponse.Data[];
    framework_mappings?: PortofolioFrameworkMappingResponse.Data[];
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
