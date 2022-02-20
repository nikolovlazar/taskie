import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  VStack,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { supabase } from '~supabase';

const Register = () => {
  const router = useRouter();
  const [cookie, setCookie] = useCookies(['supabase.session']);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [registering, setRegistering] = useState(false);

  const register = async () => {
    setRegistering(true);

    const { user, session } = await supabase.auth.signUp({
      email,
      password,
    });

    if (user && session) {
      await supabase.auth.setSession(session.refresh_token ?? '');
      await supabase.auth.setAuth(session.access_token);
      setRegistering(false);
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
      <VStack spacing={6} bg="white" p={10} rounded="md" shadow="md">
        <Heading size="md">Register</Heading>
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
            onKeyDown={(e) => e.key === 'Enter' && register()}
          />
        </FormControl>
        <Button w="full" onClick={register} isLoading={registering}>
          Continue
        </Button>
        <NextLink href="/login" passHref>
          <Link>Back to login</Link>
        </NextLink>
      </VStack>
    </Flex>
  );
};

export default Register;
