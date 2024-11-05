import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { KafkaService } from '@/kafka/kafka.service';

describe('Inventory E2E Test', () => {
  let app: INestApplication;
  let kafkaService: KafkaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    kafkaService = moduleFixture.get<KafkaService>(KafkaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update inventory and trigger notification when below threshold', async () => {
    const response = await request(app.getHttpServer())
      .patch('/inventory/decrease')
      .send({
        productId: '5666dda1-a424-4a23-93ed-22ee993d5590', // valid product ID
        regionId: 'f1110fbe-f527-4a82-b506-9abf53010896', // valid region ID 
        amount: 50,
      })
      .expect(200);

    expect(response.body.status).toBe('Inventory decreased successfully');

    // Simulate Kafka consumer log verification
    const kafkaLog = await kafkaService.sendMessage('inventory-alerts', {
      productId: 'valid-product-uuid',
      message: 'Stock level is below the threshold',
    });

    expect(kafkaLog).toBeTruthy();
  });

  it('should trigger webhook and receive alert', async () => {
    const webhookResponse = await request(app.getHttpServer())
      .post('/webhook/receive-alert')
      .send({
        productId: 'valid-product-uuid',
        regionId: 'valid-region-uuid',
        currentStock: 10,
        threshold: 20,
        message: 'Stock level is below the threshold',
      })
      .expect(200);

    expect(webhookResponse.body.status).toBe('Alert received successfully');
  });
});
