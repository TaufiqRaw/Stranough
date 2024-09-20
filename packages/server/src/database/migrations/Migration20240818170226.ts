import { Migration } from '@mikro-orm/migrations';

export class Migration20240818170226 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" add column "feedback" varchar(3000) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "feedback";');
  }

}
