import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDatabase1774671885587 implements MigrationInterface {
  name = 'InitialDatabase1774671885587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`achievements\` (
        \`id\` varchar(36) NOT NULL,  
        \`title\` varchar(255) NOT NULL, 
        \`description\` varchar(255) NOT NULL, 
        \`date\` timestamp NOT NULL, 
        \`image_path\` text NOT NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (
        \`id\` varchar(36) NOT NULL,
        \`title\` varchar(255) NOT NULL, 
        \`description\` text NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`code_languages\` (
        \`id\` varchar(36) NOT NULL,
        \`title\` varchar(255) NOT NULL, 
        \`description\` varchar(255) NOT NULL, 
        \`image_path\` text NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`frameworks\` (
        \`id\` varchar(36) NOT NULL,  
        \`code_language_id\` varchar(255) NOT NULL, 
        \`title\` varchar(255) NOT NULL, 
        \`description\` varchar(255) NOT NULL, 
        \`image_path\` text NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`generals\` (
        \`id\` varchar(36) NOT NULL, 
        \`title\` varchar(255) NOT NULL, 
        \`description\` text NOT NULL, 
        \`email\` varchar(255) NOT NULL, 
        \`github_url\` text NOT NULL, 
        \`gitlab_url\` text NOT NULL, 
        \`linkedin_url\` text NOT NULL, 
        \`thread_url\` text NOT NULL, 
        \`tiktok_url\` text NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`portofolio_category_mapping\` (
        \`id\` varchar(36) NOT NULL,
        \`portofolio_id\` varchar(255) NOT NULL, 
        \`category_id\` varchar(255) NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`portofolios\` (
        \`id\` varchar(36) NOT NULL,
        \`title\` varchar(255) NOT NULL, 
        \`description\` text NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`portofolio_framework_mapping\` (
        \`id\` varchar(36) NOT NULL,
        \`portofolio_id\` varchar(255) NOT NULL, 
        \`framework_id\` varchar(255) NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`works\` (
        \`id\` varchar(36) NOT NULL, 
        \`job_title\` varchar(50) NOT NULL, 
        \`description\` text NOT NULL, 
        \`start_date\` timestamp NOT NULL, 
        \`end_date\` timestamp NULL, 
        \`appstoreUrl\` text NOT NULL, 
        \`githubUrl\` text NULL, 
        \`imagePath\` text NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`work_portofolio_mapping\` (
        \`id\` varchar(36) NOT NULL,
        \`work_id\` varchar(255) NOT NULL, 
        \`portofolio_id\` varchar(255) NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`work_portofolio_mapping\``);
    await queryRunner.query(`DROP TABLE \`works\``);
    await queryRunner.query(`DROP TABLE \`portofolio_framework_mapping\``);
    await queryRunner.query(`DROP TABLE \`portofolios\``);
    await queryRunner.query(`DROP TABLE \`portofolio_category_mapping\``);
    await queryRunner.query(`DROP TABLE \`generals\``);
    await queryRunner.query(`DROP TABLE \`frameworks\``);
    await queryRunner.query(`DROP TABLE \`code_languages\``);
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP TABLE \`achievements\``);
  }
}
