const forever = require('forever-monitor');
const path = require('path');

const scriptPath = path.join(__dirname, '../scripts/monitor.js');

const monitor = new (forever.Monitor)(scriptPath, {
  max: 3,
  silent: false,
  command: 'node',
});

monitor.on('start', () => console.log('📡 Scanner started.'));
monitor.on('exit', () => console.log('❌ Scanner exited.'));
monitor.on('restart', () => console.log('♻️ Scanner restarted.'));

module.exports = {
    monitor
};