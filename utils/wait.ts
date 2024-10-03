export const waitUntil = (promise: Promise<any>) => {
  return new Promise((resolve, reject) => {
    promise.then(resolve).catch(reject);
  });
};
