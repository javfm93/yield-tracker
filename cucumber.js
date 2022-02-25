const yieldTrackerBackend = [
  '--require-module ts-node/register',
  '--require tests/apps/yield-tracker/backend/features/step_definitions/*.steps.ts',
  'tests/apps/yield-tracker/backend/features/**/*.feature'
].join(' ');

module.exports = {
  yieldTrackerBackend
};
// todo: https://www.adictosaltrabajo.com/2020/03/23/configuracion-de-cucumber-js-y-jest-cucumber-en-visual-studio-code-con-typescript/
