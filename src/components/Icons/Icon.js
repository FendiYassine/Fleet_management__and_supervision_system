import React from 'react';

import {
  Box,
  Icon as ChakraIcon,
  forwardRef,
} from '@chakra-ui/react';

export const Icon = forwardRef(
  ({ icon: IconEl, iconProps, ...rest }, ref) => {
    return (
      <Box
        as="span"
        display="inline-block"
        position="relative"
        w="1em"
        flex="none"
        _before={{
          content: '"."',
          visibility: 'hidden',
        }}
        ref={ref}
        {...rest}
      >
        <ChakraIcon
          as={IconEl}
          w="1em"
          h="1em"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          {...iconProps}
        />
      </Box>
    );
  }
);
