import { Migration } from '@mikro-orm/migrations';

export class Migration20240821072400 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" add column "selected_item_names" jsonb not null, add column "last_step" varchar(100) null, add column "is_finished" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "selected_item_names", drop column "last_step", drop column "is_finished";');
  }

}
