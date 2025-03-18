interface Config {
  apiUrl: string;
  baseUrl: string;
}

const config: Config = {
  // eslint-disable-next-line no-undef
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:4000",
  // eslint-disable-next-line no-undef
  baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost",
};

export default config;
