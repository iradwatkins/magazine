module.exports = {
  apps: [
    {
      name: 'magazine-stepperslife',
      script: 'npm',
      args: 'start',
      cwd: '/root/websites/magazine-stepperslife',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
      },
      error_file: '/var/log/pm2/magazine-error.log',
      out_file: '/var/log/pm2/magazine-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs', '.git'],
    },
  ],
}
