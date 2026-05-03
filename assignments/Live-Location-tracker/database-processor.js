import { kafkaClient } from './kafka-client.js';

async function init() {
  const kafkaConsumer = kafkaClient.consumer({
    groupId: `database-processor`,
  });
  await kafkaConsumer.connect();

  await kafkaConsumer.subscribe({
    topics: ['location-updates'],
    fromBeginning: true,
  });

  kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      const data = JSON.parse(message.value.toString());
      
      // DB Write Strategy Explanation:
      // We consume events here instead of writing to the DB directly from the socket server.
      // High-frequency socket events (like live location) would overwhelm the database 
      // if every socket emission triggered an immediate INSERT/UPDATE.
      // By using Kafka as a buffer, this processor can read at its own pace, 
      // optionally batch the updates, or write to a time-series optimized storage
      // without blocking the main socket server that serves live users.
      
      console.log(`[DB] Persisting location for user ${data.id}:`, { lat: data.latitude, lng: data.longitude });
      await heartbeat();
    },
  });
}

init();
