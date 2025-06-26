import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

/**
 * DTO (Data Transfer Object) - factory to build request body
 */
const buildRiskScoreRequest = (
  personalCode: string = '50001029996',
  income: number = 1000,
  liabilities: number = 100
) => ({
  personalCode,
  financialStatus: {
    income,
    liabilities
  }
})

test('positive case – low risk – should return 404 with expected fields', async ({ request }) => {
  const requestBody = buildRiskScoreRequest('50001029996', 2000, 100)

  const response = await request.post('https://backend.tallinn-learning.ee/risk-api/calcRiskScore', {
    data: requestBody
  })

  const responseBody = await response.text()

  // Status code
  expect(response.status()).toBe(StatusCodes.NOT_FOUND)

  // Soft assertions
  expect.soft(responseBody).toHaveProperty('decision')
  expect.soft(responseBody).toHaveProperty('riskLevel')
  expect.soft(responseBody.decision).toBe('POSITIVE')
  expect.soft(responseBody.riskLevel).toBe('LOW')
})

test('negative case – high liabilities – should return 200 with NEGATIVE decision', async ({ request }) => {
  const requestBody = buildRiskScoreRequest('50001029996', 500, 2000)

  const response = await request.post('https://backend.tallinn-learning.ee/risk-api/calcRiskScore', {
    data: requestBody
  })

  const responseBody = await response.text()

  // Status code
  expect(response.status()).toBe(StatusCodes.OK)

  // Soft assertions
  expect.soft(responseBody).toHaveProperty('decision')
  expect.soft(responseBody.decision).toBe('NEGATIVE')
  expect.soft(responseBody).not.toHaveProperty('riskLevel')
})
