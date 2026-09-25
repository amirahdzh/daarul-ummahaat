import * as migration_20260925_222522_initial from './20260925_222522_initial';

export const migrations = [
  {
    up: migration_20260925_222522_initial.up,
    down: migration_20260925_222522_initial.down,
    name: '20260925_222522_initial'
  },
];
