import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { Source } from '@crystal-ball/common';
import {
  SocialProfile,
  Session as NextSession,
  User,
} from '@crystal-ball/database';
import { SocialProfile as ClientFBPage } from '../../../types';
import authenticatedRoute from '../../../app/utils/apiRoutes';

const createPage = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const page: ClientFBPage = { ...req.body.page };

  try {
    const facebookPage = await SocialProfile.findOne({
      where: { externalId: page.id },
    });
    if (facebookPage) {
      await User.update(userId, { facebookPageId: facebookPage.id });
    } else {
      const createdPage = await SocialProfile.insert({
        externalId: page.id,
        source: Source.Facebook,
        name: page.name,
        picture: page.picture,
        owner: { id: userId },
      });
      const createdPageId = createdPage.identifiers[0].id;
      await User.update(userId, { facebookPageId: createdPageId });
    }
    return res.status(200).end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const deletePage = async (res: NextApiResponse, session: Session) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  try {
    await User.update(userId, { facebookPageId: undefined });
    return res.status(200).end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const pages = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  if (req.method === 'POST') {
    return createPage(req, res, session);
  }
  if (req.method === 'DELETE') {
    return deletePage(res, session);
  }
  return res.status(404).end();
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, pages);
