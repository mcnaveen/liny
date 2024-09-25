// this is a server component
// call the typicode api and return the data

export const Counter = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await res.json();

  return <div>{data.length}</div>;
};
