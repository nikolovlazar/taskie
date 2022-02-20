import {
  type ModalProps,
  Modal,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

import useWorkSessions from '~hooks/work-sessions';
import { WorkSession } from '~types';

type Props = Omit<ModalProps, 'children'> & {
  workSession?: WorkSession;
  onCreate?: (newSession: WorkSession) => void;
  onUpdate?: (newSession: WorkSession) => void;
};

const WorkSessionModal = (props: Props) => {
  const { workSession, onCreate, onUpdate, ...modalProps } = props;

  const toast = useToast();
  const { createSession, updateSession } = useWorkSessions();

  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState<string | undefined>(workSession?.name);

  const create = async () => {
    setSubmitting(true);
    const newSession = await createSession({ name });
    setSubmitting(false);

    if (newSession) {
      toast({
        status: 'success',
        title: 'Success!',
        description: `${name} created successfully!`,
        isClosable: true,
        position: 'bottom-right',
      });
      onCreate?.(newSession);
      props.onClose();
    } else {
      toast({
        status: 'error',
        title: 'Error!',
        description: `Could not create ${name}.`,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  const update = async () => {
    setSubmitting(true);
    const updatedSession = await updateSession({ ...workSession, name });
    setSubmitting(false);

    if (updatedSession) {
      toast({
        status: 'success',
        title: 'Success!',
        description: `${name} updated successfully!`,
        isClosable: true,
        position: 'bottom-right',
      });
      onUpdate?.(updatedSession);
      props.onClose();
    } else {
      toast({
        status: 'error',
        title: 'Error!',
        description: `Could not update ${name}.`,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <VStack py={4} spacing={6} alignItems="flex-start">
            {!workSession ? (
              <Heading size="md">Create new work session</Heading>
            ) : (
              <Heading size="md">Update work session</Heading>
            )}
            <FormControl>
              <FormLabel>Name:</FormLabel>
              <Input
                defaultValue={workSession?.name}
                onChange={(e) => setName(e.currentTarget.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (workSession ? update() : create())
                }
              />
            </FormControl>
            <Button
              onClick={workSession ? update : create}
              isLoading={submitting}
            >
              {workSession ? 'Update' : 'Create'}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkSessionModal;
