import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // App generators
  plop.setGenerator('app', {
    description: 'Create a new MuseTrip360 app',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What type of app would you like to create?',
        choices: [
          { name: 'Next.js Web App (Portal, Dashboard)', value: 'app-nextjs' },
          { name: 'Expo React Native Mobile App', value: 'app-expo' },
          { name: 'Vite React Web App', value: 'app-vite' },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your app?',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'App name cannot include an extension';
          }
          if (input.includes(' ')) {
            return 'App name cannot include spaces';
          }
          if (input.length === 0) {
            return 'App name is required';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is the description of your app?',
        default: (answers: any) => `A ${answers.type.replace('app-', '')} application for MuseTrip360 platform`,
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'What features would you like to include?',
        choices: (answers: any) => {
          const baseChoices = [
            { name: 'Authentication', value: 'auth', checked: true },
            { name: 'Analytics', value: 'analytics', checked: true },
            { name: 'State Management', value: 'state', checked: true },
          ];

          const mobileChoices =
            answers.type === 'app-expo'
              ? [
                  { name: 'Offline Support', value: 'offline', checked: true },
                  { name: 'Camera/QR Scanner', value: 'camera' },
                  { name: 'Push Notifications', value: 'notifications' },
                ]
              : [];

          const webChoices =
            answers.type !== 'app-expo'
              ? [
                  { name: 'Virtual Tours (3D)', value: 'virtual-tours' },
                  { name: 'SEO Optimization', value: 'seo', checked: true },
                ]
              : [];

          return [...baseChoices, ...mobileChoices, ...webChoices];
        },
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'apps/{{ name }}',
        base: 'templates/{{ type }}',
        templateFiles: 'templates/{{ type }}/**/*',
        globOptions: {
          dot: true,
        },
      },
      // Fix the package.json name - different patterns for different templates
      {
        type: 'modify',
        path: 'apps/{{ name }}/package.json',
        pattern: /"name": "docs"/g,
        template: '"name": "@apps/{{ name }}"',
        skip: (data: any) => data.type !== 'app-nextjs',
      },
      {
        type: 'modify',
        path: 'apps/{{ name }}/package.json',
        pattern: /"name": "mobile"/g,
        template: '"name": "@apps/{{ name }}"',
        skip: (data: any) => data.type !== 'app-expo',
      },
      {
        type: 'modify',
        path: 'apps/{{ name }}/package.json',
        pattern: /"name": "app-vite"/g,
        template: '"name": "@apps/{{ name }}"',
        skip: (data: any) => data.type !== 'app-vite',
      },
      // Add description for templates that don't have it
      {
        type: 'modify',
        path: 'apps/{{ name }}/package.json',
        pattern: /"version": "0.1.0",/g,
        template: '"version": "0.1.0",\n  "description": "{{ description }}",',
        skip: (data: any) => data.type !== 'app-nextjs',
      },
      {
        type: 'modify',
        path: 'apps/{{ name }}/package.json',
        pattern: /"version": "1.0.0",/g,
        template: '"version": "1.0.0",\n  "description": "{{ description }}",',
        skip: (data: any) => data.type !== 'app-expo',
      },
      {
        type: 'modify',
        path: 'apps/{{ name }}/package.json',
        pattern: /"version": "0.0.0",/g,
        template: '"version": "0.0.0",\n  "description": "{{ description }}",',
        skip: (data: any) => data.type !== 'app-vite',
      },
    ],
  });

  // Package generators
  plop.setGenerator('package', {
    description: 'Create a new MuseTrip360 package',
    prompts: [
      {
        type: 'list',
        name: 'category',
        message: 'What category of package?',
        choices: [
          { name: 'Domain (Business logic)', value: 'domain' },
          { name: 'UI (Components)', value: 'ui' },
          { name: 'State (Management)', value: 'state' },
          { name: 'API (Data layer)', value: 'api' },
          { name: 'Virtual (3D/Tours)', value: 'virtual' },
          { name: 'Infrastructure (Utils)', value: 'infrastructure' },
          { name: 'Generic (Library)', value: 'lib' },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your package?',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'Package name cannot include an extension';
          }
          if (input.includes(' ')) {
            return 'Package name cannot include spaces';
          }
          if (input.length === 0) {
            return 'Package name is required';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is the description of your package?',
        default: (answers: any) => `A ${answers.category} package for MuseTrip360 platform`,
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'What features would you like to include?',
        choices: (answers: any) => {
          const baseChoices = [
            { name: 'TypeScript', value: 'typescript', checked: true },
            { name: 'Testing (Vitest)', value: 'testing', checked: true },
            { name: 'ESLint', value: 'eslint', checked: true },
          ];

          const categoryChoices: Record<string, Array<{ name: string; value: string; checked?: boolean }>> = {
            ui: [
              { name: 'React', value: 'react', checked: true },
              { name: 'Storybook', value: 'storybook', checked: true },
              { name: 'Tailwind CSS', value: 'tailwind' },
            ],
            state: [
              { name: 'Zustand', value: 'zustand', checked: true },
              { name: 'Persistence', value: 'persistence' },
            ],
            api: [
              { name: 'React Query', value: 'react-query', checked: true },
              { name: 'Axios', value: 'axios', checked: true },
            ],
            virtual: [
              { name: 'Three.js', value: 'threejs', checked: true },
              { name: 'React Three Fiber', value: 'r3f', checked: true },
            ],
          };

          return [...baseChoices, ...(categoryChoices[answers.category] || [])];
        },
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/{{ name }}',
        base: 'templates/package-lib',
        templateFiles: 'templates/package-lib/**/*',
        globOptions: {
          dot: true,
        },
      },
    ],
  });

  // Simple component generator
  plop.setGenerator('component', {
    description: 'Add a component to an existing package',
    prompts: [
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name:',
        validate: (input: string) => input.length > 0 || 'Package name is required',
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name:',
        validate: (input: string) => {
          if (input.length === 0) return 'Component name is required';
          if (!/^[A-Z]/.test(input)) return 'Component name must start with a capital letter';
          return true;
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: [
          { name: 'React Component', value: 'component' },
          { name: 'Hook', value: 'hook' },
          { name: 'Utility', value: 'util' },
        ],
      },
    ],
    actions: (data) => {
      const actions: any[] = [];

      if (data?.type === 'component') {
        actions.push({
          type: 'add',
          path: 'packages/{{ packageName }}/src/components/{{ componentName }}.tsx',
          template: `export interface {{ componentName }}Props {
  children?: React.ReactNode;
}

export const {{ componentName }} = ({ children }: {{ componentName }}Props) => {
  return <div>{children || '{{ componentName }}'}</div>;
};`,
        });
      }

      if (data?.type === 'hook') {
        actions.push({
          type: 'add',
          path: 'packages/{{ packageName }}/src/hooks/use{{ componentName }}.ts',
          template: `import { useState } from 'react';

export const use{{ componentName }} = () => {
  const [state, setState] = useState(null);
  
  return { state, setState };
};`,
        });
      }

      if (data?.type === 'util') {
        actions.push({
          type: 'add',
          path: 'packages/{{ packageName }}/src/utils/{{ camelCase componentName }}.ts',
          template: `export const {{ camelCase componentName }} = () => {
  return true;
};`,
        });
      }

      return actions;
    },
  });
}
