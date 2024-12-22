import { createRoute as honoCreateRoute } from '@hono/zod-openapi';
import type { RouteConfig } from '@hono/zod-openapi';

import { Method } from './validate-routes';

export function generateOperationId(method: Method, path: string): string {
  const cleanPath = path.replace(/^\//, '');
  const segments = cleanPath.split('/');

  // Handle batch operations
  if (path.includes('/batch/')) {
    const action = segments[segments.length - 1];
    const resource = segments[0];
    return `batch${action.charAt(0).toUpperCase()}${action.slice(1)}${resource.slice(0, -1).charAt(0).toUpperCase()}${resource.slice(0, -1).slice(1)}s`;
  }

  // Handle import and export
  if (segments.includes('import') || segments.includes('export')) {
    const action = segments.includes('import') ? 'import' : 'export';
    const resource = segments[0];
    const format = segments[segments.length - 1];
    if (format !== 'import' && format !== 'export') {
      return `${action}${resource.slice(0, -1).charAt(0).toUpperCase()}${resource.slice(0, -1).slice(1)}sFrom${format.toUpperCase()}`;
    }
    return `${action}${resource.slice(0, -1).charAt(0).toUpperCase()}${resource.slice(0, -1).slice(1)}s`;
  }

  // Handle special queries
  if (segments.includes('search')) {
    const resource = segments[0];
    return `search${resource.slice(0, -1).charAt(0).toUpperCase()}${resource.slice(0, -1).slice(1)}s`;
  }
  if (segments.includes('recent')) {
    const resource = segments[0];
    return `getRecent${resource.slice(0, -1).charAt(0).toUpperCase()}${resource.slice(0, -1).slice(1)}s`;
  }
  if (segments.includes('trending')) {
    const resource = segments[0];
    return `getTrending${resource.slice(0, -1).charAt(0).toUpperCase()}${resource.slice(0, -1).slice(1)}s`;
  }

  // Handle statistics and reports
  if (segments[0] === 'analytics') {
    const metric = segments[segments.length - 1];
    return `get${metric.charAt(0).toUpperCase()}${metric.slice(1)}Analytics`;
  }
  if (segments[0] === 'reports') {
    const reportType = segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    return `get${reportType}Report`;
  }
  if (segments[0] === 'stats') {
    const metric = segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    return `get${metric}Stats`;
  }

  // Handle state transition/actions
  if (method === 'post' && segments.length > 2 && !segments[segments.length - 1].includes('{')) {
    const action = segments[segments.length - 1];
    const resource = segments[0];
    return `${action}${resource.slice(0, -1).charAt(0).toUpperCase()}${resource.slice(0, -1).slice(1)}`;
  }

  // Handle basic CRUD operations
  const methodMap: Record<Method, string> = {
    get: path.includes('{') ? 'get' : 'list',
    post: 'create',
    put: 'update',
    patch: 'update',
    delete: 'delete',
    head: 'head',
    options: 'options',
    trace: 'trace',
  };

  let operationId = methodMap[method];

  // Handle nested resources
  const resourceSegments = segments.filter(s => !s.includes('{'));
  if (resourceSegments.length > 1) {
    const parentResource = resourceSegments[0];
    const childResource = resourceSegments[resourceSegments.length - 1];

    const singularParent = parentResource.endsWith('s')
      ? parentResource.slice(0, -1)
      : parentResource;

    const singularChild = childResource.endsWith('s') ? childResource.slice(0, -1) : childResource;

    operationId += `${singularParent.charAt(0).toUpperCase()}${singularParent.slice(1)}`;
    operationId += `${singularChild.charAt(0).toUpperCase()}${singularChild.slice(1)}`;
  } else {
    // Handle single resource
    const resource = resourceSegments[resourceSegments.length - 1];
    const singularResource = resource.endsWith('s') ? resource.slice(0, -1) : resource;
    operationId += `${singularResource.charAt(0).toUpperCase()}${singularResource.slice(1)}`;
  }

  // Add plural form for list operations
  if (operationId.startsWith('list')) {
    operationId += 's';
  }

  // Add ById suffix
  if (segments[segments.length - 1].includes('{')) {
    operationId += 'ById';
  }

  return operationId;
}

export function createRoute<T extends RouteConfig>(config: T): T {
  // Allow developers to specify operationId directly
  if (config.operationId) {
    return honoCreateRoute(config);
  }

  // Otherwise, try to generate it
  const operationId = generateOperationId(config.method, config.path);

  return honoCreateRoute({
    ...config,
    operationId,
  });
}
