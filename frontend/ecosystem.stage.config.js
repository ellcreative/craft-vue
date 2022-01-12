module.exports = {
  apps: [
    {
      name: 'craftvue-stage',
      instances: 1,
      script: './node_modules/.bin/craftvue',
      args: 'start --port 3101',
    },
  ],
}
