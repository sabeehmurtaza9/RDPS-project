const chokidar = require('chokidar');
const { spawn } = require('child_process');
const path = require('path');

const watchedDir = path.resolve(__dirname, '../watched');

// Watch for file changes
const watcher = chokidar.watch(watchedDir, {
  persistent: true,
  ignoreInitial: true,
});

// Start fs_usage to monitor file events
const fsUsage = spawn('sudo', ['fs_usage', '-w', '-f', 'filesys', watchedDir]);

fsUsage.stdout.on('data', (data) => {
  const output = data.toString();
  // Check for write events to the watched directory
  if (output.includes('WRITE') && output.includes(watchedDir)) {
    const pidMatch = output.match(/pid=(\d+)/);
    const pid = pidMatch ? pidMatch[1] : 'unknown';
    const processName = execSync(`ps -p ${pid} -o comm=`).toString().trim();
    console.log(`File modified by ${processName} (PID: ${pid})`);
  }
});

watcher.on('change', (filePath) => {
  console.log(`[Change detected] File: ${filePath}`);
});