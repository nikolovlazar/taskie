import { WorkSession } from '~types';

const useWorkSessions = () => {
  const getSessions = async () => {
    const res = await fetch('/api/work-sessions', {
      method: 'GET',
    });

    if (res.status !== 200) {
      return null;
    }

    return await res.json();
  };

  const createSession = async (session: Partial<WorkSession>) => {
    const res = await fetch('/api/work-sessions', {
      method: 'PUT',
      body: JSON.stringify({ ...session }),
    });

    if (res.status !== 200) {
      return null;
    }

    return await res.json();
  };
  const updateSession = async (session: Partial<WorkSession>) => {
    const res = await fetch(`/api/work-sessions/${session.id}`, {
      method: 'POST',
      body: JSON.stringify({ ...session }),
    });

    if (res.status !== 200) {
      return null;
    }

    return await res.json();
  };
  const deleteSession = async (sessionId: string) => {
    const res = await fetch(`/api/work-sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (res.status !== 200) {
      return null;
    }

    return (await res.json()) as WorkSession;
  };

  return {
    getSessions,
    createSession,
    updateSession,
    deleteSession,
  };
};

export default useWorkSessions;
