import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { startDatabase, stopDatabase } from './helpers/database.helper';
import { createTestApp } from './helpers/app.helper';

describe('SalesOrder Lifecycle (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await startDatabase();
    app = await createTestApp();
  }, 120000);

  afterAll(async () => {
    await app.close();
    await stopDatabase();
  });

  let transportTypeId: string;
  let customerId: string;
  let itemId: string;
  let orderId: string;

  it('setup: creates transport type, customer, item', async () => {
    const ttRes = await request(app.getHttpServer())
      .post('/transport-types')
      .send({ name: 'Road Freight', description: 'Standard road' })
      .expect(201);
    transportTypeId = ttRes.body.id;

    const custRes = await request(app.getHttpServer())
      .post('/customers')
      .send({ name: 'Test Corp', document: 'DOC-001' })
      .expect(201);
    customerId = custRes.body.id;

    await request(app.getHttpServer())
      .post(`/customers/${customerId}/transport-types/${transportTypeId}`)
      .expect(200);

    const itemRes = await request(app.getHttpServer())
      .post('/items')
      .send({ sku: 'TEST-001', name: 'Test Item' })
      .expect(201);
    itemId = itemRes.body.id;
  });

  it('creates a sales order (CRIADA)', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({ customerId, transportTypeId, items: [{ itemId, quantity: 3 }] })
      .expect(201);

    expect(res.body.status).toBe('CRIADA');
    expect(res.body.items).toHaveLength(1);
    orderId = res.body.id;
  });

  it('transitions to PLANEJADA', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .send({ status: 'PLANEJADA' })
      .expect(200);
    expect(res.body.status).toBe('PLANEJADA');
  });

  it('schedules delivery and transitions to AGENDADA', async () => {
    await request(app.getHttpServer())
      .post(`/orders/${orderId}/schedule`)
      .send({ date: '2025-06-15', startTime: '09:00', endTime: '17:00' })
      .expect(200);

    const res = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .send({ status: 'AGENDADA' })
      .expect(200);
    expect(res.body.status).toBe('AGENDADA');
  });

  it('transitions to EM_TRANSPORTE', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .send({ status: 'EM_TRANSPORTE' })
      .expect(200);
    expect(res.body.status).toBe('EM_TRANSPORTE');
  });

  it('transitions to ENTREGUE', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .send({ status: 'ENTREGUE' })
      .expect(200);
    expect(res.body.status).toBe('ENTREGUE');
  });

  it('audit records were created for the order', async () => {
    const res = await request(app.getHttpServer())
      .get(`/audit?entityId=${orderId}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    const actionTypes = res.body.map((r: { actionType: string }) => r.actionType);
    expect(actionTypes).toContain('ORDER_CREATED');
    expect(actionTypes).toContain('STATUS_CHANGED');
  });

  it('rejects unauthorized transport type with 422', async () => {
    const newTtRes = await request(app.getHttpServer())
      .post('/transport-types')
      .send({ name: 'Air Express' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/orders')
      .send({
        customerId,
        transportTypeId: newTtRes.body.id,
        items: [{ itemId, quantity: 1 }],
      })
      .expect(422);
  });

  it('rejects invalid status transition with 422', async () => {
    const newOrderRes = await request(app.getHttpServer())
      .post('/orders')
      .send({ customerId, transportTypeId, items: [{ itemId, quantity: 1 }] })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/orders/${newOrderRes.body.id}/status`)
      .send({ status: 'ENTREGUE' })
      .expect(422);
  });

  it('filters orders by status', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders?status=CRIADA')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((o: { status: string }) => expect(o.status).toBe('CRIADA'));
  });
});
