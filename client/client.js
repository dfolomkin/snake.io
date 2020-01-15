const PORT = 8081;
const socket = io('http://localhost:' + PORT);

const client = {
  id: 'c001',
  color: 'rgb(100, 100, 100)'
};
var scaleRate;

socket.on('connect', () => {
  console.log('Connection with server has been established');

  socket.emit('init', client.id);

  socket.on('fieldInit', ({ height, width, scale }) => {
    const canvases = document.querySelectorAll('canvas');

    if (canvases) {
      canvases.forEach(canvas => {
        canvas.height = height;
        canvas.width = width;
      });
    }

    const battlefield = document.querySelector('.battlefield');

    if (battlefield) {
      battlefield.style.width = width + 'px';
    }

    scaleRate = scale;
  });

  socket.on('modelUpdate', model => {
    drawDot(model[client.id].position.col, model[client.id].position.row);
  });

  document.addEventListener('keydown', e => {
    socket.emit('control', { key: e.key, clientId: client.id });
  });
});

function drawDot(row, col) {
  const canvas = document.getElementById('snakes');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = client.color;
    ctx.fillRect(row * scaleRate, col * scaleRate, scaleRate, scaleRate);
  }
}
