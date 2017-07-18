/* global io */
/* global $ */
$(function() {
  var socket = io();
  
  var cvs = $('#game')[0];
  var c = cvs.getContext('2d');
  var tiles;
  
  socket.on('board', function(data) {
    tiles = data;
  });
  
  socket.on('winner', function(winner) {
    console.log("WINNER: " + (winner == 1 ? 'X' : 'O'));
  });
  
  function draw() {
    drawBoard();
    // drawGrid();
    if(tiles !== undefined) {
      fillBoard();
    }
  }
  
  function drawGrid() {
    c.strokeStyle = 'gray';
    c.lineStyle = 'square';
    c.lineWidth = 2;
    
    c.beginPath();
    c.moveTo(cvs.width / 3, 0);
    c.lineTo(cvs.width / 3, cvs.width);
    c.stroke();
    
    c.beginPath();
    c.moveTo(cvs.width / 3 * 2, 0);
    c.lineTo(cvs.width / 3 * 2, cvs.width);
    c.stroke();
    
    c.beginPath();
    c.moveTo(0, cvs.width / 3);
    c.lineTo(cvs.width, cvs.width / 3);
    c.stroke();
    
    c.beginPath();
    c.moveTo(0, cvs.width / 3 * 2);
    c.lineTo(cvs.width, cvs.width / 3 * 2);
    c.stroke();
  }
  
  function drawBoard() {
    var edge_start = cvs.width / 10 * 0.5;
    var edge_end = cvs.width / 10 * 9.5;
    var pos_first = cvs.width / 3;
    var pos_last = cvs.width / 3 * 2;
    
    c.strokeStyle = 'black';
    c.lineWidth = cvs.width / 25;
    c.lineCap = 'round';
    
    c.beginPath();
    c.moveTo(pos_first, edge_start);
    c.lineTo(pos_first, edge_end);
    c.stroke();
    
    c.beginPath();
    c.moveTo(pos_last, edge_start);
    c.lineTo(pos_last, edge_end);
    c.stroke();
    
    c.beginPath();
    c.moveTo(edge_start, pos_first);
    c.lineTo(edge_end, pos_first);
    c.stroke();
    
    c.beginPath();
    c.moveTo(edge_start, pos_last);
    c.lineTo(edge_end, pos_last);
    c.stroke();
  }
  
  // TODO: FILL BOARD SPACES
  function fillBoard() {
    var space_0 = cvs.width / 6;
    
  }
  
  function drawX(x, y) {
    
  }
  
  function drawO(x, y) {
    
  }
  
  window.addEventListener('click', onClick);
  
  function onClick(e) {
    var dim = cvs.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;
    var space = gridSpace(x, y);
    if(space >= 0) {
      socket.emit('click', space);
    }
  }
  
  function gridSpace(x, y) {
    if(x < 0 || x > cvs.width) return -1;
    if(y < 0 || y > cvs.height) return -1;
    var space_h = Math.floor(x / (cvs.width / 3));
    var space_v = Math.floor(y / (cvs.height / 3));
    var space_n = (space_v) * 3 + space_h;
    return space_n;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  // Resize the game canvas to fill the window.
  function resize() {
    if(c !== undefined) {
      var min_dim = Math.min(window.innerWidth, window.innerHeight);
      c.canvas.width = min_dim;
      c.canvas.height = min_dim;
      draw();
    }
  }
});