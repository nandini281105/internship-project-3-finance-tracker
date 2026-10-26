const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

const API_BASE = 'http://localhost:5000';

const makeRequest = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

test('Finance Tracker API Integration Suite', async (t) => {
  let authToken = '';
  let createdTransactionId = '';
  const testEmail = `test_${Date.now()}@example.com`;

  await t.test('1. Health check endpoint responds with 200 OK', async () => {
    const res = await makeRequest('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'ok');
  });

  await t.test('2. User Registration returns JWT token', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'Integration Tester',
      email: testEmail,
      password: 'testPassword123',
      currency: 'USD',
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.token, 'Should return JWT token');
    authToken = res.data.data.token;
  });

  await t.test('3. User Login returns valid JWT token', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: testEmail,
      password: 'testPassword123',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.email, testEmail);
  });

  await t.test('4. Protected profile route (/api/auth/me) retrieves user profile', async () => {
    const res = await makeRequest('/api/auth/me', 'GET', null, authToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.name, 'Integration Tester');
  });

  await t.test('5. Reject requests without JWT Bearer token', async () => {
    const res = await makeRequest('/api/transactions', 'GET');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  await t.test('6. Create income transaction', async () => {
    const res = await makeRequest(
      '/api/transactions',
      'POST',
      {
        title: 'Project Bonus',
        amount: 1500,
        type: 'income',
        category: 'Freelance',
        paymentMethod: 'Bank Transfer',
      },
      authToken
    );
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.amount, 1500);
    createdTransactionId = res.data.data._id;
  });

  await t.test('7. Create expense transaction', async () => {
    const res = await makeRequest(
      '/api/transactions',
      'POST',
      {
        title: 'Organic Groceries',
        amount: 250,
        type: 'expense',
        category: 'Groceries',
        paymentMethod: 'Credit Card',
      },
      authToken
    );
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
  });

  await t.test('8. Retrieve transactions and verify pagination', async () => {
    const res = await makeRequest('/api/transactions', 'GET', null, authToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 2);
    assert.strictEqual(res.data.pagination.totalCount, 2);
  });

  await t.test('9. Summary stats accurately computes balance and category totals', async () => {
    const res = await makeRequest('/api/transactions/stats/summary', 'GET', null, authToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.totalIncome, 1500);
    assert.strictEqual(res.data.data.totalExpense, 250);
    assert.strictEqual(res.data.data.netBalance, 1250);
  });

  await t.test('10. Delete transaction', async () => {
    const res = await makeRequest(`/api/transactions/${createdTransactionId}`, 'DELETE', null, authToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);

    // Verify deletion
    const verifyRes = await makeRequest('/api/transactions', 'GET', null, authToken);
    assert.strictEqual(verifyRes.data.data.length, 1);
  });
});
