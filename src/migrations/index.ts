import * as migration_20261122_074220_add_simulation_settings from './20261122_074220_add_simulation_settings';

export const migrations = [
  {
    up: migration_20261122_074220_add_simulation_settings.up,
    down: migration_20261122_074220_add_simulation_settings.down,
    name: '20261122_074220_add_simulation_settings'
  },
];
