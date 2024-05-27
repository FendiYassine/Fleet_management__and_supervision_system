import { forwardRef } from 'react';

import {
  AsyncCreatableSelect as ChakraAsyncCreatableSelect,
  AsyncSelect as ChakraAsyncReactSelect,
  CreatableSelect as ChakraCreatableReactSelect,
  Select as ChakraReactSelect,
} from 'chakra-react-select';

export function fixedForwardRef(render) {
  return forwardRef(render);
}

const SelectComponent = ({ type = 'select', ...props }, ref) => {
  const Element = (() => {
    if (type === 'async-creatable') return ChakraAsyncCreatableSelect;
    if (type === 'async') return ChakraAsyncReactSelect;
    if (type === 'creatable') return ChakraCreatableReactSelect;
    return ChakraReactSelect;
  })();

  return (
    <Element
      ref={ref}
      colorScheme='brand'
      selectedOptionColorScheme='brand'
      useBasicStyles
      styles={{ menuPortal: (provided) => ({ ...provided, zIndex: 9999 }) }}
      menuPortalTarget={document.body}
      chakraStyles={{
        dropdownIndicator: (provided) => ({
          ...provided,
          paddingLeft: 0,
          paddingRight: 0,
          margin: 0,
        }),
        control: (provided) => ({
          ...provided,
          paddingLeft: 2,
          paddingRight: 2,
        }),
        valueContainer: (provided) => ({
          ...provided,
          padding: 0,
          pl: 1,
        }),
        multiValue: (provided) => ({
          ...provided,
          _first: {
            ml: -1,
          },
        }),
      }}
      {...props}
    />
  );
};

export const Select = fixedForwardRef(SelectComponent);
