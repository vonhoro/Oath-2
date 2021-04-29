import Head from "next/head";
import styles from "../styles/Home.module.css";
import { LoginForm } from "../Containers/LoginForm";
import { Flex } from "@chakra-ui/react";
export default function Home() {
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center" bg="cyan">
      <LoginForm />
    </Flex>
  );
}
