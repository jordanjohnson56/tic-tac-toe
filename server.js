var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var ip = process.argv[2] || undefined;
var port = process.argv[3] || process.env.PORT || 8080;

// Default server setup.
if(ip !== undefined) {
  http.listen(port, ip, function() {
    console.log('listening on ' + ip + ':' + port);
  });
} else {
  http.listen(port, function() {
    console.log('listening on 0.0.0.0:' + port);
  });
}

// Look for resources in these folders.
app.use('/css', express.static(path.join('client', 'css')));
app.use('/js', express.static(path.join('client', 'js')));
app.use('/img', express.static(path.join('client', 'img')));

// Send index.html to new clients.
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

var turn = 1;
var game_over = false;
var tiles;
resetGrid();

function doMove(space) {
  if(!game_over && tiles[space] == 0) {
    tiles[space] = turn;
    toggleTurn();
    io.emit('board', tiles);
    checkBoard();
  }
}

function checkBoard() {
  // ROWS
  if(compareTiles(0, 1, 2)) {
    gameOver(tiles[0]);
  } else if(compareTiles(3, 4, 5)) {
    gameOver(tiles[3]);
  } else if(compareTiles(6, 7, 8)) {
    gameOver(tiles[6]);
  }
  // COLS
  else if(compareTiles(0, 3, 6)) {
    gameOver(tiles[0]);
  } else if(compareTiles(1, 4, 7)) {
    gameOver(tiles[1]);
  } else if(compareTiles(2, 5, 8)) {
    gameOver(tiles[2]);
  }
  // DIAG
  else if(compareTiles(0, 4, 8)) {
    gameOver(tiles[0]);
  } else if(compareTiles(2, 4, 6)) {
    gameOver(tiles[2]);
  }
  // TIE
  else {
    var tie = true;
    for(var i = 0; tie && i < tiles.length; i++) {
      if(tiles[i] == 0) tie = false;
    }
    if(tie) gameOver(0);
  }
}

function compareTiles(t0, t1, t2) {
  if(tiles[t0] != 0) {
    if(tiles[t0] == tiles[t1] && tiles[t1] == tiles[t2]) {
      return true;
    }
  }
  return false;
}

function gameOver(winner) {
  game_over = true;
  io.emit('winner', winner);
  setTimeout(resetGrid, 1500);
}

function toggleTurn() {
  if(turn == 1) {
    turn = 2;
  } else if(turn == 2) {
    turn = 1;
  } else {
    turn = 1;
  }
}

function resetGrid() {
  tiles = [];
  for(var i = 0; i < 9; i++) {
    tiles.push(0);
  }
  turn = 1;
  game_over = false;
  io.emit('board', tiles);
}

io.sockets.on('connection', function(client) {
  console.log('Client connection received. IP: '
              + client.handshake.address);

  client.on('disconnect', function() {
    console.log('Client disconnected. IP: '
                + client.request.connection.remoteAddress);
  });
  
  client.emit('board', tiles);
  
  client.on('click', function(space) {
    doMove(space);
  });
  
  client.on('touch', function(data) {
    console.log(data);
  });
});
