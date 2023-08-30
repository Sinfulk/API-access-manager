/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// https://vitejs.dev/config/
dotenv.config();
export default defineConfig({
  plugins: [react()],
  server: {
    // указать свой локальный host
    host: '192.168.1.20',
    // приложение запускаеься на 5173 порту
    port: 5173,
    https: {
      // указать путь к самописным сертификатам если запускаете локально
      key: fs.readFileSync('../../../ssl/key.pem'),
      cert: fs.readFileSync('../../../ssl/cert.pem'),
    },
  },
});
