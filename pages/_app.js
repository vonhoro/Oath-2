import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
// , createHttpLink
import { ApolloProvider } from "@apollo/client";
const link = createHttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
  // headers: {
  // cookie: req.header("Cookie"),
  // },
});

const client = new ApolloClient({
  // uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
  link,
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
