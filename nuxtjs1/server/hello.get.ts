export default defineEventHandler(async (event) => {
  return {
    code: 200,
    msg: "success",
    rersult: {
      name: "hello.get",
      count: 100,
    },
  };
});
