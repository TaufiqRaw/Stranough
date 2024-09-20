import { Migration } from '@mikro-orm/migrations';

export class Migration20240818140240 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "refresh_token" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "refresh_token";');
  }

}
