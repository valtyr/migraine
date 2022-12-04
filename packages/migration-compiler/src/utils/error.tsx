import { render, measureElement, Box, Text } from "ink";
import React from "react";
import isCi from "is-ci";
import { exit } from "process";

class MigraineError {
  fancy: React.ReactElement | null;
  message: string;

  constructor(fancy: React.ReactElement | null, message: string) {
    this.fancy = fancy;
    this.message = message;
  }
}

const displayAndAbort = (error: MigraineError) => {
  if (isCi) {
    console.error(error.message);
    exit(1);
  }

  const instance = render(
    <Box
      borderColor="red"
      paddingX={1}
      justifyContent="center"
      borderStyle="round"
      flexDirection="column"
    >
      <Box>
        <Text underline bold italic color="redBright">
          Error
        </Text>
      </Box>
      {error.fancy}
    </Box>
  );
  exit(1);
};

export function withErrorHandling<T extends any[], R>(
  unwrapped: (...args: T) => R
) {
  return async (...args: T) => {
    try {
      const result = await unwrapped(...args);
      return result;
    } catch (e) {
      if (e instanceof MigraineError) {
        displayAndAbort(e);
      }
      throw e;
    }
  };
}

export default MigraineError;
