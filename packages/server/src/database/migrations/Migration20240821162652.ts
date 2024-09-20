import { Migration } from '@mikro-orm/migrations';

export class Migration20240821162652 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "email" varchar(255) not null;');

    this.addSql('alter table "order" drop column "name", drop column "phone";');

    this.addSql('alter table "order" alter column "selected_item_names" type jsonb using ("selected_item_names"::jsonb);');
    this.addSql('alter table "order" alter column "selected_item_names" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "email";');

    this.addSql('alter table "order" add column "name" varchar(50) not null, add column "phone" varchar(14) not null;');
    this.addSql('alter table "order" alter column "selected_item_names" type jsonb using ("selected_item_names"::jsonb);');
    this.addSql('alter table "order" alter column "selected_item_names" set not null;');
  }

}
