import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateToolsAndPortofolioToolMapping1775892084240
  implements MigrationInterface
{
  name = 'CreateToolsAndPortofolioToolMapping1775892084240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`tools\` (
        \`id\` varchar(36) NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` timestamp(6) NULL,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NULL,
        \`position\` int NOT NULL DEFAULT '0',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(`
      CREATE TABLE \`portofolio_tool_mapping\` (
        \`id\` varchar(36) NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` timestamp(6) NULL,
        \`portofolio_id\` varchar(36) NOT NULL,
        \`tool_id\` varchar(36) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(`
      ALTER TABLE \`portofolio_tool_mapping\`
      ADD CONSTRAINT \`FK_portofolio_tool_mapping_tool_id\`
      FOREIGN KEY (\`tool_id\`) REFERENCES \`tools\`(\`id\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`portofolio_tool_mapping\` DROP FOREIGN KEY \`FK_portofolio_tool_mapping_tool_id\``,
    );
    await queryRunner.query(`DROP TABLE \`portofolio_tool_mapping\``);
    await queryRunner.query(`DROP TABLE \`tools\``);
  }
}
