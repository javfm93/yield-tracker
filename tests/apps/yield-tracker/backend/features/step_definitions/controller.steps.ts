import assert from 'assert';
import { AfterAll, BeforeAll, Given, Then } from 'cucumber';
import request from 'supertest';
import { YieldTrackerBackendApp } from '../../../../../../src/apps/yield-tracker/backend/YieldTrackerBackendApp';

let _request: request.Test;
let _response: request.Response;
let application: YieldTrackerBackendApp;

Given('I send a GET request to {string}', (route: string) => {
  _request = request(application.httpServer).get(route);
});

Given('I send a PUT request to {string} with body:', (route: string, body: string) => {
  _request = request(application.httpServer).put(route).send(JSON.parse(body));
});

Then('the response status code should be {int}', async (status: number) => {
  _response = await _request.expect(status);
});

Then('the response should be empty', () => {
  assert.deepEqual(_response.body, {});
});

Then('the response content should be:', response => {
  assert.deepEqual(_response.body, JSON.parse(response));
});

// todo: arrangers
BeforeAll(async () => {
  // const environmentArranger: Promise<EnvironmentArranger> = container.get('Mooc.EnvironmentArranger');
  // await (await environmentArranger).arrange();
  application = new YieldTrackerBackendApp();
  await application.start();
});

AfterAll(async () => {
  // const environmentArranger: Promise<EnvironmentArranger> = container.get('Mooc.EnvironmentArranger');
  // await (await environmentArranger).arrange();
  // await (await environmentArranger).close();
  await application.stop();
});
