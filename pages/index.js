import Head from "next/head";
import styles from "../styles/Home.module.css";
import { RegisterForm } from "../Containers/RegisterForm";
import { Flex, Text, Link } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const CHECK_USER = gql`
  query Me {
    me {
      user
      userId
      welcome
    }
  }
`;
export default function Home() {
  const router = useRouter();
  const { loading, error, data } = useQuery(CHECK_USER);
  if (loading) return <Text>Loading</Text>;
  if (error) {
    console.log(error);
    return <Text>error</Text>;
  }
  if (!data.me)
    return (
      <Flex mt="50vh" align="center" justify="center">
        <Text>
          Click
          <Link
            onClick={(e) => {
              router.push("/login");
              console.log(router);
            }}
            cursor={"pointer"}
            color="blue"
          >
            {" "}
            Here{" "}
          </Link>{" "}
          to Log in, or{" "}
          <Link
            color="blue"
            onClick={(e) => {
              router.push("/register");
              console.log(router);
            }}
            cursor={"pointer"}
          >
            {" "}
            Here
          </Link>{" "}
          to Register
        </Text>
      </Flex>
    );

  return (
    <Flex mt="50vh" align="center" justify="center">
      <Text>
        {data?.me.user}, Welcome back!, Click
        <Link
          onClick={(e) => {
            router.push("/login");
            console.log(router);
          }}
          cursor={"pointer"}
          color="blue"
        >
          {" "}
          Here{" "}
        </Link>{" "}
        to Log in, or{" "}
        <Link
          color="blue"
          onClick={(e) => {
            router.push("/register");
            console.log(router);
          }}
          cursor={"pointer"}
        >
          {" "}
          Here
        </Link>{" "}
        to Register
      </Text>
    </Flex>
  );
}
