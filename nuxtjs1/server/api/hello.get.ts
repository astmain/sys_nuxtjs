export default defineEventHandler(async (event) => {
  console.log("hello.get");
  return {
    code: 200,
    msg: "success",
    rersult: {
      name: "hello.get",
      count: 100,
    },
  };
});
