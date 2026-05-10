import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreateToolRequest } from "../model/request/tool/create_tool_request";
import { ToolRequest } from "../model/request/tool/tool_request";
import { ToolResponse } from "../model/response/tool_response";

export interface ToolRepository {
  createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, { key: string; url: string }>>;
  fetchTools(
    query?: ToolRequest,
  ): Promise<Either<ResponseModel, ResponseModel<ToolResponse.Data[]>>>;
  fetchToolById(id: string): Promise<Either<ResponseModel, ToolResponse.Data>>;
  createTool(
    request: CreateToolRequest,
  ): Promise<Either<ResponseModel, ToolResponse.Data>>;
  updateTool(
    id: string,
    request: CreateToolRequest,
  ): Promise<Either<ResponseModel, ToolResponse.Data>>;
  deleteTool(id: string): Promise<Either<ResponseModel, boolean>>;
}
