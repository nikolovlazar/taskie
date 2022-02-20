import type { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import {
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import { FiPlus } from 'react-icons/fi';

import { supabase } from '~supabase';
import { WorkSession } from '~types';
import WorkSessionModal from '~components/work-session-modal';
import { getUser } from '~utils/users';
import WorkSessionItem from '~components/work-session-item';
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
        <HStack w="full" justifyContent="space-between">
          <Heading>Work sessions:</Heading>
          <Tooltip label="Create new work session">
            <IconButton
              aria-label="Create new work session"
              icon={<FiPlus />}
              onClick={onOpen}
            />
          </Tooltip>
        </HStack>
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
                  onUpdate={(updatedSession) => {
                    const sessionIndex = sessions.findIndex(
                      (s) => s.id === updatedSession.id
                    );

                    const updatedSessions = [...sessions];
                    updatedSessions[sessionIndex] = updatedSession;

                    setSessions(updatedSessions);
                  }}
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
