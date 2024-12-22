import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { sql } from 'drizzle-orm';

import type { AppRouteHandler } from '@/lib/types';

import db from '@/db';
import { tasks } from '@/db/schema';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './tasks.routes';

export const list: AppRouteHandler<ListRoute> = async c => {
  const page = Number(c.req.query('page') ?? 1);
  const pageSize = Number(c.req.query('pageSize') ?? 10);

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const [tasksList, total] = await Promise.all([
    db.query.tasks.findMany({
      limit,
      offset,
    }),
    db
      .select({ count: tasks.id })
      .from(tasks)
      .then(result => result.length),
  ]);

  // Convert Date objects to strings for API response
  const formattedTasks = tasksList.map(task => ({
    ...task,
    createdAt: task.createdAt?.toISOString() ?? null,
    updatedAt: task.updatedAt?.toISOString() ?? null,
  }));

  return c.json({
    data: formattedTasks,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
};

export const create: AppRouteHandler<CreateRoute> = async c => {
  const task = c.req.valid('json');
  const [inserted] = await db.insert(tasks).values(task).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async c => {
  const { id } = c.req.valid('param');
  const task = await db.query.tasks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async c => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: 'ZodError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const [task] = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async c => {
  const { id } = c.req.valid('param');
  const result = await db.delete(tasks).where(eq(tasks.id, id));

  if (result.rowsAffected === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
