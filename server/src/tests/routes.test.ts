import { validateOperationIds, defaultResponse } from '@/lib/validate-routes';
import { describe, it, expect } from 'vitest';
import { Method } from '@/lib/validate-routes';

describe('API Routes', () => {
  it('should have valid operation IDs', () => {
    const routes = [
      {
        method: 'get' as Method,
        path: '/tasks',
        responses: defaultResponse,
      },
      {
        method: 'post' as Method,
        path: '/projects/{projectId}/tasks',
        responses: defaultResponse,
      },
      {
        method: 'get' as Method,
        path: '/projects/{projectId}/tasks/{taskId}',
        responses: defaultResponse,
      },
    ];

    const issues = validateOperationIds(routes, {
      namingConvention: {
        maxLength: 50,
        forceCamelCase: true,
      },
      customValidators: [
        {
          name: 'HTTPMethodPrefix',
          validate: id =>
            ['get', 'create', 'update', 'delete', 'list'].some(prefix =>
              id.toLowerCase().startsWith(prefix)
            ),
          message: 'Operation ID should start with HTTP method semantic prefix',
        },
      ],
    });

    if (issues.length > 0) {
      console.log('\nOperation ID Validation Issues:');
      issues.forEach(issue => {
        console.log(
          `[${issue.type.toUpperCase()}] ${issue.path} (${issue.operationId}): ${issue.message}`
        );
      });
    }

    expect(issues.filter(i => i.type === 'error')).toHaveLength(0);
  });
});
