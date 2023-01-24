import setText, { appendText } from "./results.mjs";

export function timeout() {
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  timeoutPromise.then(() => setText("TIME OUT !!"));
}

export function interval() {
  let counter = 1;
  let interval;
  const intervalPromise = new Promise((resolve) => {
    interval = setInterval(() => {
      resolve(`Welcome To ${counter} `);
      console.log(counter++);
    }, 1000);
  });

  const myResolve = (data) => setText(data + "My Time Interval");
  intervalPromise.then(myResolve).finally(() => clearInterval(interval));
}

export function clearIntervalChain() {}

export function xhr() {
  const xhrPromise = new Promise((resolve, reject) => {
    axios
      .get("http://localhost:3000/addresses/7")
      .then(({ data }) => resolve(data))
      .catch((reason) => reject(reason));
  });

  xhrPromise
    .then((result) => setText(JSON.stringify(result)))
    .catch((reason) => setText(reason.message));
}

export function allPromises() {
  Promise.all([
    axios.get("http://localhost:3000/users"),
    axios.get("http://localhost:3000/items"),
    axios.get("http://localhost:3000/itemCategories"),
    axios.get("http://localhost:3000/addressType"), // failing deliberately
  ])
    .then(([users, items, categories, addressType]) => {
      setText("");
      appendText(JSON.stringify(users.data) + "\n\n");
      appendText(JSON.stringify(items.data) + "\n\n");
      appendText(JSON.stringify(categories.data) + "\n\n");
      appendText(JSON.stringify(addressType.data));
    })
    .catch((reason) => setText(reason));
}

export function allSettled() {
  Promise.allSettled([
    axios.get("http://localhost:3000/users"),
    axios.get("http://localhost:3000/items"),
    axios.get("http://localhost:3000/whatEver"), // failing deliberately
    axios.get("http://localhost:3000/itemCategories"),
  ]).then((values) => {
    setText("");
    values.map((v) => {
      v.status === "fulfilled"
        ? appendText(JSON.stringify(v.value.data))
        : appendText(JSON.stringify(v.reason.message));
    });
  });
}

export function race() {
  Promise.race([
    axios.get("http://localhost:3000/users/8"), // failing deliberately
    axios.get("http://localhost:3001/users"),
  ])
    .then((users) => setText(JSON.stringify(users.data)))
    .catch((reason) => setText(reason));
}
