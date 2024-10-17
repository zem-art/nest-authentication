// nest app intial
export default () => ({
    app: {
      host: process.env.NEST_APP_URL,
      port : process.env.NEST_APP_PORT,
      prefix : process.env.NEST_APP_PREFIX,
      env : process.env.NEST_APP_ENV,
    },
});