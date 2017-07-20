/* global io */
/* global $ */
$(function() {
  var socket = io();
  
  var cvs = $('#game')[0];
  var c = cvs.getContext('2d');
  var tiles;
  
  var winner;
  
  socket.on('board', function(data) {
    tiles = data;
    draw();
  });
  
  socket.on('winner', function(data) {
    winner = data;
    draw();
  });
  
  function draw() {
    if(c !== undefined) {
      // Clear the canvas.
      c.clearRect(0, 0, cvs.width, cvs.height);
      // Draw the board lines.
      drawBoard();
      // Gridlines used for seeing the click regions.
      // drawGrid();
      // If the tiles array exists, draw the tiles.
      if(tiles !== undefined) {
        fillBoard();
      }
      if(winner !== undefined) {
        drawWinner(winner);
        winner = undefined;
      }
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
    var edge_start = cvs.width / 20;
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
  
  // Fill board with X's and O's.
  function fillBoard() {
    for(var i = 0; i < tiles.length; i++) {
      if(tiles[i] == 1) {
        drawX(i);
      } else if(tiles[i] == 2) {
        drawO(i);
      }
    }
  }
  
  // Style and position for X and O drawings.
  function getCenters(space) {
    c.strokeStyle = 'black';
    c.lineWidth = cvs.width / 25;
    c.lineCap = 'round';
    
    var center = {};
    
    var centers = [];
    centers.push(cvs.width / 6);
    centers.push(cvs.width / 2);
    centers.push(cvs.width / 6 * 5);
    
    center.w = (cvs.width / 3 - cvs.width / 10) / 2;
    center.x = centers[space % 3];
    center.y = centers[Math.floor(space / 3)];
    
    return center;
  }
  
  // Draw an X in the given space.
  function drawX(space) {
    var center = getCenters(space);
    
    c.beginPath();
    c.moveTo(center.x - center.w, center.y - center.w);
    c.lineTo(center.x + center.w, center.y + center.w);
    c.stroke();
    
    c.beginPath();
    c.moveTo(center.x + center.w, center.y - center.w);
    c.lineTo(center.x - center.w, center.y + center.w);
    c.stroke();
  }
  
  // Draw an O in the given space.
  function drawO(space) {
    var center = getCenters(space);
    
    c.beginPath();
    c.arc(center.x, center.y, center.w, 0, 2 * Math.PI, false);
    c.stroke();
  }
  
  // Draw text stating winner.
  function drawWinner(winner) {
    var center = cvs.width / 2;
    var font_size = cvs.width / 4;
    c.font = font_size + 'px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = '#32CD32';
    
    if(winner == 0) {
      c.fillText('Tie', center, center);
    } else if(winner == 1) {
      c.fillText('X Wins', center, center);
    } else if(winner == 2) {
      c.fillText('O Wins', center, center);
    }
  }
  
  window.addEventListener('click', onClick);
  initTouch();
  
  function onClick(e) {
    var dim = cvs.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;
    var space = gridSpace(x, y);
    if(space >= 0) {
      socket.emit('click', space);
    }
  }
  
  function initTouch() {
    cvs.addEventListener('touchstart', touch);
  }
  
  function touch(e) {
    e.preventDefault();
    var touches = e.changedTouches;
    var dim = cvs.getBoundingClientRect();
    var x = touches[0].pageX - dim.left;
    var y = touches[0].pageY - dim.top;
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