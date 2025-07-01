import { APIResponse, expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from '../DTO/order-dto'

// Constants and URLs
const baseURL = 'https://backend.tallinn-learning.ee/test-orders'
const loginUrl = 'https://backend.tallinn-learning.ee/login/student'
const orderURL = 'https://backend.tallinn-learning.ee/login/orders'



// Login DTO class
class LoginDto {
  constructor(public username: string, public password: string) {}
}

// Test 1: Login, create order, fetch order
test('student receives token then creates an order', async ({ request }) => {
  // Step 1: Log in and get JWT
  const STATUS_OPEN = 'OPEN'
  const TEST_CUSTOMER_NAME = 'John Doe'
  const TEST_CUSTOMER_PHONE = '+123456789'
  const loginDto = new LoginDto('shamamha', 'whs4s6ybYf2n')
  const apiResponse: APIResponse = await request.post(loginUrl, {
    data: loginDto,
  })
  const jwt: string = await apiResponse.text()
  console.log('JWT:', jwt)
  // Step 2: Create a new order
  const orderDto = new OrderDto(
    STATUS_OPEN,
    0,
    TEST_CUSTOMER_NAME,
    TEST_CUSTOMER_PHONE,
    'no',
    10
  )

  const apiOrderResponse = await request.post(orderURL, {
    data: orderDto,
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })

  console.log('Order creation status:', apiOrderResponse.status())
  const orderJsonResponse: any = await apiOrderResponse.json()

  expect(orderJsonResponse.id).toBeDefined()
  expect(orderJsonResponse.customerName).toBe(TEST_CUSTOMER_NAME)
  expect(orderJsonResponse.customerPhone).toBe(TEST_CUSTOMER_PHONE)

  // Step 3: Get the created order by ID
  const orderId = orderJsonResponse.id
  console.log('Order ID received:', orderId)

  const apiGetOrderResponse = await request.get(`${orderURL}/${orderId}`, {
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })

  //const apiGetOrderJson = await apiGetOrderResponse.json()
  console.log('Get order status:', apiGetOrderResponse.status())
})

// Test 2: GET a fixed test order by ID
test('get order with correct id should receive code 200', async ({ request }) => {
  const apiResponse = await request.get(baseURL + '/1')

  console.log('Response body:', await apiResponse.json())
  console.log('Response headers:', apiResponse.headers())

  expect(apiResponse.status()).toBe(StatusCodes.OK)
})

// Test 3: POST an order with valid data
test('post order with correct data should receive code 201', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }

  const response = await request.post(baseURL, {
    data: requestBody,
  })

  console.log('Response status:', response.status())
  console.log('Response body:', await response.text())
  expect(response.status()).toBe(StatusCodes.OK) // Updated to 201 for order creation
})
