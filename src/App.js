import React, { useEffect, useState } from "react";

export default function App() {
  const [init, setInit] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!init) {
      const endpoints = [];
      endpoints.push(
        "https://my-json-server.typicode.com/typicode/demo/posts/1"
      );
      endpoints.push(
        "https://my-json-server.typicode.com/typicode/demo/posts/2"
      );
      endpoints.push(
        "https://my-json-server.typicode.com/typicode/demo/posts/3"
      );
      const limit = endpoints.length;
      let range = {
        from: 0,
        to: limit,
        [Symbol.asyncIterator]() {
          return {
            current: this.from,
            last: this.to,

            async next() {
              const value = await new Promise((resolve) => {
                const endpoint = endpoints[this.current];
                if (endpoint) {
                  setTimeout(async () => {
                    fetch(endpoint)
                      .then((response) => response.json())
                      .then((data) => {
                        resolve(`${endpoints[this.current]}`);
                      })
                      .finally(() => {})
                  }, 1000)
                } else {
                  resolve();
                }
              });
              if (this.current < this.last ) {
                this.current++;
                return { done: false, value };
              } else {
                return { done: true };
              }
            }
          };
        }
      };

      (async () => {
        const collection = [];
        for await (let value of range) {
          collection.push(value);
          setPosts([...collection]);
        }
      })();
      setInit(true);
    }
  }, [init]);

  return (
    <div className="App">
      {posts?.map((value, index) => (
        <div key={`${index}`}>{value}</div>
      ))}
      {!posts && <></>}
    </div>
  );
}
