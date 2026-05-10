import {
  PositionedEntity,
  PositionedRepository,
  syncEntityPosition,
} from '../../src/feature/portofolio/application/sortable_position_service';

type TestEntity = PositionedEntity & {
  title: string;
};

function createRepo(contents: TestEntity[]): PositionedRepository<TestEntity> & {
  saved: TestEntity[];
} {
  return {
    saved: [],
    async findAllPositioned() {
      return contents.map((content) => ({ ...content }));
    },
    async createOrUpdateMany(data: TestEntity[]) {
      this.saved = data.map((content) => ({ ...content }));
      return this.saved;
    },
  };
}

describe('syncEntityPosition', () => {
  it('moves an existing item up and shifts the previous item down', async () => {
    const repo = createRepo([
      { id: 'work-a', title: 'Work A', position: 1 },
      { id: 'work-b', title: 'Work B', position: 2 },
    ]);

    const result = await syncEntityPosition(
      repo,
      { id: 'work-b', title: 'Work B', position: 2 },
      1,
    );

    expect(result.position).toBe(1);
    expect(repo.saved).toEqual([
      { id: 'work-b', title: 'Work B', position: 1 },
      { id: 'work-a', title: 'Work A', position: 2 },
    ]);
  });

  it('moves an existing item down and shifts the next item up', async () => {
    const repo = createRepo([
      { id: 'work-a', title: 'Work A', position: 1 },
      { id: 'work-b', title: 'Work B', position: 2 },
      { id: 'work-c', title: 'Work C', position: 3 },
    ]);

    const result = await syncEntityPosition(
      repo,
      { id: 'work-a', title: 'Work A', position: 1 },
      3,
    );

    expect(result.position).toBe(3);
    expect(repo.saved).toEqual([
      { id: 'work-b', title: 'Work B', position: 1 },
      { id: 'work-c', title: 'Work C', position: 2 },
      { id: 'work-a', title: 'Work A', position: 3 },
    ]);
  });

  it('inserts a new item at the requested position', async () => {
    const repo = createRepo([
      { id: 'work-a', title: 'Work A', position: 1 },
      { id: 'work-b', title: 'Work B', position: 2 },
    ]);

    const result = await syncEntityPosition(
      repo,
      { id: 'work-c', title: 'Work C', position: 0 },
      2,
    );

    expect(result.position).toBe(2);
    expect(repo.saved).toEqual([
      { id: 'work-a', title: 'Work A', position: 1 },
      { id: 'work-c', title: 'Work C', position: 2 },
      { id: 'work-b', title: 'Work B', position: 3 },
    ]);
  });

  it('appends when position is omitted', async () => {
    const repo = createRepo([
      { id: 'work-a', title: 'Work A', position: 1 },
      { id: 'work-b', title: 'Work B', position: 2 },
    ]);

    const result = await syncEntityPosition(repo, {
      id: 'work-c',
      title: 'Work C',
      position: 0,
    });

    expect(result.position).toBe(3);
    expect(repo.saved).toEqual([
      { id: 'work-a', title: 'Work A', position: 1 },
      { id: 'work-b', title: 'Work B', position: 2 },
      { id: 'work-c', title: 'Work C', position: 3 },
    ]);
  });

  it('clamps requested position into the valid list range', async () => {
    const repo = createRepo([
      { id: 'work-a', title: 'Work A', position: 1 },
      { id: 'work-b', title: 'Work B', position: 2 },
    ]);

    await syncEntityPosition(
      repo,
      { id: 'work-c', title: 'Work C', position: 0 },
      -10,
    );

    expect(repo.saved).toEqual([
      { id: 'work-c', title: 'Work C', position: 1 },
      { id: 'work-a', title: 'Work A', position: 2 },
      { id: 'work-b', title: 'Work B', position: 3 },
    ]);
  });
});
