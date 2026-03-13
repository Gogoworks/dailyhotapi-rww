module.exports = {
  apps: [
    {
      name: "dailyhotapi-rww",
      cwd: "/www/wwwroot/apps/dailyhotapi-rww",
      script: "./dist/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 6688,
      },
      out_file: "/www/wwwroot/apps/dailyhotapi-rww/logs/pm2-out.log",
      error_file: "/www/wwwroot/apps/dailyhotapi-rww/logs/pm2-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
