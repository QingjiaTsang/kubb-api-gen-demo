import type { AppOpenAPI } from '@/lib/types';
import type { Method } from '@/lib/validate-routes';
import app from '@/app';
import { generateOperationIdPreview } from '@/lib/validate-routes';

const extractRoutesFromHono = (
  app: AppOpenAPI
): Array<{ method: Method; path: string; tags: string[] }> => {
  const routes: Array<{ method: Method; path: string; tags: string[] }> = [];

  const honoRoutes = app.routes;

  honoRoutes.forEach(route => {
    const method = route.method.toLowerCase() as Method;
    const path = route.path;

    // Since we can't get tags from app instance, we need to infer them from the path for better readability when printing
    const tags = inferTagsFromPath(path);

    routes.push({ method, path, tags });
  });

  return routes;
};

const inferTagsFromPath = (path: string): string[] => {
  const tags: string[] = [];
  const segments = path.split('/').filter(Boolean);

  if (segments.length > 0) {
    // Use the first segment of the path as the main tag
    const mainTag = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    tags.push(mainTag);

    // Add additional tags based on path characteristics
    if (path.includes('batch')) {
      tags.push('Batch Operations');
    }
    if (path.includes('search') || path.includes('filter')) {
      tags.push('Search & Filter');
    }
  }

  return tags;
};

const routes = extractRoutesFromHono(app);
generateOperationIdPreview(routes);
