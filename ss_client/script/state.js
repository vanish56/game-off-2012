function GenerateDrops(dCount){
	var drops = [];
	for(var d = 0; d < dCount; d++){
		drops.push({ "tile":Math.floor((Math.random()*2)), "player":0 });
	}
	return drops;
}

function GenerateHexBoard(x,y){
	var board = {};
	for (var row = 0; row < x; row++){
		if (!board[row]){
			board[row] = {};
		}
		
		for (var col = 0; col < y; col++){
			if (!board[col]){
				board[col] = {};
			}

			board[row][col] = {
				"tile": Math.floor((Math.random()*2)),
				"player": 0,
			}
		}	
	}
	return board;
}

function GeneratePlayers(pCount){
	var players = {};
	var colors = ["red", "green", "blue", "yellow"];
	for (var p = 1; p <= pCount; p++){
		players[p] = {
			"position": p,
			"name": "Player "+p,
			"color": colors[p-1],
			"eliminated": 0
		}
	}
	return players;
}

var logger = { 
	toConsole: 1,
	doRender: 0,
	log: function(){ 
		if (this.toConsole){
			console.log(arguments);
		}
		gamestate.log.push(arguments[0]); 
		if (this.doRender){
			Render();
		}
	} 
};

var gamestate = {
	"phase": "Setup",
	"turn": 0,
	"round": 0,
	"board": {
		"hexes": GenerateHexBoard(13, 13),
		"drops": GenerateDrops(10)
	},
	"players": GeneratePlayers(4),
	"history": [],
	"log": [],
	"active": {
		"playerIndex": 0,
		"action": null
	}
}