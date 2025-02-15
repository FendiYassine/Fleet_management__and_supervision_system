import React from 'react';

import { IconButton, forwardRef } from '@chakra-ui/react';
import { LuMoreVertical } from 'react-icons/lu';

export const ActionsButton = forwardRef(({ label, ...rest }, ref) => {
  return (
    <IconButton
      ref={ref}
      display='inline-flex'
      borderRadius='full'
      variant='ghost'
      color='inherit'
      colorScheme='gray'
      bg='transparent'
      opacity='0.5'
      _hover={{ opacity: 1, bg: 'rgba(0, 0, 0, 0.05)' }}
      _focusVisible={{ opacity: 1, boxShadow: 'outline' }}
      _active={{ bg: 'rgba(0, 0, 0, 0.1)' }}
      icon={<LuMoreVertical />}
      aria-label={label}
      {...rest}
    />
  );
});

ActionsButton.displayName = 'ActionsButton';
