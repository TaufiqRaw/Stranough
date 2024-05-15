import { Migration } from '@mikro-orm/migrations';

export class Migration20240515131124 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "guitar_model" drop constraint "guitar_model_bolt_on_body_id_foreign";');
    this.addSql('alter table "guitar_model" drop constraint "guitar_model_neck_through_body_id_foreign";');
    this.addSql('alter table "guitar_model" drop constraint "guitar_model_set_in_body_id_foreign";');

    this.addSql('alter table "guitar_model" add constraint "guitar_model_bolt_on_body_id_foreign" foreign key ("bolt_on_body_id") references "guitar_body" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_neck_through_body_id_foreign" foreign key ("neck_through_body_id") references "guitar_body" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_set_in_body_id_foreign" foreign key ("set_in_body_id") references "guitar_body" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "guitar_model" drop constraint "guitar_model_bolt_on_body_id_foreign";');
    this.addSql('alter table "guitar_model" drop constraint "guitar_model_neck_through_body_id_foreign";');
    this.addSql('alter table "guitar_model" drop constraint "guitar_model_set_in_body_id_foreign";');

    this.addSql('alter table "guitar_model" add constraint "guitar_model_bolt_on_body_id_foreign" foreign key ("bolt_on_body_id") references "guitar_body" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_neck_through_body_id_foreign" foreign key ("neck_through_body_id") references "guitar_body" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_set_in_body_id_foreign" foreign key ("set_in_body_id") references "guitar_body" ("id") on update cascade on delete set null;');
  }

}
