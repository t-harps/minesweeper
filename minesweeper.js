var COLS = 9,
    ROWS = 9;
var EMPTY = 0,
    BOMB = 9,
    NEAR = 1,
    BOMBS = 10;

var grid = {
	width: null,
	height: null,
	_grid: null,

	init: function(d, c, r) {
		this.width = c;
		this.height = r;

		this._grid=[];
		for (x=0; x<c; x++){
			this._grid.push([]);
			for (y=0; y<r; y++){
				this._grid[x].push(d);
			}
		}
	},

	set: function(val, x, y){
		this._grid[x][y] = val;
	},

	get: function(x, y) {
		return this._grid[x][y];
	}
}

function setBombs(n) {
	var empty = [];
	for (i=0; i < n; i++){
		for (x=0; x < grid.width; x++){
			for (y=0; y < grid.height; y++){
				if (grid.get(x,y) === EMPTY) {
					empty.push({x:x, y:y});
				}
			}
		}
	  var randpos = empty[Math.floor(Math.random()*empty.length)];
	  grid.set(BOMB, randpos.x, randpos.y);
	}
}

function setNear() {
	var bomb = [];
	for (x=0; x < grid.width; x++){
		for (y=0; y < grid.height; y++){
			if (grid.get(x,y) === BOMB) {
				bomb.push({x:x, y:y});
			}
		}
	}
	for (z=0; z < bomb.length; z++){
		var bomb_position = bomb[z];
    var near_positions = returnPositions(bomb_position);
    for (i=0; i < near_positions.length; i++) {
    	fillNearBomb(near_positions[i]);
    }
	}
}

function inBounds(x,y){
	if (x > -1 && x < 9 && y > -1 && y < 9){
		return true;
	}
}

function returnPositions(bp) {
  var positions = [];
  var fPositions = [];
  positions.push({x:bp.x+1, y:bp.y-1});
  positions.push({x:bp.x+1, y:bp.y+1});
  positions.push({x:bp.x+1, y:bp.y});
  positions.push({x:bp.x-1, y:bp.y-1});
  positions.push({x:bp.x-1, y:bp.y+1});
  positions.push({x:bp.x-1, y:bp.y});
  positions.push({x:bp.x, y:bp.y-1});
  positions.push({x:bp.x, y:bp.y+1});
  for (i=0; i < positions.length; i++) {
  	if (inBounds(positions[i].x, positions[i].y)){
  		fPositions.push(positions[i]);
  	}
  }
  return fPositions;
}

function fillNearBomb(nb) {
  if (grid.get(nb.x,nb.y) != BOMB) {
  	if (grid.get(nb.x,nb.y) === EMPTY) {
      grid.set(NEAR,nb.x,nb.y);
    } else {
    	var NUMBER = grid.get(nb.x,nb.y) + 1;
    	grid.set(NUMBER,nb.x,nb.y);
    }
  } 
}

function drawBoard() {
  $('.container').empty();
  var $box = $("<div class='box'></div>");
  for (var x=0; x<9; x++){
  	for (var y=0; y<9; y++){
  		var box_id = (y + (x*9));
  		$('.container').append($("<div class='box hid' id="+box_id+"></div>"));
  	}
  }
}

function draw() {
	for (var x=0; x < grid.width; x++){
		for (var y=0; y < grid.height; y++){
			var boxID = (y + (x*9));
			var $box = $(".container").find("#"+boxID);
			switch (grid.get(x,y)) {
				case EMPTY:
				  $box.addClass('empty');
					break;
				case BOMB:
				  $box.addClass('bomb');
				  break;
				case NEAR:
				  $box.addClass('near');
				  $box.append($("<p class='number'>"+grid.get(x,y)+"</div>"));
				  break;
				default:
				  $box.addClass('near');
				  $box.append($("<p class='number'>"+grid.get(x,y)+"</div>"));
				  break;
			}
		}
	}
}

function squareClick(){
  $(".box").click(function(evt){
	  var currentClass = this.className;
	  var currentId = this.id;
	  removeHid(currentClass,currentId);
	  win();
	});
}

function clear(currentId){
	var cI = +currentId;
	var queue = [cI];
	while (queue.length > 0) {
		var current_id = queue.shift();
		var current_square = $(".container").find("#"+current_id);
		if (current_square.attr('class') === "box hid bomb") {
			
		} else if (current_square.attr('class') === "box hid near") {
			current_square.removeClass('hid');
			
		} else if (current_square.attr('class') === "box hid empty"){
			current_square.removeClass('hid');
			var neighbourIDs = neighbouring(current_id);
			for (i=0; i<neighbourIDs.length; i++){
				queue.push(neighbourIDs[i]);
		  }
		} else {

		}
	}
}

function neighbouring(id){
	var neighbours = [];
	//Squares along right edge
	if (((id+1)%9) === 0){
		if (id === 8){
      neighbours.push(id - 1);
      neighbours.push(id + 8);
      neighbours.push(id + 9);
		}
		else if (id === 80){
      neighbours.push(id - 1);
      neighbours.push(id - 10);
      neighbours.push(id - 9);
		} else {
			neighbours.push(id - 1);
			neighbours.push(id + 8);
			neighbours.push(id + 9);
			neighbours.push(id - 10);
      neighbours.push(id - 9);
		}
	// Squares along left edge
	} else if ((id%9) === 0) {
		if (id === 0) {
			neighbours.push(id + 1);
      neighbours.push(id + 9);
      neighbours.push(id + 10);
		} else if (id === 72) {
			neighbours.push(id + 1);
      neighbours.push(id - 9);
      neighbours.push(id - 8);
		} else  {
			neighbours.push(id + 1);
      neighbours.push(id + 9);
      neighbours.push(id + 10);
      neighbours.push(id - 9);
      neighbours.push(id - 8);
		}
	} else {
		neighbours.push(id + 1);
		neighbours.push(id - 1);
		neighbours.push(id + 10);
		neighbours.push(id - 10);
		neighbours.push(id + 8);
		neighbours.push(id - 8);
    neighbours.push(id + 9);
    neighbours.push(id - 9);
	}
	return neighbours;
}

function removeHid(currentClass,currentId){
	if (currentClass ==="box hid empty"){
	  clear(currentId);
	} else if (currentClass ==="box hid bomb"){
		$('#'+currentId).removeClass('hid');
		lose();
	} else if (currentClass ==="box hid near"){
	 	$('#'+currentId).removeClass('hid');
	}
}

function win(){
	var count = 0;
	for (i=0; i<81 ;i++) {
		var square = $(".container").find("#"+i);
		if ((square.attr('class') === "box hid near") || (square.attr('class') === "box hid empty")) {
  	  count++;
		}
	}
	if (count===0){
		$('body').append($("<div id='lose'>YOU WIN</div>"));
	}
	console.log(count);
}

function main() {
	drawBoard();
	init();
	update();
}

function init() {
	grid.init(EMPTY,COLS,ROWS);
	setBombs(BOMBS);
	setNear();
	draw();
}

function update() {
	squareClick();
}

function lose() {
	$('body').append($("<div id='lose'>YOU LOSE</div>"));
}


$(document).ready(function(){
  main();
});






