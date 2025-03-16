import initApp from "./server";
const port = process.env.PORT;

initApp().then(({app, server}) => {
  server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
