import { defineConfig } from 'eslint/config';
import nextConfig from '@musetrip360/eslint-config/eslint-config-nextjs';

export default defineConfig([
  nextConfig,
  {
    ignores: ['dist/*'],
  },
]);
