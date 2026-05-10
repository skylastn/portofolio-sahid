import { WorkType } from '../entities/work/work_entity';

export class DashboardLatestItemResponse {
  constructor(
    public id: string,
    public title: string,
    public updatedAt: Date | null,
    public type?: WorkType,
  ) {}

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      ...(this.type ? { type: this.type } : {}),
      updated_at: this.updatedAt,
    };
  }
}

export class DashboardTotalsResponse {
  constructor(
    public portofolios: number,
    public works: number,
    public achievements: number,
    public codeLanguages: number,
    public frameworks: number,
    public categories: number,
    public generals: number,
  ) {}

  get toMap(): Record<string, any> {
    return {
      portofolios: this.portofolios,
      works: this.works,
      achievements: this.achievements,
      code_languages: this.codeLanguages,
      frameworks: this.frameworks,
      categories: this.categories,
      generals: this.generals,
    };
  }
}

export class DashboardWorkTypesResponse {
  constructor(
    public freelance: number,
    public fulltime: number,
  ) {}

  get toMap(): Record<string, any> {
    return {
      freelance: this.freelance,
      fulltime: this.fulltime,
    };
  }
}

export class DashboardLatestResponse {
  constructor(
    public portofolio: DashboardLatestItemResponse | null,
    public work: DashboardLatestItemResponse | null,
    public achievement: DashboardLatestItemResponse | null,
  ) {}

  get toMap(): Record<string, any> {
    return {
      portofolio: this.portofolio?.toMap ?? null,
      work: this.work?.toMap ?? null,
      achievement: this.achievement?.toMap ?? null,
    };
  }
}

export class DashboardSummaryResponse {
  constructor(
    public totals: DashboardTotalsResponse,
    public workTypes: DashboardWorkTypesResponse,
    public latest: DashboardLatestResponse,
  ) {}

  get toMap(): Record<string, any> {
    return {
      totals: this.totals.toMap,
      work_types: this.workTypes.toMap,
      latest: this.latest.toMap,
    };
  }
}
