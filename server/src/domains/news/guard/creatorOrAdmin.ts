import { getUniqueId } from '@/helpers';
import { Guard } from '@/base/guard';
import { NEWS_SERVICE, type INewsService } from '../service';
import { Role } from '@/domains/auth';

import type { IContainer } from '@/container';
import type { Request } from 'express';

export const CREATOR_OR_ADMIN_GUARD = getUniqueId();

export class CreatorOrAdminGuard extends Guard {
  private readonly newsService: INewsService;

  public constructor(container: IContainer) {
    super();
    this.newsService = container[NEWS_SERVICE] as INewsService;
  }

  protected async check(request: Request): Promise<boolean> {
    const user = request.user!;
    const newSlug = request.path.split('/').at(-1) as string;

    const newData = await this.newsService.getNewBySlugAndCheckExisting(newSlug);

    if (newData.creatorId !== user.id && user.role !== Role.ADMIN) {
      return false;
    }

    return true;
  }
}
