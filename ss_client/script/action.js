function Gamestate_Nextturn(){
	gamestate.turn++;
	if (gamestate.turn==1){
		gamestate.round=1;
	}
	var e = gamestate.players.length+1;
	do {
		e--;
		gamestate.active.playerIndex=gamestate.active.playerIndex+1;
		if (gamestate.active.playerIndex > gamestate.players.length){
			gamestate.active.playerIndex = 1;
			gamestate.round++;
		}
	} while(gamestate.players[gamestate.active.playerIndex].eliminated == 0 && e > 1);
	if (e <= 1){
		return End_Elimination();
	}
	logger.log('Round: '+gamestate.round+' Turn: '+gamestate.turn);
	logger.log('Player '+gamestate.active.playerIndex+' is now up.');
}

function Gamestate_PlayerName(pID){
	return gamestate.players[pID].name;
}

function Gamestate_ActivePlayerName(){
	return Gamestate_PlayerName(gamestate.active.playerIndex);
}


function Gamestate_Hex_Neighbors(row, col, filled){
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

	if (!filled){
		var on = [];
		for(var n = 0; n < neighbors.length; n++){
			console.log(neighbors[n].row, neighbors[n].col, Object.keys(gamestate.board.hexes).length, Object.keys(gamestate.board.hexes[neighbors[n].row]).length);
			if (neighbors[n].row > 0 && neighbors[n].col > 0 && neighbors[n].row < Object.keys(gamestate.board.hexes).length && neighbors[n].col < Object.keys(gamestate.board.hexes[neighbors[n].row]).length){
				if (gamestate.board.hexes[neighbors[n].row][neighbors[n].col].tile == 0){
					on.push(neighbors[n]);
				}
			}
		}
		return on;
	}
	return neighbors;
}

function Action_Start(){
	gamestate.phase = "Action";
	gamestate.active.action = { take: 1, push: 1, pull: 1, place: 1 };
	Render();
}

function Action_Push(){
	//console.log('Action_Push', arguments);
	if (gamestate.phase != "Action"){
		logger.log("You are not allowed to push at this time.");
		Render();
		return;
	}
	if (gamestate.active.action.push <= 0){
		logger.log("You have used all allowed pushes this turn.");
		Render();
		return;
	}
	
	gamestate.phase = "Action - Push";
	logger.log(Gamestate_ActivePlayerName()+" activated push.");
	Render();
}

function Action_Push_Token(hex){
//	console.log('Action_Push_Token', arguments);
	if (gamestate.phase != "Action - Push"){
		return;
	}
	if (gamestate.board.hexes[hex.row][hex.col].tile == 0){
		logger.log("You must select a location with a token.");
		Render();
		return;
	}
	var neighbors = Gamestate_Hex_Neighbors(hex.row, hex.col, 0);
	if (neighbors.length == 0){
		logger.log("You must select a location with an empty neighbor.");
		Render();
		return;
	}
	gamestate.active.action.token = hex;
	gamestate.phase = "Action - Push - Hex"
	Render();
}

function Action_Push_Hex(hex){
//	console.log('Action_Push_Hex', arguments);
	if (gamestate.phase != "Action - Push - Hex"){
		return;
	}
	if (gamestate.board.hexes[hex.row][hex.col].tile != 0){
		logger.log("You must select an empty location.");
		Render();
		return;
	}
	var token = gamestate.active.action.token;
	gamestate.board.hexes[hex.row][hex.col] = gamestate.board.hexes[token.row][token.col];
	gamestate.board.hexes[token.row][token.col] = { "tile": 0, "player": 0 };
	gamestate.active.action.push--;
	Action_End();
}

function Action_Pull(){
	if (gamestate.phase != "Action"){
		logger.log("You are not allowed to pull at this time.");
		Render();
		return;
	}
	if (gamestate.active.action.pull <= 0){
		logger.log("You have used all allowed pulls this turn.");
		Render();
		return;
	}
	gamestate.phase = "Action - Pull";
	logger.log(Gamestate_ActivePlayerName()+" activated pull.");
	Render();
}

function Action_Pull_Token(hex){
	if (gamestate.phase != "Action - Pull"){
		logger.log("You are not allowed to pull at this time.");
		Render();
		return;
	}
	if (gamestate.board.hexes[hex.row][hex.row].tile == 0){
		logger.log("You must select location with a token.");
		Render();
		return;
	}
	gamestate.active.action.hex = hex;
	gamestate.phase = "Action - Pull - Hex";
	Render();
}

function Action_Pull_Drop(drop){
	if (gamestate.phase != "Action - Pull - Hex"){
		logger.log("You are not allowed to pull at this time.");
		Render();
		return;
	}
	
	var hex = gamestate.active.action.hex;
	gamestate.board.drops[drop.position] = gamestate.board.hexes[hex.row][hex.col];
	gamestate.board.hexes[hex.row][hex.col] = { "tile": 0, "player": 0 };
		
	gamestate.active.action.pull--;
	Action_End();
}



function Action_Place(){
	if (gamestate.phase != "Action"){
		logger.log("You are not allowed to place at this time.");
		Render();
		return;
	}
	if (gamestate.active.action.place <= 0){
		logger.log("You have used all allowed places this turn.");
		Render();
		return;
	}

	//TODO - Checks drops to see if a token can be placed
	
	gamestate.phase = "Action - Place - Token";
	logger.log(Gamestate_ActivePlayerName()+" activated place.");
	Render();
}

function Action_Place_Token(){
	if (gamestate.phase != "Action - Place - Token"){
		logger.log("You are not allowed to place at this time.");
		Render();
		return;
	}
	//TODO - Check for place available
	//TODO - Checks drops to see if a token can be placed
	
	gamestate.phase = "Action - Place - Hex";
	Render();
}

function Action_Place_Hex(hex){
	if (gamestate.phase != "Action - Place - Hex"){
		logger.log("You are not allowed to place at this time.");
		Render();
		return;
	}
	if (gamestate.board.hexes[hex.row][hex.col].tile != 0){
		logger.log("You must select an empty location.");
		Render();
		return;
	}
	var neighbors = Gamestate_Hex_Neighbors(hex.row, hex.col, 1);
	if (neighbors.length == 6){
		logger.log("You must select a location neighboring a token.");
		Render();
		return;
	}

	var drop = gamestate.active.action.drop;
	
	gamestate.board.hexes[hex.row][hex.col] = gamestate.board.drops[drop.position];
	gamestate.board.drops[drop.position] = { "tile": 0, "player": 0 };
	
	gamestate.active.action.place--;
	Action_End();
}

function Action_Land(){
	if (gamestate.phase != "Action"){
		logger.log("You are not allowed to land at this time.");
		Render();
		return;
	}

	gamestate.phase = "Action - Land";
	Render();
}

function Action_Land_Hex(hex){
	if (gamestate.phase != "Action - Land"){
		logger.log("You are not allowed to land at this time.");
		Render();
		return;
	}

	if (gamestate.board.hexes[hex.row][hex.col].tile == 0){
		logger.log("You must select an location with a token.");
		Render();
		return;
	}
	
	if (gamestate.board.hexes[hex.row][hex.col].player != gamestate.active.playerIndex){
		gamestate.players[gamestate.active.playerIndex].eliminated = 1;
		logger.log(Gamestate_ActivePlayerName()+" has attempted to land the mothership without a proper beacon.");
		logger.log(Gamestate_ActivePlayerName()+" has been eliminated from the game!");
		return Action_Finish();
	}
	
	gamestate.board.hexes[hex.row][hex.col].revealed = 1;
	
	End_Landed();
}


function Action_Cancel(){
	gamestate.phase = "Action";
	gamestate.active.action.token = null;
	gamestate.active.action.hex = null;
	gamestate.active.action.drop = null;
	logger.log(Gamestate_ActivePlayerName()+" cancelled action.");
	Render();
}

function Action_End(){
	gamestate.phase = "Action";
	gamestate.active.action.take--;
	if (gamestate.active.action.take <= 0){
		return Action_Finish();
	}
	Render();
}

function Action_Finish(){
	gamestate.phase = "Action";
	Gamestate_Nextturn();
	return Action_Start();
}

function End_Elimination(){
	gamestate.phase = "End - Elimination";
	logger.log(Gamestate_ActivePlayerName()+" is the last player remaining.");
	logger.log(Gamestate_ActivePlayerName()+" won the game!");
	Render();
}

function End_Landed(){
	gamestate.phase = "End - Landed";
	logger.log(Gamestate_ActivePlayerName()+" has landed the Mothership.");
	logger.log(Gamestate_ActivePlayerName()+" won the game!");
	Render();
}