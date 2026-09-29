import * as migration_20260925_222522_initial from './20260925_222522_initial';
import * as migration_20260929_161516_expand_content_and_globals from './20260929_161516_expand_content_and_globals';

export const migrations = [
  {
    up: migration_20260925_222522_initial.up,
    down: migration_20260925_222522_initial.down,
    name: '20260925_222522_initial',
  },
  {
    up: migration_20260929_161516_expand_content_and_globals.up,
    down: migration_20260929_161516_expand_content_and_globals.down,
    name: '20260929_161516_expand_content_and_globals'
  },
];
