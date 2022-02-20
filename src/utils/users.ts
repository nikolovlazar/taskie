import { IncomingMessage } from 'http';
import { GetServerSidePropsContext, PreviewData } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { supabase } from '~supabase';
import parseCookies from './cookies';

export const getUser = async (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
) => {
  const sessionCookie = parseCookies('supabase.session', req);

  if (!sessionCookie) {
    return null;
  }

  const session = JSON.parse(sessionCookie);
  await supabase.auth.setAuth(session.access_token);

  const { user } = await supabase.auth.api.getUser(session.access_token);

  return user;
};
