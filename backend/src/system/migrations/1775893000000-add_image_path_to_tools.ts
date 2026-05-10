import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImagePathToTools1775893000000
  implements MigrationInterface
{
  name = 'AddImagePathToTools1775893000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tools\` ADD \`image_path\` text NULL after \`description\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tools\` DROP COLUMN \`image_path\``,
    );
  }
}