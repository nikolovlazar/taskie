import { PropsWithChildren } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { supabase } from '~supabase';

type Props = PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const toast = useToast();

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        status: 'error',
        title: 'Error!',
        description: 'Could not log out. Please try again.',
        isClosable: true,
        position: 'bottom-right',
      });

      return;
    }

    router.replace('/login');
  };

  return (
    <>
      <Box bg="gray.100" py={4} w="full">
        <Container centerContent w="full" maxW="container.lg">
          <HStack w="full" justifyContent="space-between">
            <Heading>Taskie ❤️</Heading>
            <Button onClick={logOut}>Log out</Button>
          </HStack>
        </Container>
      </Box>
      {children}
    </>
  );
};

export default Layout;
