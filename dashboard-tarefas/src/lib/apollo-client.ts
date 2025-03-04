import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL,
});

const authLink = new ApolloLink((operation, forward) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
    console.log("🔍 Token enviado pelo Apollo Client:", token); 
  
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  
    return forward(operation);
  });
  

const client = new ApolloClient({
  link: authLink.concat(httpLink), 
  cache: new InMemoryCache(),
});

export default client;
