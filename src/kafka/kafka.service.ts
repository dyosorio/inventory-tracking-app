import { Injectable, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, Partitioners, KafkaJSConnectionError } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const brokersEnv = this.configService.get<string>('KAFKA_BROKERS');
    if (!brokersEnv) {
      throw new Error('KAFKA_BROKERS environment variable is not set');
    }

    const brokers = brokersEnv.split(',').map(broker => broker.trim());

    this.kafka = new Kafka({
      clientId: 'inventory-service',
      brokers,
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });

    this.consumer = this.kafka.consumer({ groupId: 'inventory-consumer-group' });

    try {
      await this.producer.connect();

      await this.consumer.connect();

      await this.consumer.subscribe({ topic: 'inventory-decrease', fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          this.logger.log(`Received message: ${message.value?.toString()}`);
        },
      });
    } catch (error) {
      if (error instanceof KafkaJSConnectionError) {
        this.logger.error('Kafka connection error:', error);
      } else {
        this.logger.error('Failed to connect Kafka producer/consumer', error);
      }
      throw new Error('Kafka producer/consumer connection failed');
    }
  }

  async sendMessage(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      this.logger.log(`Message sent to topic "${topic}": ${JSON.stringify(message)}`);
    } catch (error) {
      this.logger.error('Error sending Kafka message:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      this.logger.log('Kafka producer and consumer disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka producer/consumer:', error);
    }
  }
}
