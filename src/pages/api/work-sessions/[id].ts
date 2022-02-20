import { NextApiHandler } from 'next';

import { supabase } from '~supabase';
import { WorkSession } from '~types';
import { getUser } from '~utils/users';

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const user = await getUser(req);

  if (!user) {
    res.status(401).send('Not authorized');
    return;
  }

  if (method === 'POST') {
    // Update
    const session = JSON.parse(req.body) as WorkSession;
    const { data, error } = await supabase
      .from('work_sessions')
      .update(session)
      .match({ id: session.id });

    if (error || !data || data.length === 0) {
      res.status(500);
      return;
    }

    res.status(200).json(data[0]);
  } else if (method === 'DELETE') {
    // Delete
    const { data, error } = await supabase
      .from('work_sessions')
      .delete()
      .match({ id: req.query['id'] });

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
