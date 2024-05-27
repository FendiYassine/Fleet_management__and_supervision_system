import React from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Flex,
  Skeleton,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { LuRefreshCw } from 'react-icons/lu';

export const DataList = (props) => {
  return (
    <Flex
      flexDirection='column'
      position='relative'
      boxShadow='card'
      borderRadius='md'
      overflowX='auto'
      overflowY='hidden'
      minH='10rem'
      bg='white'
      border='1px solid'
      borderColor='gray.100'
      {...props}
      _dark={{
        bg: 'gray.800',
        borderColor: 'gray.900',
        ...props._dark,
      }}
    />
  );
};

export const DataListRow = ({ withHover, ...props }) => {
  return (
    <Flex
      borderBottom='1px solid'
      borderBottomColor='gray.100'
      transition='0.2s'
      minH="48px"
      px={1.5}
      {...props}
      _last={{
        // Hide bottom border, if the row is at the bottom of the DataList
        mb: '-1px',
        ...props._last,
      }}
      _hover={{
        ...(withHover
          ? { bg: 'gray.50', _dark: { bg: 'whiteAlpha.100' } }
          : {}),
        ...props._hover,
      }}
      _dark={{
        borderBottomColor: 'gray.900',
        ...props._dark,
      }}
    />
  );
};

export const DataListCell = (props) => {
  const isFluid = props.w === undefined && props.width === undefined;

  return (
    <Flex
      flexDirection='column'
      minW={0}
      flex={isFluid ? 1 : undefined}
      py='2'
      px='1.5'
      align='flex-start'
      justifyContent='center'
      {...props}
    >
      {props.children}
    </Flex>
  );
};

export const DataListTextHeader = (props) => {
  return (
    <DataListText
      fontWeight='bold'
      fontSize='lg'
      color='text-dimmed'
      {...props}
    >
      {props.children}
    </DataListText>
  );
};

export const DataListText = (props) => {
  return <Text as='div' fontSize='md' maxW='full' noOfLines={1} {...props} />;
};

export const DataListLoadingState = () => {
  return (
    <>
      <DataListRow>
        <DataListCell>
          <Stack w='full' opacity={0.6} p={2}>
            <Skeleton w='30%' h={2} noOfLines={1} />
            <Skeleton w='20%' h={2} noOfLines={1} />
          </Stack>
        </DataListCell>
      </DataListRow>
      <DataListRow>
        <DataListCell>
          <Stack w='full' opacity={0.4} p={2}>
            <Skeleton w='30%' h={2} noOfLines={1} />
            <Skeleton w='20%' h={2} noOfLines={1} />
          </Stack>
        </DataListCell>
      </DataListRow>
      <DataListRow>
        <DataListCell>
          <Stack w='full' opacity={0.2} p={2}>
            <Skeleton w='30%' h={2} noOfLines={1} />
            <Skeleton w='20%' h={2} noOfLines={1} />
          </Stack>
        </DataListCell>
      </DataListRow>
    </>
  );
};

export const DataListEmptyState = (props) => {
  return (
    <DataListRow flex={1}>
      <DataListCell
        flex={1}
        justifyContent='center'
        alignItems='center'
        fontSize='sm'
        fontWeight='semibold'
        color='text-dimmed'
      >
        {props.searchTerm ? (
          <Box>Aucun résultat pour {props.searchTerm}</Box>
        ) : (
          props.children ?? <Box>Aucune donnée</Box>
        )}
      </DataListCell>
    </DataListRow>
  );
};

export const DataListErrorState = (props) => {
  return (
    <DataListRow>
      <DataListCell>
        <Alert status='error'>
          <AlertTitle>{props.title ?? 'Une erreur est survenue'}</AlertTitle>
          {(!!props.children || !!props.retry) && (
            <AlertDescription>
              <Wrap spacingX={2} spacingY={1}>
                {!!props.children && (
                  <Box alignSelf='center'>{props.children}</Box>
                )}
                {!!props.retry && (
                  <Button
                    colorScheme='error'
                    variant='ghost'
                    size='sm'
                    leftIcon={<LuRefreshCw />}
                    onClick={() => props.retry?.()}
                  >
                    Reessayer
                  </Button>
                )}
              </Wrap>
            </AlertDescription>
          )}
        </Alert>
      </DataListCell>
    </DataListRow>
  );
};
