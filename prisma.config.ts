import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

// Ito ang pipilit sa system na basahin agad ang .env file mo!
config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});