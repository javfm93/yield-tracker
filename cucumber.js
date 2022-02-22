const common = [
  '--require-module ts-node/register' // Load TypeScript module
];

const yieldTrackerBackend = [
  ...common,
  'tests/apps/yield-tracker/backend/features/**/*.feature',
  '--require tests/apps/yield-tracker/backend/features/step_definitions/*.steps.ts'
].join(' ');

module.exports = {
  yieldTrackerBackend
};
