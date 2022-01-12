module.exports = {
  apps: [
    {
      name: 'craftvue-dev',
      instances: 1,
      script: './node_modules/.bin/craftvue',
      args: 'start --port 3201',
    },
  ],
}
