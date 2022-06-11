import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";

// LIBS
import {
  Heading,
  Box,
  Flex,
  Input,
  Stack,
  IconButton,
  useToast,
} from "@chakra-ui/react";

import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

// APOLLO
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// COMPONENTS
import Characters from "../Components/Characters";

export default function Home(results) {
  const initialState = results;
  const [characters, setCharacters] = useState(initialState.characters);

  const [search, setSearch] = useState("");

  const toast = useToast();

  return (
    <Flex
      direction="column"
      justify="center"
      align="centers"
      className={styles.container}
    >
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box md={4} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1" size="2xl" mb={8}>
          Rick and Morty
        </Heading>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const results = await fetch("/api/SearchCharacters", {
              method: "POST",
              body: search,
            });

            const { characters, error } = await results.json();

            if (error) {
              toast({
                position: "bottom",
                title: "An error occured",
                description: error,
                status: "error",
                duration: 4000,
                isClosable: true,
              });
            } else {
              setCharacters(characters);
            }
          }}
        >
          <Stack maxWidth="350px" width="100%" isInline mb="8">
            <Input
              placeholder="Search"
              value={search}
              border="none"
              onChange={(e) => setSearch(e.target.value)}
            />

            <IconButton
              colorScheme="blue"
              aria-label="Search Database"
              icon={<SearchIcon />}
              disabled={search === ""}
              type="submit"
            />

            <IconButton
              colorScheme="red"
              aria-label="Reset Button"
              icon={<CloseIcon />}
              disabled={search === ""}
              onClick={() => {
                setSearch("");
                setCharacters(initialState.characters);
              }}
            />
          </Stack>
        </form>

        <Characters characters={characters} />
      </Box>
    </Flex>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            pages
            count
          }

          results {
            name
            id
            location {
              id
              name
            }

            origin {
              id
              name
            }

            episode {
              id
              episode
              air_date
            }
            image
          }
        }
      }
    `,
  });

  return {
    props: {
      characters: data?.characters.results,
    },
  };
}
