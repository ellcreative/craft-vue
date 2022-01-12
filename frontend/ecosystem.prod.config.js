module.exports = {
  apps: [
    {
      name: 'craftvue',
      exec_mode: 'cluster',
      instances: 2,
      script: './node_modules/.bin/craftvue',
      args: 'start --port 3001',
    },
  ],
}
