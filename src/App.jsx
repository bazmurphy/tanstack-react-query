import "./App.css";

// this is just for the input
import { useRef } from "react";

// these are the imports for handling Query, Mutation and accessing methods on the QueryClient
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// mock data
const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

function App() {
  // console.log("POSTS:", POSTS);

  // this is just for the input
  const inputRef = useRef();

  // this returns the new QueryClient() we created in main.jsx
  // so we can ue the methods on it
  // for example invalidateQueries in our onSuccess function inside of our newPostMutation function
  const queryClient = useQueryClient();

  // useQuery hook
  const postsQuery = useQuery({
    // a query key that uniquely identifies the query
    // it always takes an array and we pass it the label of "posts"
    queryKey: ["posts"],
    // a query function to get your data, and it accepts a Promise
    // wait is mimicking a network delay
    queryFn: () => wait(1000).then(() => [...POSTS]),
    // queryFn: () => Promise.reject("Some Error Message"),
  });

  // useMutation hook
  const newPostMutation = useMutation({
    // a mutation function, and it accepts a Promise
    mutationFn: (title) => {
      return wait(1000).then(() => {
        return POSTS.push({ id: crypto.randomUUID(), title });
      });
    },
    // IT CHANGES the underlying data related to the QUERRY KEY ("posts") above
    // but when we click this it does not immediately update the list of POSTS to include the newly added post,
    // this is because of the way CACHEING works in tanstack React Query
    // so we need to setup an onSuccess
    // that invalidates the old CACHED posts data
    // and will refetch the newer posts data
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postsQuery.isLoading) {
    return <h2>Loading...</h2>;
  }

  if (postsQuery.isError) {
    return (
      <>
        <h2>Error</h2>
        <pre>{JSON.stringify(postsQuery.error)}</pre>
      </>
    );
  }

  // if we reach here we are not loading and do not have an error
  return (
    <div className="App">
      <h1>TanStack React Query</h1>
      <div className="posts">
        <h2>Posts</h2>
        {postsQuery.data.map((post) => {
          return (
            <div key={post.id} className="post">
              <p>ID: {post.id}</p>
              <p>Title: {post.title}</p>
            </div>
          );
        })}
      </div>
      <div className="add-post">
        <h3>Add New Post</h3>
        <div>
          <label htmlFor="title">Title: </label>
          <input type="text" name="title" ref={inputRef} />
        </div>
        <button
          // we disable the button whilst the query is in loading state
          disabled={newPostMutation.isLoading}
          // on click we run a new mutation that creates a new post with a title
          onClick={() => newPostMutation.mutate(inputRef.current.value)}
        >
          Add New Post
        </button>
      </div>
    </div>
  );
}

// utility function to mimic network delay (because we have no backend)
function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
