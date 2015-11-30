$(document).ready(function(){
	//Canvas variables for height/width
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();


	//Sets cell width to 10, and saves as variable
	var cw = 10;
	var d;
	var food;
	var score;

	//Create the snake - an array of cells
	var snake_array;
	//default direction is right, adds food cell, starts score at 0.
	function init()
	{
		d = "right";
		create_snake();
		create_food();
		score = 0;

		//Sets timer, every 60ms, which will trigger the paint function
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	init();

//Sets length of snake to 5 (start with empty array)
//Sets start dirrection of snake to 'right', across top of canvas.
	function create_snake()
	{
		var length = 5;
		snake_array = [];
		for(var i = length-1; i>=0; i--)
		{
			snake_array.push({x: i, y:0});
		}
	}

	//Create the food now
	//create cell with x/y between 0-44. 45 positions across board (450/10).
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};

	}

	//Paint the snake
	function paint()
	{
		//set background on every frame to avoid leaving 'trail'
		//color('paint') canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "#black";
		ctx.strokeRect(0, 0, w, h);

		//The movement Logic
		//Pop tail and move to front
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//Increment original head position to get new position
		//Adds direction based movement
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;

		//Game Over clauses (currently) restarts game on collision (body or wall)
		//Alerts game ended and displays score (currently) in browser pop up window
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			alert("Game Over Your Score : " +score + "\nClick OK to play again!");
			init();
			return;
		};

		//Food Logic - If new head position = food position, create new head instead of popping last cell.
		// Once food is eaten, create a new food cell.
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			create_food();
		}
		else
		{
			var tail = snake_array.pop();
			tail.x = nx; tail.y = ny;
		}


		snake_array.unshift(tail); //puts back the tail as the first cell

		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y);
		}

		//Paints the food
		paint_cell(food.x, food.y);
		//The score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
		ctx.font = "20px 'Press Start 2P'";
	}

	//The paint function
	function paint_cell(x, y)
	{
		ctx.fillStyle = "#FF7D7D";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	//Checks if x/y coordinates exist in cell array or not.
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	//Adds keyboard controls to arrow keys the NOT prevents keys from reversing.
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";

	})

})
