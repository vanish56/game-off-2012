function Action_Start(){
	gamestate.phase = "Action";
	gamestate.active.action = JSON.parse(JSON.stringify(gamestate.base_action));
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
	logger.log(GS_ActivePlayerName()+" activated push.");
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
	var neighbors = GS_Hex_Neighbors(hex.row, hex.col, 0, 1);
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
	logger.log(GS_ActivePlayerName()+" activated pull.");
	Render();
}

function Action_Pull_Token(hex){
//	console.log("Action_Pull_Token", arguments);
	if (gamestate.phase != "Action - Pull"){
		logger.log("You are not allowed to pull at this time.");
		Render();
		return;
	}
	if (gamestate.board.hexes[hex.row][hex.col].tile == 0){
		logger.log("You must select a location with a token.");
		Render();
		return;
	}
	gamestate.active.action.token = hex;
	gamestate.phase = "Action - Pull - Drop";
	Render();
}

function Action_Pull_Drop(drop){
	if (gamestate.phase != "Action - Pull - Drop"){
		logger.log("You are not allowed to pull at this time.");
		Render();
		return;
	}
	
	var hex = gamestate.active.action.token;
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

	//TODO - Checks drops to see if full
	
	gamestate.phase = "Action - Place";
	logger.log(GS_ActivePlayerName()+" activated place.");
	Render();
}

function Action_Place_Drop(drop){
	if (gamestate.phase != "Action - Place"){
		logger.log("You are not allowed to place at this time.");
		Render();
		return;
	}
	
	if (gamestate.board.drops[drop.position].tile == 0){
		logger.log("You must select a location with a token.");
		Render();
		return;
	}
	
	gamestate.active.action.drop = drop;
	
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
	var neighbors = GS_Hex_Neighbors(hex.row, hex.col, 0, 1);
//	console.log("Action_Place_Hex", hex, neighbors);
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
		logger.log(GS_ActivePlayerName()+" has attempted to land the mothership without a proper beacon.");
		logger.log(GS_ActivePlayerName()+" has been eliminated from the game!");
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
	logger.log(GS_ActivePlayerName()+" cancelled action.");
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
	if (GS_Nextturn()){
		Action_Start();
	}
}

function End_Elimination(){
	gamestate.phase = "End - Elimination";
	logger.log(GS_ActivePlayerName()+" is the last player remaining.");
	logger.log(GS_ActivePlayerName()+" won the game!");
	Render();
}

function End_Landed(){
	gamestate.phase = "End - Landed";
	logger.log(GS_ActivePlayerName()+" has landed the Mothership.");
	logger.log(GS_ActivePlayerName()+" won the game!");
	Render();
}