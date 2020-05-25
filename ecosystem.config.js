module.exports = {
  apps: [
    {
      name: 'MrDemonWolf-Share',
      script: 'npm start',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      exec_mode: 'cluster',
      ignore_watch: '[”[/\\]./”, “node_modules”]',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
