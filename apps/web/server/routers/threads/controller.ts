import {
  findThreadType,
  getThreadType,
  ChatType,
  updateThreadType,
  createThreadType,
} from '@linen/types';
import { Forbidden, NotFound, NotImplemented } from 'server/exceptions';
import { Roles } from 'server/middlewares/tenant';
import {
  AuthedRequestWithTenantAndBody,
  NextFunction,
  Response,
} from 'server/types';
import ThreadsServices from 'services/threads';

export class ThreadsController {
  static async get(
    req: AuthedRequestWithTenantAndBody<getThreadType>,
    res: Response,
    next: NextFunction
  ) {
    const thread = await ThreadsServices.get({
      ...req.body,
      accountId: req.tenant?.id!,
    });
    if (!thread) {
      return next(new NotFound());
    }
    res.json(thread);
  }
  static async find(
    req: AuthedRequestWithTenantAndBody<findThreadType>,
    res: Response,
    _: NextFunction
  ) {
    const threads = await ThreadsServices.find({
      ...req.body,
      accountId: req.tenant?.id!,
    });
    res.json(threads);
  }
  static async put(
    req: AuthedRequestWithTenantAndBody<updateThreadType>,
    res: Response,
    next: NextFunction
  ) {
    // if pinned, must be admin/owner
    if (typeof req.body.pinned === 'boolean') {
      if (
        req.tenant_user?.role !== Roles.OWNER &&
        req.tenant_user?.role !== Roles.ADMIN
      ) {
        return next(new Forbidden('User not allow to pin messages'));
      }
    }

    // if member, must be the creator
    if (req.tenant_user?.role === Roles.MEMBER) {
      const thread = await ThreadsServices.get({
        id: req.body.id,
        accountId: req.tenant?.id!,
      });
      if (req.tenant_user.id !== thread?.messages?.shift()?.author?.id) {
        return next(new Forbidden('User not allow to update this message'));
      }
    }

    const thread = await ThreadsServices.update({
      ...req.body,
      accountId: req.tenant?.id!,
    });
    res.json(thread);
  }
  static async post(
    req: AuthedRequestWithTenantAndBody<createThreadType>,
    res: Response,
    next: NextFunction
  ) {
    if (req.tenant?.chat === ChatType.NONE) {
      return next(new Forbidden('Community has chat disabled'));
    }

    if (req.tenant?.chat === ChatType.MANAGERS) {
      if (
        req.tenant_user?.role !== Roles.OWNER &&
        req.tenant_user?.role !== Roles.ADMIN
      ) {
        return next(new Forbidden('User is not allow to chat'));
      }
    }

    const thread = await ThreadsServices.create({
      ...req.body,
      authorId: req.tenant_user?.id!,
    });
    res.json({ thread, imitationId: req.body.imitationId });
  }

  static async notImplemented(_: any, _2: any, next: NextFunction) {
    next(new NotImplemented());
  }
}
