import type { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import {
  Button,
  Container,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { supabase } from '~supabase';
import { WorkSession } from '~types';
import WorkSessionModal from '~components/work-session-modal';
import { getUser } from '~utils/users';
import WorkSessionItem from '~components/work-session-item';
import { ReactElement, useState } from 'react';
import useWorkSessions from '~hooks/work-sessions';
import Layout from '~components/layout';

type Props = {
  workSessions: WorkSession[] | null;
};

const Home = ({ workSessions }: Props) => {
  const [sessions, setSessions] = useState(workSessions ?? []);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container py={10} w="full" maxW="container.lg">
      <VStack spacing={6} alignItems="flex-start">
        <Heading>Work sessions:</Heading>
        {sessions?.map((session) => (
          <NextLink key={session.id} passHref href={`sessions/${session.id}`}>
            <LinkBox
              w="full"
              rounded="md"
              transition="box-shadow 0.25s ease-out"
              _hover={{ shadow: 'md' }}
            >
              <LinkOverlay href={`sessions/${session.id}`}>
                <WorkSessionItem
                  session={session}
                  onDelete={() =>
                    setSessions((oldSessions) =>
                      oldSessions.filter((s) => s.id !== session.id)
                    )
                  }
                />
              </LinkOverlay>
            </LinkBox>
          </NextLink>
        ))}
        <Button onClick={onOpen}>Create new work session</Button>

        {isOpen && (
          <WorkSessionModal
            isOpen={isOpen}
            onClose={onClose}
            onCreate={(newSession) =>
              setSessions((oldSessions) => [...oldSessions, newSession])
            }
          />
        )}
      </VStack>
    </Container>
  );
};

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = await getUser(ctx.req);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { data } = await supabase.from<WorkSession>('work_sessions').select();

  return {
    props: {
      workSessions: data,
    },
  };
};

export default Home;