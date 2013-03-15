process.stdin.resume();

process.on('SIGHUP', function () {
  console.log('haha');
});
