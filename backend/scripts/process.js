const forever = require('forever-monitor');
const path = require('path');

const scriptPath = path.join(__dirname, '../scripts/monitor.js');

const monitor = new (forever.Monitor)(scriptPath, {
  max: 3,
  silent: false,
  command: 'node',
//   args: ['--watch=/user/folder']
});

monitor.on('start', () => console.log('📡 Scanner started.'));
monitor.on('exit', () => console.log('❌ Scanner exited.'));
monitor.on('restart', () => console.log('♻️ Scanner restarted.'));

// Capture the child process output:
// monitor.on('stdout', data => {
//     console.log('📤 [scanner stdout]:', data.toString());
//   });
  
//   monitor.on('stderr', data => {
//     console.error('📛 [scanner stderr]:', data.toString());
//   });
  
//   // OR, if those don't work, attach directly:
//   monitor.child && monitor.child.stdout && monitor.child.stdout.on('data', data => {
//     console.log('📤 [scanner stdout]:', data.toString());
//   });
  
//   monitor.child && monitor.child.stderr && monitor.child.stderr.on('data', data => {
//     console.error('📛 [scanner stderr]:', data.toString());
//   });

module.exports = {
    monitor
};