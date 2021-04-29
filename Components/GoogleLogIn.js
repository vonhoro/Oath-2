import React from "react";
import { Button } from "@chakra-ui/react";

// Add your endpoint here

const googleAuth = process.env.GOOOGLE_AUTH;

export const GoogleLogIn = () => {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        window.open(googleAuth, "_self");
      }}
      width="full"
      mt={4}
      colorScheme="red"
    >
      Continue with Google{" "}
    </Button>
  );
};
