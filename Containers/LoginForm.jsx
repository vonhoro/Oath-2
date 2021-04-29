import React from "react";

import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { InputField } from "../Components/InputField";
import { GoogleLogIn } from "../Components/GoogleLogIn";

import {
  Text,
  Box,
  Link,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Checkbox,
  Button,
  IconButton,
  Divider,
} from "@chakra-ui/react";
const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      error {
        item
        message
      }
      userInfo {
        user
        userId
        welcome
      }
    }
  }
`;
export const LoginForm = () => {
  const router = useRouter();
  const [loginUser] = useMutation(LOGIN_USER);
  const [valid, setValid] = React.useState(true);

  return (
    <Box my={8} textAlign="left" bg="blue.500" p="4">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          const { data } = await loginUser({
            variables: {
              username: values.username,
              password: values.password,
            },
          });
          setSubmitting(false);
          if (!data.login.error) {
            router.push("/");
          }
          const error = data.login.error[0];

          setFieldError(error.item, error.message);
        }}
      >
        {({ values, handleChange, isSubmitting, isValid }) => (
          <Form>
            <InputField
              name="username"
              placholder="Enter your username or email address"
              label="Username/Password"
            />
            <InputField
              mt={4}
              type="password"
              name="password"
              placeholder="Enter your Email"
              label="Password"
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme="green"
              width="full"
              mt={4}
            >
              Log in
            </Button>
          </Form>
        )}
      </Formik>

      <GoogleLogIn />
    </Box>
  );
};
