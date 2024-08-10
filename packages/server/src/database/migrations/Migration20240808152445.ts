import { Migration } from '@mikro-orm/migrations';

export class Migration20240808152445 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_none_cutaway_mask_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop column "top_pin_spawn_point", drop column "bottom_pin_spawn_point";');

    this.addSql('alter table "electric_guitar_model" add column "strap_pin_spawn_points" jsonb null;');

    this.addSql('alter table "acoustic_guitar_model" drop column "none_cutaway_mask_id";');

    this.addSql('alter table "acoustic_guitar_model" add column "strap_pin_spawn_points" jsonb null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "electric_guitar_model" add column "bottom_pin_spawn_point" jsonb null;');
    this.addSql('alter table "electric_guitar_model" rename column "strap_pin_spawn_points" to "top_pin_spawn_point";');

    this.addSql('alter table "acoustic_guitar_model" drop column "strap_pin_spawn_points";');

    this.addSql('alter table "acoustic_guitar_model" add column "none_cutaway_mask_id" int null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_none_cutaway_mask_id_foreign" foreign key ("none_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');
  }

}
