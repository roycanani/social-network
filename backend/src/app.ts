import initApp from "./server";
const port = process.env.PORT;

initApp().then(({app, server}) => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
