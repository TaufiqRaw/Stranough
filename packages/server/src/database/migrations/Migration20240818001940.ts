import { Migration } from '@mikro-orm/migrations';

export class Migration20240818001940 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "order" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(50) not null, "phone" varchar(14) not null, "selected_items" jsonb not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "order" cascade;');
  }

}
