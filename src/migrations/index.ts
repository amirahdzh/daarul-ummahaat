import * as migration_20260925_222522_initial from './20260925_222522_initial';
import * as migration_20260929_161516_expand_content_and_globals from './20260929_161516_expand_content_and_globals';
import * as migration_20261015_144111_add_hijri_day_adjustment from './20261015_144111_add_hijri_day_adjustment';

export const migrations = [
  {
    up: migration_20260925_222522_initial.up,
    down: migration_20260925_222522_initial.down,
    name: '20260925_222522_initial',
  },
  {
    up: migration_20260929_161516_expand_content_and_globals.up,
    down: migration_20260929_161516_expand_content_and_globals.down,
    name: '20260929_161516_expand_content_and_globals',
  },
  {
    up: migration_20261015_144111_add_hijri_day_adjustment.up,
    down: migration_20261015_144111_add_hijri_day_adjustment.down,
    name: '20261015_144111_add_hijri_day_adjustment'
  },
];
