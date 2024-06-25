import { Migration } from '@mikro-orm/migrations';

export class Migration20240622160959 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "media" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "filename" varchar(255) not null, "mime_type" varchar(255) not null, "height" int not null, "width" int not null);');
    this.addSql('alter table "media" add constraint "media_name_unique" unique ("name");');

    this.addSql('create table "knob" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null);');
    this.addSql('alter table "knob" add constraint "knob_name_unique" unique ("name");');

    this.addSql('create table "jack" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "is_side" boolean not null);');
    this.addSql('alter table "jack" add constraint "jack_name_unique" unique ("name");');

    this.addSql('create table "headstock" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "pegs_spawn_point" jsonb not null, "front_shadow_texture_id" int null, "back_shadow_texture_id" int null);');
    this.addSql('alter table "headstock" add constraint "headstock_name_unique" unique ("name");');

    this.addSql('create table "electric_guitar_model" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "fingerboard_spawn_point" jsonb null, "fingerboard_back_end_spawn_point" jsonb null, "bridge_spawn_point" jsonb null, "pickguard_spawn_point" jsonb null, "pickup_spawn_point" jsonb null, "mask_scale" real null, "knob_spawn_point" jsonb null, "switch_spawn_point" jsonb null, "top_jack_spawn_point" jsonb null, "side_jack_spawn_point" jsonb null, "bolt_on_construction_mask_id" int null, "set_in_construction_mask_id" int null, "neck_through_construction_mask_id" int null, "flat_contour_shadow_id" int null, "flat_contour_spec_id" int null, "forearm_contour_shadow_id" int null, "forearm_contour_spec_id" int null, "tummy_contour_shadow_id" int null, "tummy_contour_spec_id" int null, "carved_contour_shadow_id" int null, "carved_contour_spec_id" int null);');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_name_unique" unique ("name");');

    this.addSql('create table "bridge" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "string_spawn_point" jsonb not null);');
    this.addSql('alter table "bridge" add constraint "bridge_name_unique" unique ("name");');

    this.addSql('create table "acoustic_guitar_model" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "fingerboard_spawn_point" jsonb null, "fingerboard_back_end_spawn_point" jsonb null, "bridge_spawn_point" jsonb null, "pickguard_spawn_point" jsonb null, "price" int not null, "mask_scale" real null, "jack_spawn_point" jsonb null, "none_cutaway_mask_id" int null, "soft_cutaway_mask_id" int null, "venetian_cutaway_mask_id" int null, "florentine_cutaway_mask_id" int null, "none_cutaway_burst_id" int null, "soft_cutaway_burst_id" int null, "venetian_cutaway_burst_id" int null, "florentine_cutaway_burst_id" int null);');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_name_unique" unique ("name");');

    this.addSql('create table "nut" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "string_spawn_point" jsonb not null);');
    this.addSql('alter table "nut" add constraint "nut_name_unique" unique ("name");');

    this.addSql('create table "peg" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "peg_cap_texture_id" int null, "peg_back_texture_id" int null, "peg_back_pivot_position" jsonb not null, "scale" real not null, "pivot_position" jsonb not null);');
    this.addSql('alter table "peg" add constraint "peg_name_unique" unique ("name");');

    this.addSql('create table "pickguard" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "price" int not null, "texture_id" int null, "pivot_position" jsonb not null, "model_id" int not null, "scale" real not null);');
    this.addSql('alter table "pickguard" add constraint "pickguard_name_unique" unique ("name");');

    this.addSql('create table "pickup" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "type" text check ("type" in (\'single\', \'humbucker\', \'p90\')) not null, "string_count" int not null);');
    this.addSql('alter table "pickup" add constraint "pickup_name_unique" unique ("name");');

    this.addSql('create table "switch" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null);');
    this.addSql('alter table "switch" add constraint "switch_name_unique" unique ("name");');

    this.addSql('create table "wood" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "price" int not null, "texture_id" int null);');
    this.addSql('alter table "wood" add constraint "wood_name_unique" unique ("name");');

    this.addSql('alter table "knob" add constraint "knob_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "knob" add constraint "knob_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "jack" add constraint "jack_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "jack" add constraint "jack_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "headstock" add constraint "headstock_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "headstock" add constraint "headstock_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "headstock" add constraint "headstock_front_shadow_texture_id_foreign" foreign key ("front_shadow_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "headstock" add constraint "headstock_back_shadow_texture_id_foreign" foreign key ("back_shadow_texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_bolt_on_construction_mask_id_foreign" foreign key ("bolt_on_construction_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_set_in_construction_mask_id_foreign" foreign key ("set_in_construction_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_neck_through_construction_mask_id_foreign" foreign key ("neck_through_construction_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_flat_contour_shadow_id_foreign" foreign key ("flat_contour_shadow_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_flat_contour_spec_id_foreign" foreign key ("flat_contour_spec_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_forearm_contour_shadow_id_foreign" foreign key ("forearm_contour_shadow_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_forearm_contour_spec_id_foreign" foreign key ("forearm_contour_spec_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_tummy_contour_shadow_id_foreign" foreign key ("tummy_contour_shadow_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_tummy_contour_spec_id_foreign" foreign key ("tummy_contour_spec_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_carved_contour_shadow_id_foreign" foreign key ("carved_contour_shadow_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_carved_contour_spec_id_foreign" foreign key ("carved_contour_spec_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "bridge" add constraint "bridge_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "bridge" add constraint "bridge_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_none_cutaway_mask_id_foreign" foreign key ("none_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_soft_cutaway_mask_id_foreign" foreign key ("soft_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_venetian_cutaway_mask_id_foreign" foreign key ("venetian_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_florentine_cutaway_mask_id_foreign" foreign key ("florentine_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_none_cutaway_burst_id_foreign" foreign key ("none_cutaway_burst_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_soft_cutaway_burst_id_foreign" foreign key ("soft_cutaway_burst_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_venetian_cutaway_burst_id_foreign" foreign key ("venetian_cutaway_burst_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_florentine_cutaway_burst_id_foreign" foreign key ("florentine_cutaway_burst_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "nut" add constraint "nut_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "nut" add constraint "nut_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "peg" add constraint "peg_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "peg" add constraint "peg_peg_cap_texture_id_foreign" foreign key ("peg_cap_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "peg" add constraint "peg_peg_back_texture_id_foreign" foreign key ("peg_back_texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "pickguard" add constraint "pickguard_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "pickguard" add constraint "pickguard_model_id_foreign" foreign key ("model_id") references "electric_guitar_model" ("id") on update cascade;');

    this.addSql('alter table "pickup" add constraint "pickup_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "pickup" add constraint "pickup_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "switch" add constraint "switch_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "switch" add constraint "switch_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "wood" add constraint "wood_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "knob" drop constraint "knob_thumbnail_id_foreign";');

    this.addSql('alter table "knob" drop constraint "knob_texture_id_foreign";');

    this.addSql('alter table "jack" drop constraint "jack_thumbnail_id_foreign";');

    this.addSql('alter table "jack" drop constraint "jack_texture_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_thumbnail_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_texture_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_front_shadow_texture_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_back_shadow_texture_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_thumbnail_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_bolt_on_construction_mask_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_set_in_construction_mask_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_neck_through_construction_mask_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_flat_contour_shadow_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_flat_contour_spec_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_forearm_contour_shadow_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_forearm_contour_spec_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_tummy_contour_shadow_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_tummy_contour_spec_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_carved_contour_shadow_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_carved_contour_spec_id_foreign";');

    this.addSql('alter table "bridge" drop constraint "bridge_thumbnail_id_foreign";');

    this.addSql('alter table "bridge" drop constraint "bridge_texture_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_thumbnail_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_none_cutaway_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_soft_cutaway_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_venetian_cutaway_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_florentine_cutaway_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_none_cutaway_burst_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_soft_cutaway_burst_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_venetian_cutaway_burst_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_florentine_cutaway_burst_id_foreign";');

    this.addSql('alter table "nut" drop constraint "nut_thumbnail_id_foreign";');

    this.addSql('alter table "nut" drop constraint "nut_texture_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_thumbnail_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_peg_cap_texture_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_peg_back_texture_id_foreign";');

    this.addSql('alter table "pickguard" drop constraint "pickguard_texture_id_foreign";');

    this.addSql('alter table "pickup" drop constraint "pickup_thumbnail_id_foreign";');

    this.addSql('alter table "pickup" drop constraint "pickup_texture_id_foreign";');

    this.addSql('alter table "switch" drop constraint "switch_thumbnail_id_foreign";');

    this.addSql('alter table "switch" drop constraint "switch_texture_id_foreign";');

    this.addSql('alter table "wood" drop constraint "wood_texture_id_foreign";');

    this.addSql('alter table "pickguard" drop constraint "pickguard_model_id_foreign";');

    this.addSql('drop table if exists "media" cascade;');

    this.addSql('drop table if exists "knob" cascade;');

    this.addSql('drop table if exists "jack" cascade;');

    this.addSql('drop table if exists "headstock" cascade;');

    this.addSql('drop table if exists "electric_guitar_model" cascade;');

    this.addSql('drop table if exists "bridge" cascade;');

    this.addSql('drop table if exists "acoustic_guitar_model" cascade;');

    this.addSql('drop table if exists "nut" cascade;');

    this.addSql('drop table if exists "peg" cascade;');

    this.addSql('drop table if exists "pickguard" cascade;');

    this.addSql('drop table if exists "pickup" cascade;');

    this.addSql('drop table if exists "switch" cascade;');

    this.addSql('drop table if exists "wood" cascade;');
  }

}
