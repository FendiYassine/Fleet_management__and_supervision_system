import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    message: '',
  });
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the submission, e.g., sending data to a backend server
    console.log('Submitting contact form', contactInfo);
    toast({
      title: 'Thank you for your message!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    // Reset form (optional)
    setContactInfo({ name: '', email: '', message: '' });
  };

  return (
    <Box
      p={8}
      maxW="md"
      mx="auto"
      bg={useColorModeValue('white', 'gray.700')}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      mt={8}
    >
      <Heading as="h3" size="lg" textAlign="center" mb={6}>
        Contact Us
      </Heading>
      <Stack spacing={4} as="form" onSubmit={handleSubmit}>
        <FormControl id="name" isRequired>
          <FormLabel>Name:</FormLabel>
          <Input
            type="text"
            name="name"
            value={contactInfo.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email:</FormLabel>
          <Input
            type="email"
            name="email"
            value={contactInfo.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="message" isRequired>
          <FormLabel>Message:</FormLabel>
          <Textarea
            name="message"
            value={contactInfo.message}
            onChange={handleChange}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full">
          Send
        </Button>
      </Stack>
    </Box>
  );
};

export default Contact;
