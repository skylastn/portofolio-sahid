import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCvPathToGenerals1775894000000
  implements MigrationInterface
{
  name = 'AddCvPathToGenerals1775894000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`generals\` ADD \`cv_path\` text NULL after \`tiktok_url\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`generals\` DROP COLUMN \`cv_path\``,
    );
  }
}
