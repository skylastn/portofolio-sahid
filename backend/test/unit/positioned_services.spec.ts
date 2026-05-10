import 'reflect-metadata';
import { AchievementService } from '../../src/feature/portofolio/application/achievement_service';
import { CodeLanguageService } from '../../src/feature/portofolio/application/code_language_service';
import { FrameworkService } from '../../src/feature/portofolio/application/framework_service';
import { PortofolioService } from '../../src/feature/portofolio/application/portofolio/portofolio_service';
import { WorkService } from '../../src/feature/portofolio/application/work/work_service';
import { AchievementEntity } from '../../src/feature/portofolio/domain/model/entities/achievement_entity';
import { CodeLanguageEntity } from '../../src/feature/portofolio/domain/model/entities/code_language_entity';
import { FrameworkEntity } from '../../src/feature/portofolio/domain/model/entities/framework_entity';
import { PortofolioEntity } from '../../src/feature/portofolio/domain/model/entities/portofolio/portofolio_entity';
import { WorkEntity } from '../../src/feature/portofolio/domain/model/entities/work/work_entity';

type Positionable = {
  id: string;
  position: number;
};

type PositionRepo<T extends Positionable> = {
  saved: T[];
  findAllPositioned: jest.Mock<Promise<T[]>>;
  findOneById: jest.Mock<Promise<T | null>>;
  createOrUpdate: jest.Mock<Promise<T>>;
  createOrUpdateMany: jest.Mock<Promise<T[]>>;
  removeById: jest.Mock<Promise<void>>;
};

type ServiceCase<T extends Positionable> = {
  name: string;
  createService: (repo: PositionRepo<T>) => {
    create: (request: any) => Promise<T | null>;
    update: (id: string, request: any) => Promise<T | null>;
  };
  createEntity: (id: string, position: number) => T;
  requestExtra?: Record<string, unknown>;
};

function clone<T>(value: T): T {
  return { ...(value as object) } as T;
}

function createRepo<T extends Positionable>(
  contents: T[],
  findOne: T | null = null,
): PositionRepo<T> {
  const repo = {
    saved: [] as T[],
    findAllPositioned: jest.fn(async () => contents.map(clone)),
    findOneById: jest.fn(async () => (findOne ? clone(findOne) : null)),
    createOrUpdate: jest.fn(async (data: T) => clone(data)),
    createOrUpdateMany: jest.fn(async (data: T[]) => {
      repo.saved = data.map(clone);
      return repo.saved;
    }),
    removeById: jest.fn(async () => undefined),
  };
  return repo;
}

function createMinioService() {
  return {
    getPresignedUploadUrl: jest.fn(),
    removeObject: jest.fn(),
  };
}

function createRequest<T extends Positionable>(
  entity: T,
  position?: number,
  extra: Record<string, unknown> = {},
) {
  return {
    position,
    image_path: null,
    thumbnail_path: null,
    convertToEntity: jest.fn(() => clone(entity)),
    ...extra,
  };
}

function createWorkEntity(id: string, position: number): WorkEntity {
  return {
    id,
    position,
    companyName: `Company ${id}`,
    jobTitle: `Role ${id}`,
    description: `Description ${id}`,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
  } as WorkEntity;
}

function createPortofolioEntity(id: string, position: number): PortofolioEntity {
  return {
    id,
    position,
    title: `Portofolio ${id}`,
    description: `Description ${id}`,
  } as PortofolioEntity;
}

function createCodeLanguageEntity(
  id: string,
  position: number,
): CodeLanguageEntity {
  return {
    id,
    position,
    title: `Code ${id}`,
    description: `Description ${id}`,
  } as CodeLanguageEntity;
}

function createFrameworkEntity(id: string, position: number): FrameworkEntity {
  return {
    id,
    position,
    codeLanguageId: 'code-language-a',
    title: `Framework ${id}`,
    description: `Description ${id}`,
  } as FrameworkEntity;
}

function createAchievementEntity(
  id: string,
  position: number,
): AchievementEntity {
  return {
    id,
    position,
    title: `Achievement ${id}`,
    description: `Description ${id}`,
    date: new Date('2026-01-01T00:00:00.000Z'),
  } as AchievementEntity;
}

const serviceCases: ServiceCase<Positionable>[] = [
  {
    name: 'WorkService',
    createEntity: createWorkEntity,
    createService: (repo) => {
      const service = new WorkService(repo as any, createMinioService() as any);
      return {
        create: (request) => service.createWork(request),
        update: (id, request) => service.updateWork(id, request),
      };
    },
  },
  {
    name: 'PortofolioService',
    createEntity: createPortofolioEntity,
    requestExtra: {
      work_id: null,
      apps_sources: [],
      images: [],
      category_ids: [],
      framework_ids: [],
      deleted_apps_source_ids: [],
      deleted_image_ids: [],
      deleted_category_ids: [],
      deleted_framework_ids: [],
    },
    createService: (repo) => {
      const service = new PortofolioService(
        repo as any,
        createMinioService() as any,
        { findOneById: jest.fn() } as any,
        { syncWithPortofolioIdAndListImagePath: jest.fn() } as any,
        { syncWithPortofolioIdAndListAppsSourceId: jest.fn() } as any,
        { syncWithPortofolioIdAndListFrameworkId: jest.fn() } as any,
        { syncWithPortofolioIdAndListCategoryId: jest.fn() } as any,
        { syncWithPortofolioIdAndListToolId: jest.fn() } as any,
      );
      return {
        create: (request) => service.createPortofolio(request),
        update: (id, request) => service.updatePortofolio(id, request),
      };
    },
  },
  {
    name: 'CodeLanguageService',
    createEntity: createCodeLanguageEntity,
    createService: (repo) => {
      const service = new CodeLanguageService(
        repo as any,
        createMinioService() as any,
      );
      return {
        create: (request) => service.createCodeLanguage(request),
        update: (id, request) => service.updateCodeLanguage(id, request),
      };
    },
  },
  {
    name: 'FrameworkService',
    createEntity: createFrameworkEntity,
    requestExtra: {
      code_language_ids: [],
      deleted_code_language_ids: [],
    },
    createService: (repo) => {
      const service = new FrameworkService(
        repo as any,
        createMinioService() as any,
        { syncWithFrameworkIdAndListCodeLanguageId: jest.fn() } as any,
      );
      return {
        create: (request) => service.createFramework(request),
        update: (id, request) => service.updateFramework(id, request),
      };
    },
  },
  {
    name: 'AchievementService',
    createEntity: createAchievementEntity,
    createService: (repo) => {
      const service = new AchievementService(
        repo as any,
        createMinioService() as any,
      );
      return {
        create: (request) => service.createAchievement(request),
        update: (id, request) => service.updateAchievement(id, request),
      };
    },
  },
];

describe.each(serviceCases)('$name position sync', (serviceCase) => {
  it('shifts existing content when creating into an occupied position', async () => {
    const existingA = serviceCase.createEntity('content-a', 1);
    const existingB = serviceCase.createEntity('content-b', 2);
    const newContent = serviceCase.createEntity('content-c', 0);
    const repo = createRepo([existingA, existingB]);
    const service = serviceCase.createService(repo);

    const result = await service.create(
      createRequest(newContent, 1, serviceCase.requestExtra),
    );

    expect(result?.id).toBe('content-c');
    expect(result?.position).toBe(1);
    expect(repo.saved.map(({ id, position }) => ({ id, position }))).toEqual([
      { id: 'content-c', position: 1 },
      { id: 'content-a', position: 2 },
      { id: 'content-b', position: 3 },
    ]);
  });

  it('shifts existing content when updating into an occupied position', async () => {
    const existingA = serviceCase.createEntity('content-a', 1);
    const existingB = serviceCase.createEntity('content-b', 2);
    const updatedB = serviceCase.createEntity('content-b', 2);
    const repo = createRepo([existingA, existingB], existingB);
    const service = serviceCase.createService(repo);

    const result = await service.update(
      'content-b',
      createRequest(updatedB, 1, serviceCase.requestExtra),
    );

    expect(result?.id).toBe('content-b');
    expect(result?.position).toBe(1);
    expect(repo.saved.map(({ id, position }) => ({ id, position }))).toEqual([
      { id: 'content-b', position: 1 },
      { id: 'content-a', position: 2 },
    ]);
  });

  it('does not reorder other content when updating without position', async () => {
    const existingA = serviceCase.createEntity('content-a', 1);
    const existingB = serviceCase.createEntity('content-b', 2);
    const updatedB = serviceCase.createEntity('content-b', 0);
    const repo = createRepo([existingA, existingB], existingB);
    const service = serviceCase.createService(repo);

    const result = await service.update(
      'content-b',
      createRequest(updatedB, undefined, serviceCase.requestExtra),
    );

    expect(result?.position).toBe(2);
    expect(repo.createOrUpdate).toHaveBeenCalledTimes(1);
    expect(repo.createOrUpdateMany).not.toHaveBeenCalled();
  });
});
