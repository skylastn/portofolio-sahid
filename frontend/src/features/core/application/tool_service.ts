import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreateToolRequest } from "../domain/model/request/tool/create_tool_request";
import { ToolRequest } from "../domain/model/request/tool/tool_request";
import { ToolResponse } from "../domain/model/response/tool_response";
import { ToolRepository } from "../domain/repository/tool_repository";
import { ToolRemoteDataSource } from "../infrastructure/data_source/tool_remote_data_source";
import { ToolRepositoryImpl } from "../infrastructure/persistence/tool_repository_impl";

export class ToolService {
  private repo: ToolRepository;

  constructor() {
    this.repo = new ToolRepositoryImpl(new ToolRemoteDataSource());
  }

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, { key: string; url: string }>> {
    return await this.repo.createUploadSignature(imageName);
  }

  async fetchTools(
    query?: ToolRequest,
  ): Promise<Either<ResponseModel, ResponseModel<ToolResponse.Data[]>>> {
    return await this.repo.fetchTools(query);
  }

  async fetchToolById(
    id: string,
  ): Promise<Either<ResponseModel, ToolResponse.Data>> {
    return await this.repo.fetchToolById(id);
  }

  async createTool(
    request: CreateToolRequest,
  ): Promise<Either<ResponseModel, ToolResponse.Data>> {
    return await this.repo.createTool(request);
  }

  async updateTool(
    id: string,
    request: CreateToolRequest,
  ): Promise<Either<ResponseModel, ToolResponse.Data>> {
    return await this.repo.updateTool(id, request);
  }

  async deleteTool(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.deleteTool(id);
  }
}
