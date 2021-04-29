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
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Stack,
  Button,
  IconButton,
  Divider,
} from "@chakra-ui/react";

const bodyImage = "";

const REGISTER_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
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
export const RegisterForm = () => {
  const router = useRouter();
  let pass;
  const [registerUser] = useMutation(REGISTER_USER);
  return (
    <Box my={8} textAlign="left" bg="blue.500" p="4">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          passwordCheck: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .min(3, "You neeed 3 characetrs or more")
            .required("Required Field"),
          email: Yup.string()
            .email("Use a Valid email")
            .required("Required Field"),
          password: Yup.string()
            .min(8, "You need 8 characters or more")
            .matches(/[a-z]/, "You need one lower case character")
            .matches(/[A-Z]/, "You need one capital letter")
            .matches(/\d/, "You need one number")
            .matches(
              /[\[\]|\\{}!@#$%^&*()_\-\+:;,.<>/]+/,
              "You need one special character like ?!@#$%^&*(] "
            )
            .required("Required Field"),
          passwordCheck: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords do not match")
            .required("Required Field"),
        })}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          if (values.password !== values.passwordCheck) return;
          if (values.username.includes(" ")) {
            setFieldError("username", "The user name can't have blank spaces");
            setSubmitting(false);
            return;
          }
          if (values.password.includes(" ")) {
            setFieldError("password", "The password can't have blank fields");
            setSubmitting(false);
            return;
          }
          const { data } = await registerUser({
            variables: {
              username: values.username,
              email: values.email,
              password: values.password,
            },
          });
          setSubmitting(false);
          if (!data.addUser.error) {
            router.push("/");
          }
          const error = data.addUser.error[0];
          setFieldError(error.item, error.message);
        }}
      >
        {({ values, handleChange, isSubmitting, isValid }) => (
          <Form>
            <InputField
              name="username"
              placholder="Username"
              label="Username"
            />
            <InputField
              mt={4}
              type="email"
              name="email"
              placholder="Email adress"
              label="Email"
            />
            <InputField
              mt={4}
              type="password"
              name="password"
              placeholder="Password"
              label="Password"
            />
            <InputField
              mt={4}
              type="password"
              name="passwordCheck"
              placeholder="Confirm your password"
              label="Confirm your password"
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisable={isValid}
              colorScheme={isValid ? "green" : "gray"}
              width="full"
              mt={6}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
      <GoogleLogIn />
    </Box>
  );
};
