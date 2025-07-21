import tseslint from 'typescript-eslint';
import viteConfig from '@musetrip360/eslint-config/eslint-config-vite';

export default tseslint.config([
  viteConfig,
  {
    ignores: ['dist/*', '/src'],
  },
]);
