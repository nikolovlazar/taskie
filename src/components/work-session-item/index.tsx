import {
  Button,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';

import WorkSessionModal from '~components/work-session-modal';
import useWorkSessions from '~hooks/work-sessions';
import { WorkSession } from '~types';

type Props = {
  session: WorkSession;
  onDelete: () => void;
};

const WorkSessionItem = ({ session, onDelete }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const { deleteSession } = useWorkSessions();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsDeleting(true);
    const res = await deleteSession(session.id);
    setIsDeleting(false);

    if (res) {
      toast({
        status: 'success',
        title: 'Success',
        description: `${session.name} delete successfully!`,
        isClosable: true,
        position: 'bottom-right',
      });
      onDeleteClose();
      onDelete();
      return;
    }

    toast({
      status: 'error',
      title: 'Error!',
      description: `Could not delete ${session.name}.`,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  return (
    <>
      <HStack
        py={2}
        px={4}
        justifyContent="space-between"
        w="full"
        bg="gray.50"
        rounded="md"
      >
        <Text>{session.name}</Text>
        <HStack>
          <IconButton
            aria-label={`Edit ${session.name}`}
            icon={<FiEdit3 />}
            onClick={(e) => {
              e.preventDefault();
              onOpen();
            }}
          />
          <Popover isOpen={isDeleteOpen} onClose={onDeleteClose}>
            <PopoverTrigger>
              <IconButton
                aria-label={`Delete ${session.name}`}
                icon={<Icon as={RiDeleteBinLine} color="red.500" />}
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteOpen();
                }}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Confirmation</PopoverHeader>
              <PopoverBody>
                Are you sure you want to delete {session.name}?
              </PopoverBody>
              <PopoverFooter>
                <HStack justifyContent="flex-end">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="solid"
                    colorScheme="red"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                  >
                    Delete
                  </Button>
                </HStack>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </HStack>
      </HStack>

      {isOpen && (
        <WorkSessionModal
          workSession={session}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default WorkSessionItem;
