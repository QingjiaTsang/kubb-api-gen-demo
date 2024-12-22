import { RouteConfig } from '@hono/zod-openapi';
import { z } from 'zod';

import { generateOperationId } from './create-route';

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'trace';

interface ValidationIssue {
  path: string;
  method: string;
  operationId: string;
  type: 'error' | 'warning';
  message: string;
}

interface ValidationOptions {
  /** Whether to allow duplicate operationIds */
  allowDuplicates?: boolean;
  /** Custom naming rule checks */
  customValidators?: Array<{
    name: string;
    validate: (operationId: string) => boolean;
    message: string;
  }>;
  /** Naming convention */
  namingConvention?: {
    /** Prefix requirement, such as 'api' */
    prefix?: string;
    /** Whether to enforce camelCase naming */
    forceCamelCase?: boolean;
    /** Maximum length */
    maxLength?: number;
  };
}

// Export default response object
export const defaultResponse = {
  200: {
    description: 'Successful response',
    content: {
      'application/json': {
        schema: z.any(),
      },
    },
  },
} as const;

export function validateOperationIds(
  routes: RouteConfig[],
  options: ValidationOptions = {}
): ValidationIssue[] {
  const { allowDuplicates = false, customValidators = [], namingConvention = {} } = options;

  const issues: ValidationIssue[] = [];
  const operationIds = new Map<string, string>();

  routes.forEach(route => {
    const operationId = route.operationId || generateOperationId(route.method, route.path);

    // 1. Check for duplicates
    if (!allowDuplicates && operationIds.has(operationId)) {
      issues.push({
        path: route.path,
        method: route.method,
        operationId,
        type: 'error',
        message: `Duplicate operationId. Also used in: ${operationIds.get(operationId)}`,
      });
    }
    operationIds.set(operationId, route.path);

    // 2. Basic format check
    if (!/^[a-z][a-zA-Z0-9]*$/.test(operationId)) {
      issues.push({
        path: route.path,
        method: route.method,
        operationId,
        type: 'error',
        message:
          'Invalid operationId format. Must start with lowercase letter and contain only letters and numbers',
      });
    }

    // 3. Naming convention check
    if (namingConvention.prefix && !operationId.startsWith(namingConvention.prefix)) {
      issues.push({
        path: route.path,
        method: route.method,
        operationId,
        type: 'warning',
        message: `OperationId should start with prefix: ${namingConvention.prefix}`,
      });
    }

    if (namingConvention.maxLength && operationId.length > namingConvention.maxLength) {
      issues.push({
        path: route.path,
        method: route.method,
        operationId,
        type: 'warning',
        message: `OperationId exceeds maximum length of ${namingConvention.maxLength}`,
      });
    }

    // 4. Run custom validators
    customValidators.forEach(validator => {
      if (!validator.validate(operationId)) {
        issues.push({
          path: route.path,
          method: route.method,
          operationId,
          type: 'warning',
          message: `${validator.name}: ${validator.message}`,
        });
      }
    });
  });

  return issues;
}

interface PreviewRoute {
  method: Method;
  path: string;
  tags: string[];
}

export function generateOperationIdPreview(routes: PreviewRoute[]) {
  console.log('\nAPI Operation ID Preview:\n');
  console.log('METHOD  PATH                                OPERATION ID                    TAGS');
  console.log(
    '──────  ──────────────────────────────────  ────────────────────────────  ─────────────────'
  );

  const routesByTag = new Map<string, PreviewRoute[]>();
  const processedPaths = new Set<string>(); // Used to track processed routes
  const issues: string[] = [];
  const operationIds = new Set<string>();

  // Group routes by tag
  routes.forEach(route => {
    route.tags.forEach(tag => {
      if (!routesByTag.has(tag)) {
        routesByTag.set(tag, []);
      }
      routesByTag.get(tag)!.push(route);
    });
  });

  // Print grouped by tag
  routesByTag.forEach((tagRoutes, tag) => {
    console.log(`\n[${tag}]`);

    tagRoutes.forEach(({ method, path, tags }) => {
      const operationId = generateOperationId(method, path);
      const routeKey = `${method} ${path}`;

      // Only check for duplicates on the first encounter of a route
      if (!processedPaths.has(routeKey)) {
        if (operationIds.has(operationId)) {
          issues.push(`⚠️  Duplicate operationId: ${operationId} for ${method} ${path}`);
        }
        operationIds.add(operationId);
        processedPaths.add(routeKey);
      }

      console.log(
        `${method.padEnd(6)} ${path.padEnd(35)} -> ${operationId.padEnd(30)} ${tags.join(', ')}`
      );
    });
  });

  if (issues.length > 0) {
    console.log('\n⚠️  Warnings:');
    issues.forEach(issue => console.log(issue));
  }
}
