function GS_Nextturn(){
	gamestate.turn++;
	if (gamestate.turn==1){
		gamestate.round=1;
	}
	var e = Object.keys(gamestate.players).length+1;
	do {
		e--;
		gamestate.active.playerIndex=gamestate.active.playerIndex+1;
		if (gamestate.active.playerIndex > Object.keys(gamestate.players).length){
			gamestate.active.playerIndex = 1;
			gamestate.round++;
		}
	} while(gamestate.players[gamestate.active.playerIndex].eliminated == 1 && e > 1);
	if (e <= 1){
		End_Elimination();
		return false;
	}
	logger.log('Round: '+gamestate.round+' Turn: '+gamestate.turn);
	logger.log(GS_ActivePlayerName()+' is now up.');
	return true;
}

function GS_PlayerName(pID){
	return gamestate.players[pID].name;
}

function GS_ActivePlayerName(){
	return GS_PlayerName(gamestate.active.playerIndex);
}


function GS_Hex_Neighbors(row, col, filled, empty){
	return Hex_Neighbors(gamestate.board.hexes, row, col, filled, empty);
}

function Hex_Neighbors(hexes, row, col, filled, empty){
	if (filled == 0 && empty == 0){ return []; }
	row =  parseInt(row);
	col =  parseInt(col);
	var neighbors = [];
	if (row%2){
		neighbors = [
			{"row": row, "col": col-1},
			{"row": row+1, "col": col+1},
			{"row": row+1, "col": col},
			{"row": row-1, "col": col},
			{"row": row, "col": col+1},
			{"row": row-1, "col": col+1}
		];
	} else {
		neighbors = [
			{"row": row, "col": col-1},
			{"row": row+1, "col": col-1},
			{"row": row+1, "col": col},
			{"row": row-1, "col": col},
			{"row": row, "col": col+1},
			{"row": row-1, "col": col-1}
		];
	}

	var on = [];
	for(var n = 0; n < neighbors.length; n++){
		if (neighbors[n].row >= 0 && neighbors[n].col >= 0 && neighbors[n].row < Object.keys(hexes).length && hexes[neighbors[n].row] && neighbors[n].col < Object.keys(hexes[neighbors[n].row]).length && ((filled == 1 && empty == 1) || hexes[neighbors[n].row][neighbors[n].col].tile == (filled && !empty))){
			on.push(neighbors[n]);
		}
	}
	return on;
}

function GS_LandingZones(){
	return GS_SurroundedHexes(1);
}

function GS_OpenHexes(){
	return GS_SurroundedHexes(0);
}

function GS_SurroundedHexes(filled){
	var lzs = [];
	for (var row = 1; row < (Object.keys(gamestate.board.hexes).length - 1); row++){
		for (var col = 1; col < (Object.keys(gamestate.board.hexes[row]).length - 1); col++){
			if (GS_HexIsSurrounded(row, col, filled)){
				lzs.push({ "row": row, "col": col});
			}
		}
	}
	return lzs;
}

function GS_HexIsSurrounded(row, col, filled){
	if (row == 0 || col == 0 || !(row in gamestate.board.hexes) || ! (col in gamestate.board.hexes[row]) || gamestate.board.hexes[row][col].tile != filled) { return; }
	var neighbors = GS_Hex_Neighbors(row, col, 1, 0);
	if (neighbors.length == 0){
		return true;
	}
	return false;
}


function GenerateDrops(dCount){
	var drops = [];
	for(var d = 0; d < dCount; d++){
		drops.push({ "tile":0, "player":0 });
	}
	return drops;
}

function GenerateHexBoard(x,y,empty){
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
				"tile": 1,
				"player": 0,
			}
		}	
	}
	var inf = 100000;
	do {
		var rx = Math.floor((Math.random()*x));
		var ry = Math.floor((Math.random()*y));
		if (board[rx][ry].tile == 1 && Hex_Neighbors(board, rx, ry, 0, 1) == 0){
			board[rx][ry].tile = 0;
			empty--;
		}
	} while(empty > 0 && inf-- > 0);
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
	toConsole: 0,
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
		"hexes": GenerateHexBoard(11, 11, 24),
		"drops": GenerateDrops(20)
	},
	"players": GeneratePlayers(4),
	"base_action": { take: 2, push: 1, pull: 1, place: 1 },
	"history": [],
	"log": [],
	"active": {
		"playerIndex": 0,
		"action": null
	}
}