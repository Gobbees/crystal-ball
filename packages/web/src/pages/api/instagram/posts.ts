import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { Source } from '@crystal-ball/common';
import {
  SocialProfile,
  Post,
  Session as NextSession,
} from '@crystal-ball/database';
import authenticatedRoute from '../../../app/utils/apiRoutes';
import { InstagramPost as ClientInstagramPost } from '../../../types';

/**
 * @returns an array of InstagramPost ordered by published date
 */
const posts = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const { profileId } = req.query;
  if (!profileId) {
    return res.status(400).end();
  }

  const instagramProfile = await SocialProfile.findOne({
    where: { source: Source.Instagram, owner: userId },
  });
  if (!instagramProfile) {
    return res.status(404).end();
  }

  const dbPosts = await Post.find({
    where: { parentProfile: instagramProfile.id },
    order: { publishedDate: 'DESC' },
  });

  const instagramPosts: ClientInstagramPost[] = [];
  dbPosts.forEach((post) =>
    instagramPosts.push({
      id: post.id,
      message: post.message,
      publishedDate: post.publishedDate,
      postSentiment: post.sentiment,
      commentsSentiment: post.commentsOverallSentiment,
      likesCount: post.likeCount,
      commentsCount: post.commentCount,
    }),
  );
  return res.status(200).json(JSON.stringify(instagramPosts));
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, posts);