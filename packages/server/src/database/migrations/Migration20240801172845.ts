import { Migration } from '@mikro-orm/migrations';

export class Migration20240801172845 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "media" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "filename" varchar(255) not null, "mime_type" varchar(255) not null, "height" int not null, "width" int not null);');
    this.addSql('alter table "media" add constraint "media_name_unique" unique ("name");');

    this.addSql('create table "knob" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null);');
    this.addSql('alter table "knob" add constraint "knob_name_unique" unique ("name");');

    this.addSql('create table "jack" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "is_side" boolean not null);');
    this.addSql('alter table "jack" add constraint "jack_name_unique" unique ("name");');

    this.addSql('create table "inlay" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "scale" real null, "thumbnail_id" int null, "fret1_id" int null, "fret2_id" int null, "fret3_id" int null, "fret4_id" int null, "fret5_id" int null, "fret6_id" int null, "fret7_id" int null, "fret8_id" int null, "fret9_id" int null, "fret10_id" int null, "fret11_id" int null, "fret12_id" int null, "fret13_id" int null, "fret14_id" int null, "fret15_id" int null, "fret16_id" int null, "fret17_id" int null, "fret18_id" int null, "fret19_id" int null, "fret20_id" int null, "fret21_id" int null, "fret22_id" int null, "fret23_id" int null, "fret24_id" int null, "fret25_id" int null, "fret26_id" int null, "fret27_id" int null);');
    this.addSql('alter table "inlay" add constraint "inlay_name_unique" unique ("name");');

    this.addSql('create table "headstock" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "pegs_spawn_point" jsonb not null, "front_shadow_texture_id" int null, "back_shadow_texture_id" int null, "is_slotted" boolean not null, "logo_spawn_point" jsonb null, "slotted_rod_offset" int null, "slotted_guard_length" int null, "slotted_guard_spawn_point" jsonb null);');
    this.addSql('alter table "headstock" add constraint "headstock_name_unique" unique ("name");');

    this.addSql('create table "electric_guitar_model" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "mask_id" int null, "mask_scale" real null, "price" int not null, "is_bass" boolean null, "mirror_sound_hole" boolean null, "flip_electronic_cover" boolean null, "bridge_to_bottom" int null, "sound_hole_spawn_point_left" jsonb null, "sound_hole_spawn_point_right" jsonb null, "sound_hole_scale" real null, "electronic_cover_spawn_point" jsonb null, "minor_electronic_cover_spawn_point" jsonb null, "battery_cover_spawn_point" jsonb null, "logo_spawn_point" jsonb null, "top_pin_spawn_point" jsonb null, "bottom_pin_spawn_point" jsonb null, "knob_spawn_point" jsonb null, "bridge_spawn_point" jsonb not null, "switch_spawn_point" jsonb null, "top_jack_spawn_point" jsonb null, "side_jack_spawn_point" jsonb null, "top_spawn_point" jsonb null, "bottom_spawn_point" jsonb not null, "flat_contour_overlay_id" int null, "forearm_contour_overlay_id" int null, "tummy_contour_overlay_id" int null, "carved_contour_overlay_id" int null);');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_name_unique" unique ("name");');

    this.addSql('create table "bridge" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "string_spawn_point" jsonb not null, "bottom_point" jsonb not null, "is_bass" boolean not null, "multiscale" boolean null, "headless" boolean null, "tremolo" boolean null, "type" text check ("type" in (\'fixed\', \'tuneomatic\', \'tailpiece\', \'near-tailpiece\', \'mono\')) not null, "supported_pickup" text check ("supported_pickup" in (\'single\', \'humbucker\', \'p90\', \'jazz\', \'piezo\', \'soapbar\', \'musicman\')) null, "pickup_spawn_point" jsonb null, "height" int null, "extendable" boolean null);');
    this.addSql('alter table "bridge" add constraint "bridge_name_unique" unique ("name");');

    this.addSql('create table "acoustic_guitar_model" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "mask_scale" real null, "normal_mask_id" int null, "beveled_mask_id" int null, "none_cutaway_mask_id" int null, "soft_cutaway_mask_id" int null, "venetian_cutaway_mask_id" int null, "florentine_cutaway_mask_id" int null, "bridge_spawn_point" jsonb null, "top_spawn_point" jsonb null, "bottom_spawn_point" jsonb null, "preamp_spawn_point" jsonb null);');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_name_unique" unique ("name");');

    this.addSql('create table "nut" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "string_spawn_point" jsonb not null, "is_bass" boolean not null, "headless_only" boolean not null);');
    this.addSql('alter table "nut" add constraint "nut_name_unique" unique ("name");');

    this.addSql('create table "peg" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "peg_cap_texture_id" int null, "peg_back_texture_id" int null, "peg_rod_texture_id" int null, "peg_rod_pivot_position" jsonb not null, "peg_back_pivot_position" jsonb not null, "scale" real null, "pivot_position" jsonb not null, "is_bass" boolean not null, "for_slotted_headstock" boolean not null, "slotted_guard_color" varchar(255) null, "slotted_string_count" int null);');
    this.addSql('alter table "peg" add constraint "peg_name_unique" unique ("name");');

    this.addSql('create table "pickguard" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "price" int not null, "texture_id" int null, "pivot_position" jsonb not null, "model_id" int not null, "scale" real not null, "type" text check ("type" in (\'small\', \'medium\', \'large\')) not null);');

    this.addSql('create table "pickup" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "type" text check ("type" in (\'single\', \'humbucker\', \'p90\', \'jazz\', \'piezo\', \'soapbar\', \'musicman\')) not null, "string_count" int not null);');
    this.addSql('alter table "pickup" add constraint "pickup_name_unique" unique ("name");');

    this.addSql('create table "switch" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "thumbnail_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null);');
    this.addSql('alter table "switch" add constraint "switch_name_unique" unique ("name");');

    this.addSql('create table "wood" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) null, "price" int not null, "texture_id" int null);');
    this.addSql('alter table "wood" add constraint "wood_name_unique" unique ("name");');

    this.addSql('alter table "knob" add constraint "knob_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "knob" add constraint "knob_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "jack" add constraint "jack_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "jack" add constraint "jack_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "inlay" add constraint "inlay_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret1_id_foreign" foreign key ("fret1_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret2_id_foreign" foreign key ("fret2_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret3_id_foreign" foreign key ("fret3_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret4_id_foreign" foreign key ("fret4_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret5_id_foreign" foreign key ("fret5_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret6_id_foreign" foreign key ("fret6_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret7_id_foreign" foreign key ("fret7_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret8_id_foreign" foreign key ("fret8_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret9_id_foreign" foreign key ("fret9_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret10_id_foreign" foreign key ("fret10_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret11_id_foreign" foreign key ("fret11_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret12_id_foreign" foreign key ("fret12_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret13_id_foreign" foreign key ("fret13_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret14_id_foreign" foreign key ("fret14_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret15_id_foreign" foreign key ("fret15_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret16_id_foreign" foreign key ("fret16_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret17_id_foreign" foreign key ("fret17_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret18_id_foreign" foreign key ("fret18_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret19_id_foreign" foreign key ("fret19_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret20_id_foreign" foreign key ("fret20_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret21_id_foreign" foreign key ("fret21_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret22_id_foreign" foreign key ("fret22_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret23_id_foreign" foreign key ("fret23_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret24_id_foreign" foreign key ("fret24_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret25_id_foreign" foreign key ("fret25_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret26_id_foreign" foreign key ("fret26_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "inlay" add constraint "inlay_fret27_id_foreign" foreign key ("fret27_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "headstock" add constraint "headstock_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "headstock" add constraint "headstock_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "headstock" add constraint "headstock_front_shadow_texture_id_foreign" foreign key ("front_shadow_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "headstock" add constraint "headstock_back_shadow_texture_id_foreign" foreign key ("back_shadow_texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_mask_id_foreign" foreign key ("mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_flat_contour_overlay_id_foreign" foreign key ("flat_contour_overlay_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_forearm_contour_overlay_id_foreign" foreign key ("forearm_contour_overlay_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_tummy_contour_overlay_id_foreign" foreign key ("tummy_contour_overlay_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "electric_guitar_model" add constraint "electric_guitar_model_carved_contour_overlay_id_foreign" foreign key ("carved_contour_overlay_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "bridge" add constraint "bridge_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "bridge" add constraint "bridge_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_normal_mask_id_foreign" foreign key ("normal_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_beveled_mask_id_foreign" foreign key ("beveled_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_none_cutaway_mask_id_foreign" foreign key ("none_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_soft_cutaway_mask_id_foreign" foreign key ("soft_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_venetian_cutaway_mask_id_foreign" foreign key ("venetian_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "acoustic_guitar_model" add constraint "acoustic_guitar_model_florentine_cutaway_mask_id_foreign" foreign key ("florentine_cutaway_mask_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "nut" add constraint "nut_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "nut" add constraint "nut_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "peg" add constraint "peg_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "peg" add constraint "peg_peg_cap_texture_id_foreign" foreign key ("peg_cap_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "peg" add constraint "peg_peg_back_texture_id_foreign" foreign key ("peg_back_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "peg" add constraint "peg_peg_rod_texture_id_foreign" foreign key ("peg_rod_texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "pickguard" add constraint "pickguard_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "pickguard" add constraint "pickguard_model_id_foreign" foreign key ("model_id") references "electric_guitar_model" ("id") on update cascade on delete cascade;');

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

    this.addSql('alter table "inlay" drop constraint "inlay_thumbnail_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret1_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret2_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret3_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret4_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret5_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret6_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret7_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret8_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret9_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret10_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret11_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret12_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret13_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret14_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret15_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret16_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret17_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret18_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret19_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret20_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret21_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret22_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret23_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret24_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret25_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret26_id_foreign";');

    this.addSql('alter table "inlay" drop constraint "inlay_fret27_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_thumbnail_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_texture_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_front_shadow_texture_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_back_shadow_texture_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_thumbnail_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_mask_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_flat_contour_overlay_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_forearm_contour_overlay_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_tummy_contour_overlay_id_foreign";');

    this.addSql('alter table "electric_guitar_model" drop constraint "electric_guitar_model_carved_contour_overlay_id_foreign";');

    this.addSql('alter table "bridge" drop constraint "bridge_thumbnail_id_foreign";');

    this.addSql('alter table "bridge" drop constraint "bridge_texture_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_thumbnail_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_normal_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_beveled_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_none_cutaway_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_soft_cutaway_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_venetian_cutaway_mask_id_foreign";');

    this.addSql('alter table "acoustic_guitar_model" drop constraint "acoustic_guitar_model_florentine_cutaway_mask_id_foreign";');

    this.addSql('alter table "nut" drop constraint "nut_thumbnail_id_foreign";');

    this.addSql('alter table "nut" drop constraint "nut_texture_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_thumbnail_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_peg_cap_texture_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_peg_back_texture_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_peg_rod_texture_id_foreign";');

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

    this.addSql('drop table if exists "inlay" cascade;');

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
