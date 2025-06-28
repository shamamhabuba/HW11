import { test, expect } from '@playwright/test';
import { LoginDto } from '../DTO/login-dto';

const authURL = 'https://backend.tallinn-learning.ee/login/student';

const StatusCodes = {
  UNAUTHORIZED: 401,
  OK: 200,
  NOT_FOUND: 404,
};

test('should not allow login with incorrect credentials', async ({ request }) => {
  const loginData = new LoginDto('string123', 'string123');
  const response = await request.post(authURL, {
    data: loginData,
  });

  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
});

test('login to a student returns jwt', async ({ request }) => {
  //const loginData = new LoginDto('shamamha', 'whs4s5qbYbfT2n');
  const loginData = LoginDto.loginWithCorrectData();
  const response = await request.post(authURL, {
    data: loginData,
  });

  const responseBody = await response.text();
  console.log('responseBody:', responseBody);

  expect.soft(response.status()).toBe(StatusCodes.OK);
  expect.soft(responseBody).toBeDefined();
});
