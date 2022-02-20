import { NextApiHandler } from 'next';

import { supabase } from '~supabase';
import { getUser } from '~utils/users';

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const user = await getUser(req);

  if (!user) {
    res.status(401).send('Not authorized');
    return;
  }

  if (method === 'GET') {
    const { data, error } = await supabase.from('work_sessions').select();

    if (error || !data || data.length === 0) {
      res.status(500);
      return;
    }

    res.status(200).json(data);
  } else if (method === 'PUT') {
    // Create work session
    const workSession = JSON.parse(req.body);

    const { data, error } = await supabase
      .from('work_sessions')
      .insert({ ...workSession, user_id: user.id });

    if (error || !data || data.length === 0) {
      res.status(500);
      return;
    }

    res.status(200).json(data[0]);
  } else {
    res.status(405).send('Method not allowed');
  }
};

export default handler;
