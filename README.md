# Tic Tac Toe
Dating back as far as ancient Egypt, Tic Tac Toe (also known as Noughts and
Crosses or X's and O's) is a classic. It's also quite simple to develop,
requiring only a basic knowledge of conditionals, loops, and similar programming
concepts.

Here, I've put together a version that can be played on any device with an
Internet connection and a web browser. Just visit
[my Heroku deployment](https://agile-depths-66402.herokuapp.com) to play it
yourself.

The game is developed using Node.js (express), socket.io, and HTML5 canvas. Clients
connect to the server which hosts the current game state and submit inputs by
clicking or tapping on a space on the board. The server processes that input and
updates the board accordingly.

This was a simple project where I wanted to be able to make a cross-platform
app. HTML5 powers the client-side, Node.js powers the server-side, and socket.io
connects the two. These technologies make it easier than ever to put together a
web app and deploy it. Thanks to Cloud 9 and Heroku, I don't even have to host a
server. 

Going forward, I'm hoping to use this foundation to start building similar web
games that are cross-platform. You can see my progress on
[GitHub](https://github.com/jordanjohnson56) and also view my previous project
[Paint the Floor](https://github.com/jordanjohnson56/paint-the-floor).

Thank you for your time.
