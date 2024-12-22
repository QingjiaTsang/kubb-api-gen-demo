import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { QueryKey } from '@kubb/plugin-react-query/components';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';
import { pluginFaker } from '@kubb/plugin-faker';
import { pluginMsw } from '@kubb/plugin-msw';

/** @type {import('@kubb/core').UserConfig} */
export const config = {
  root: '.',
  input: {
    path: './openapi.json',
  },
  output: {
    path: './src/gen',
    clean: true,
  },
  hooks: {
    done: ['bun typecheck'],
  },
  plugins: [
    pluginOas({ generators: [] }),
    pluginTs({
      output: {
        path: 'models',
      },
    }),
    pluginZod({
      output: {
        path: './zod',
      },
      // Note: this group option would cause the import path problems for now in the react-query hooks files
      // waiting for the fix by the kubb team
      // group: { type: 'tag', name: ({ group }) => `${group}Schemas` },
      dateType: 'date',
      unknownType: 'unknown',
      inferred: true,
    }),
    pluginReactQuery({
      client: {
        baseURL: '/api',
        // custom axios client for interceptors
        importPath: '@/lib/customAxiosClient',
      },
      transformers: {
        name: (name, type) => {
          if (type === 'file' || type === 'function') {
            return `${name}Hook`;
          }
          return name;
        },
      },
      output: {
        path: './hooks/api',
      },
      group: {
        type: 'path',
      },
      queryKey(props) {
        const keys = QueryKey.getTransformer(props);
        return ['"v5"', ...keys];
      },
      paramsType: 'inline',
      pathParamsType: 'object',
      suspense: {},
      override: [
        {
          type: 'operationId',
          pattern: 'listTasks',
          options: {
            infinite: {
              queryParam: 'page',
              initialPageParam: 1,
              cursorParam: undefined,
            },
          },
        },
      ],
      parser: 'zod',
    }),

    pluginFaker({
      output: {
        path: './mocks',
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Mocks`,
      },
    }),

    pluginMsw({
      output: {
        path: './mocks/msw',
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Handlers`,
      },
      parser: 'faker',
    }),
  ],
};

export default defineConfig(config);
