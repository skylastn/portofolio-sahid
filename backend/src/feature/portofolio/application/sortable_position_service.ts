export interface PositionedEntity {
  id: string;
  position: number;
}

export interface PositionedRepository<T extends PositionedEntity> {
  findAllPositioned(): Promise<T[]>;
  createOrUpdateMany(data: T[]): Promise<T[]>;
}

export async function syncEntityPosition<T extends PositionedEntity>(
  repo: PositionedRepository<T>,
  entity: T,
  requestedPosition?: number | null,
): Promise<T> {
  const contents = await repo.findAllPositioned();
  const nextContents = contents.filter((content) => content.id !== entity.id);
  const fallbackPosition = nextContents.length + 1;
  const position = Number.isFinite(requestedPosition)
    ? Number(requestedPosition)
    : fallbackPosition;
  const nextPosition = Math.min(
    Math.max(Math.trunc(position), 1),
    fallbackPosition,
  );

  nextContents.splice(nextPosition - 1, 0, entity);
  nextContents.forEach((content, index) => {
    content.position = index + 1;
  });

  const result = await repo.createOrUpdateMany(nextContents);
  return result.find((content) => content.id === entity.id) ?? entity;
}
