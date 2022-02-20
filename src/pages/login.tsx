import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Link,
  Heading,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

import { supabase } from '~supabase';

const Login = () => {
  const router = useRouter();
  const [cookie, setCookie] = useCookies(['supabase.session']);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loggingIn, setLoggingIn] = useState(false);

  const logIn = async () => {
    setLoggingIn(true);

    const { user, session } = await supabase.auth.signIn({
      email,
      password,
    });

    if (user && session) {
      await supabase.auth.setSession(session.refresh_token ?? '');
      await supabase.auth.setAuth(session.access_token);
      setLoggingIn(false);
      setCookie('supabase.session', JSON.stringify(session));
      router.push('/');
    } else {
      alert('Error!');
    }
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      w="100vw"
      h="100vh"
    >
      <VStack spacing={6} bg="white" p={10} rounded="md" shadow="md" minW="lg">
        <Heading size="md">Login</Heading>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            autoFocus
            placeholder="john@doe.com"
            type="email"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && logIn()}
          />
        </FormControl>
        <Button w="full" onClick={logIn} isLoading={loggingIn}>
          Continue
        </Button>
        <NextLink href="/register" passHref>
          <Link>Register</Link>
        </NextLink>
      </VStack>
    </Flex>
  );
};

export default Login;
