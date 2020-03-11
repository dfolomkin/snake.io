const PORT = 8081;
const socket = io('http://localhost:' + PORT);

const drawDot = (row, col) => {
  const canvas = document.getElementById('snakes');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = client.color;
    ctx.fillRect(row * scaleRate, col * scaleRate, scaleRate, scaleRate);
  }
};

const client = {
  name: '',
  color: 'rgb(100, 100, 100)'
};
let scaleRate;

socket.on('connect', () => {
  console.log('Connection with server has been established');

  socket.emit('clientConnect');

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

  socket.on('data', model => {
    drawDot(model[client.id].position.col, model[client.id].position.row);
  });

  document.addEventListener('keydown', e => {
    socket.emit('control', { key: e.key, clientId: client.id });
  });

  document.getElementById('name-ctrl').addEventListener('change', e => {
    client.name = e.value;
    console.log(e.value);
  });

  document.getElementById('btn-start').addEventListener('click', e => {
    socket.emit('start', client);
  });
});
