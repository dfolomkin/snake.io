const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const KEYS = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight'
};
const DIRECTIONS = {
  up: 'dirUp',
  down: 'dirDown',
  left: 'dirLeft',
  right: 'dirRight'
};
const FIELD_DIMS = {
  rows: 60,
  cols: 60,
  scale: 6
};

const model = {};
const state = {
  players: [
    {
      id: 000,
      fieldInstance: [[]],
      color: 'rgb(100, 100, 100)',
      head: { row: 0, col: 0 },
      direction: DIRECTIONS.left,
      nextDirection: ''
    }
  ],
  field: [[]]
};

const clients = [];

let timer;

app.use((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
});

io.on('connection', socket => {
  socket.on('clientConnect', () => {
    console.log(`Client ${socket.id} is connected`);

    if (Object.keys(io.sockets.sockets).length === 1) {
      timer = setInterval(() => {
        for (s in io.sockets.sockets) {
          io.to(s).emit('modelUpdate', model);
        }
      }, 200);
    }

    socket.emit('fieldInit', {
      height: FIELD_DIMS.rows * FIELD_DIMS.scale,
      width: FIELD_DIMS.cols * FIELD_DIMS.scale,
      scale: FIELD_DIMS.scale
    });

    // model[clientId] = {
    //   position: { row: 0, col: 0 },
    //   score: 0
    // };

    // socket.emit('modelUpdate', model);
  });

  // const field = new Array(FIELD_DIMS.height).map(
  //   item => new Array(FIELD_DIMS.width)
  // );

  // field[0][0] = true;

  socket.on('start', () => {});

  socket.on('control', ({ key, clientId }) => {
    switch (key) {
      case KEYS.up:
        if (model[clientId].position.row > 0) {
          model[clientId].position.row--;
          io.emit('modelUpdate', model);
        }
        break;
      case KEYS.down:
        if (model[clientId].position.row < FIELD_DIMS.rows - 1) {
          model[clientId].position.row++;
          io.emit('modelUpdate', model);
        }
        break;
      case KEYS.left:
        if (model[clientId].position.col > 0) {
          model[clientId].position.col--;
          io.emit('modelUpdate', model);
        }
        break;
      case KEYS.right:
        if (model[clientId].position.col < FIELD_DIMS.cols - 1) {
          model[clientId].position.col++;
          io.emit('modelUpdate', model);
        }
        break;
      default:
    }
  });

  socket.on('disconnect', function() {
    console.log(`Connection ${socket.id} has been closed`);
    if (!Object.keys(io.sockets.sockets).length) {
      clearInterval(timer);
    }
  });
});

const PORT = 8081;

http.listen(PORT, () => {
  console.log('WS server is listening on:', PORT);
});
