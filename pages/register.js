import Head from "next/head";
import styles from "../styles/Home.module.css";
import { RegisterForm } from "../Containers/RegisterForm";
import { Flex } from "@chakra-ui/react";
export default function Home() {
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center" bg="cyan">
      <RegisterForm />
    </Flex>
  );
}
