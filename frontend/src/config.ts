interface Config {
  apiUrl: string;
  baseUrl: string;
}
console.log(process.env.REACT_APP_API_URL);
console.log(process.env.REACT_APP_BASE_URL);
const config: Config = {
  apiUrl: process.env.REACT_APP_API_URL || "https://localhost:4000",

  baseUrl: process.env.REACT_APP_BASE_URL || "https://localhost",
};

export default config;
