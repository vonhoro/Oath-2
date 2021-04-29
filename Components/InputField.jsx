import React from "react";
import { useField } from "formik";
import {
  Text,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Stack,
  Button,
  IconButton,
  Divider,
  Textarea,
} from "@chakra-ui/react";

export const InputField = ({ label, mt, textArea, ...props }) => {
  const [field, { error, initialTouched }] = useField(props);
  /* 
  console.log(props); */
  return (
    <>
      <FormControl mt={mt} isInvalid={error && field.value}>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        {textArea ? (
          <Textarea
            {...field}
            {...props}
            id={field.name}
            placeholder={props.placeholdr}
            borderColor="gray.400"
            _hover={{ borderColor: "orange.400" }}
          />
        ) : (
          <Input
            {...field}
            {...props}
            id={field.name}
            placeholder={props.placeholdr}
            borderColor="gray.400"
            _hover={{ borderColor: "orange.400" }}
          />
        )}
        <FormErrorMessage mt={0} mb={-4} color="white">
          {error}
        </FormErrorMessage>
      </FormControl>
    </>
  );
};
