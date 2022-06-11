import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
  cache: new InMemoryCache(),
});

export default async (req, res) => {
  const search = req.body;

  const { data } = await client.query({
    query: gql`query{
                characters(filter: {name: "${search}"}){
                  info{
                    pages
                    count
                  }
                  
                  results{
                    name
                    id
                    location{
                      id
                      name
                    }
                    
                    origin{
                      id
                      name
                    }
                    
                    episode{
                      id
                      episode
                      air_date
                    }
                    image
                  }
                }
              }`,
  });

  if (data.characters.results.length) {
    res.status(200).json({ characters: data.characters.results, error: null });
  }else{
    res.status(404).json({characters: [], error: "Not Found"})
  }
};
