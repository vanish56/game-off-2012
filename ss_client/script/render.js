function Render(){
	Render_Board(gamestate.board);
	Render_Stats(gamestate);
	Render_Log(gamestate.log)
	Render_Menu(gamestate.phase);
	Render_Players(gamestate.players);
}

function Render_Board(board){
	//console.log("Render_Board", arguments);
	var node = $('#board');
	if (node.length == 0){
		node = $('<div id="board"></div>');
		var x = (Object.keys(board.hexes).length*220+80);//-(Object.keys(board.hexes).length*20);
		var y = (Object.keys(board.hexes).length*260+130);
		$(node).css({ 'width':x+'px', 'height':y+'px', 'top':(-y/2)+'px', 'left':(-x/2)+'px'});
		$("#surface").append(node);
	}
	Render_Drops(board.drops);
	Render_Board_Hexes(board.hexes);
}

function Render_Drops(drops){
	var node = $('#drops');
	if (node.length == 0){
		node = $('<div id="drops"></div>');
		var x = $('#board').position().left;
		//var y = $('#board').position().top;
		var height = drops.length*260/2;
		//var x = (Object.keys(board.hexes).length*220+80);
		//var y = (Object.keys(board.hexes).length*260+130);
		$(node).css({ 'width':(height+500)+'px', 'height':height+'px', 'top':(-height/2)+'px', 'left':(x-300)+'px'});
		$("#surface").append(node);
	}
	for(var p = 0; p < drops.length; p++){
		Render_Drop(drops[p], p);
	}
}

function Render_Drop(drop, p){
	var nodeName = 'drops_'+p;
	var node = $('#'+nodeName);
	if (node.length == 0){
		node = $('<div id="'+nodeName+'" class="drop">'+String.fromCharCode(65 + p)+'</div>');
		$(node).css({ 'width':'300px', 'height':'260px', 'top':(Math.floor(p/2)*260)+'px' });
		if (p%2){
			$(node).css({ 'right':'0px'});
		} else {
			$(node).css({ 'left':'0px'});
		}
		$(node).click(function(){ Interface_DropClicked( { 'position': p } ); });
		$("#drops").append(node);
	}
	
	var tname = 'drop_'+p+'_tile';
	if (drop.tile == 1){
		var tile = $('#'+tname)
		if (tile.length == 0){
			tile = $('<div id="'+tname+'" class="tile"></div>');
			$(node).append(tile);
		}
		if (gamestate.active.action && gamestate.active.action.drop && gamestate.active.action.drop.position == p){
			$(tile).addClass('saved');
		} else {
			$(tile).removeClass('saved');
		}
	} else {
		$('#'+tname).remove();
		
		if (gamestate.active.action && gamestate.active.action.token){
			$(node).addClass('choose');
		} else {
			$(node).removeClass('choose');
		}
	}
}

function Render_Board_Hexes(hexes){
	//console.log("Render_Board_Hexes", arguments);
	$("div").removeClass("neighbor");
	$("div").removeClass("blocked");
	
	for (var row in hexes){
		for (var col in hexes[row]){
			Render_Board_Hex(hexes[row][col], row, col)	
		}	
	}
	
	if (gamestate.active.action && gamestate.active.action.token){
		Render_Mark_Neighbors(gamestate.active.action.token.row, gamestate.active.action.token.col, 0, 1, function(r,c){
			var hname = 'hex_'+r+'_'+c;
			$('#'+hname).addClass("neighbor");
		});
	}
	
	if (gamestate.phase == "Action - Land"){
		Render_Mark_LandingZones(function(r,c){
			var hname = 'hex_'+r+'_'+c;
			$('#'+hname).addClass("neighbor");
		});
	}
	
	if (gamestate.phase == "Action - Place - Hex"){
		Render_Mark_BlockedZones(function(r,c){
			var hname = 'hex_'+r+'_'+c;
			$('#'+hname).addClass("blocked");
		});
	}
	/* 
	// TODO
	// 1.) Does not work properly
	// 2.) The idea is to show only legal spots, but this usually results in too many highlights to be of use
	if (gamestate.active.action && gamestate.active.action.drop){
		for (var row in hexes){
			for (var col in hexes[row]){	
				console.log("Render_Mark_Neighbors", row, col);
				Render_Mark_Neighbors(row, col, 1, 0, function(r,c){
					var hname = 'hex_'+r+'_'+c;
					$('#'+hname).addClass("neighbor");
				});
			}
		}
	}
	*/
}

function Render_Board_Hex(hItem, row, col){
	var hname = 'hex_'+row+'_'+col;
	var hex = $('#'+hname)
	if (hex.length == 0){
		hex = $('<div id="'+hname+'" class="hex">'+row+','+col+'</div>');
		var x = (row*220);
		var y = (col*260+(row%2*130));
		$(hex).css({ 'top': y+'px', 'left': x+'px' });
		$("#board").append(hex);
		$(hex).click(function(){ Interface_HexClicked( { 'row': row, 'col': col } ); });
	}
	
							
	var tname = 'hex_'+row+'_'+col+'_tile';
	if (hItem.tile == 1){
		var tile = $('#'+tname)
		if (tile.length == 0){
			tile = $('<div id="'+tname+'" class="tile"></div>');
			$(hex).append(tile);
		}
		if (gamestate.active.action && gamestate.active.action.token && gamestate.active.action.token.row == row && gamestate.active.action.token.col == col){
			$(tile).addClass('saved');
		} else {
			$(tile).removeClass('saved');
		}
	} else {
		$('#'+tname).remove();
	}
}

function Render_Players(players){
	//console.log("Render_Players", arguments);
	var node = $('#players');
	if (node.length == 0){
		node = $('<div id="players"></div>');
		$('#stats').append(node);
	}
	for (var p in players){
		Render_Players_Player(players[p], node);
	}
}

function Render_Players_Player(player, container){
	var nodeName = "player_"+player.position;
	var node = $('#'+nodeName);
	if (node.length == 0){
		node = $('<div id="'+nodeName+'" class="player"><div class="player_indicator"></div>'+player.name+'</div>');
		$(node).addClass("color_"+player.color);
		$(container).append(node);
	}
	if (player.position==gamestate.active.playerIndex){
		$(node).addClass('active');
	} else {
		$(node).removeClass('active');
	}
	if (player.eliminated==1){
		$(node).addClass('eliminated');
	} else {
		$(node).removeClass('eliminated');
	}
}

function Render_Stats(gamestate){
	//console.log("Render_Stats", arguments);
	var node = $('#stats');
	if (node.length == 0){
		node = $('<div id="stats"></div>');
		$('body').append(node);
	}
}

function Render_Mark_Neighbors(row, col, filled, empty, func){
	if (!func) { return; }
	var neighbors = GS_Hex_Neighbors(row, col, filled, empty);
	for(var n = 0; n < neighbors.length; n++){
		func(neighbors[n].row, neighbors[n].col);
	}
}

function Render_Mark_LandingZones(func){
	if (!func) { return; }
	var lzs = GS_LandingZones();
	for (var lz = 0; lz < lzs.length; lz++){
		func(lzs[lz].row, lzs[lz].col);
	}
}

function Render_Mark_BlockedZones(func){
	if (!func) { return; }
	var lzs = GS_OpenHexes();
	for (var lz = 0; lz < lzs.length; lz++){
		func(lzs[lz].row, lzs[lz].col);
	}
}

function Render_Menu(phase){
	//console.log("Render_Menu", arguments);
	var node = $('#menu');
	if (node.length == 0){
		node = $('<div id="menu"></div>');
		$('body').append(node);
	}
	if ($("#menu").attr('title') != phase){
		$("#menu").empty();
		$("#menu").attr('title', phase);
		$('body').removeClass();
	}
	switch(phase){
		case "Action": Render_Menu_Action(); break;
		
		case "Action - Push": Render_Menu_Action_Push(); break;
		case "Action - Push - Hex": Render_Menu_Action_Push_Hex(); break;
		
		case "Action - Pull": Render_Menu_Action_Pull(); break;
		case "Action - Pull - Drop": Render_Menu_Action_Pull_Drop(); break;
		
		case "Action - Place": Render_Menu_Action_Place(); break;
		case "Action - Place - Hex": Render_Menu_Action_Place_Hex(); break;
		
		case "Action - Land": Render_Menu_Action_Land(); break;
	}
}

function Render_Menu_Action(){
	Render_Menu_Button("O", "Push", $("#menu"), function(){ Action_Push(); });
	Render_Menu_Button("U", "Pull", $("#menu"), function(){ Action_Pull(); });
	Render_Menu_Button("Y", "Place", $("#menu"), function(){ Action_Place(); });
	Render_Menu_Button("A", "Land The Mothership!", $("#menu"), function(){ Action_Land(); });
}

function Render_Menu_Action_Push(){
	//console.log("Render_Menu_Action_Push", arguments);

	$('body').addClass("selecttile");	
	Render_Menu_Button("O", "Cancel", $("#menu"), function(){ Action_Cancel(); });
	Render_Menu_Button('MSG', 'Click on a token to push.',  $("#menu"));
}

function Render_Menu_Action_Push_Hex(){
	//console.log("Render_Menu_Action_Push_Hex", arguments);

	$('body').addClass("selecthex");	
	Render_Menu_Button("O", "Cancel", $("#menu"), function(){ Action_Cancel(); });
	Render_Menu_Button('MSG', 'Click on a neighboring destination hex.',  $("#menu"));
}

function Render_Menu_Action_Pull(){
	//console.log("Render_Menu_Action_Push", arguments);

	$('body').addClass("selecttile");	
	Render_Menu_Button("O", "Cancel", $("#menu"), function(){ Action_Cancel(); });
	Render_Menu_Button('MSG', 'Click on a token to pull.',  $("#menu"));
}

function Render_Menu_Action_Pull_Drop(){
	//console.log("Render_Menu_Action_Push_Hex", arguments);

	$('body').addClass("selectdrop");	
	Render_Menu_Button("O", "Cancel", $("#menu"), function(){ Action_Cancel(); });
	Render_Menu_Button('MSG', 'Click on a drop.',  $("#menu"));
}

function Render_Menu_Action_Place(){
	//console.log("Render_Menu_Action_Push", arguments);

	$('body').addClass("selectdroptile");	
	Render_Menu_Button("O", "Cancel", $("#menu"), function(){ Action_Cancel(); });
	Render_Menu_Button('MSG', 'Click on a token in a drop to place.',  $("#menu"));
}

function Render_Menu_Action_Place_Hex(){
	//console.log("Render_Menu_Action_Push_Hex", arguments);

	$('body').addClass("selecthex");	
	Render_Menu_Button("O", "Cancel", $("#menu"), function(){ Action_Cancel(); });
	Render_Menu_Button('MSG', 'Click on a hex neighboring a token.',  $("#menu"));
}

function Render_Menu_Action_Land(){
	//console.log("Render_Menu_Action_Push_Hex", arguments);

	$('body').addClass("selecthex");	
	Render_Menu_Button("O", "Cancel", $("#menu"), function(){ Action_Cancel(); });
	Render_Menu_Button('MSG', 'Click on a hex surrounded by empty locations.',  $("#menu"));
}


function Render_Menu_Button(buttonType, str, menuNode, func){
	var nodeName = "menu_button_"+buttonType;
	var node = $("#"+nodeName);
	if (node.length == 0){
		node = $('<div id="'+nodeName+'" class="menu_button"></div>');
		$(menuNode).append(node);
	}
	$(node).empty();
	$(node).append($("<div><span>"+buttonType+"</span>"+str+"</div>"));
	if (func){
		$(node).click(func);
	}
}

function Render_Log(log){
	var nodeName = "log";
	var node = $("#"+nodeName);
	if (node.length == 0){
		node = $('<div id="'+nodeName+'"></div>');
		$("body").append(node);
	}
	
	for (var i = 0; i < log.length; i++){
		var logEntryNodeName = "log_"+i;
		var logEntryNode = $("#"+logEntryNodeName);
		if (logEntryNode.length == 0){
			var output = log[i];
			for (p in gamestate.players){
				output = output.replace(gamestate.players[p].name, '<span class="color_'+gamestate.players[p].color+'">'+gamestate.players[p].name+'</span>');
			}
			logEntryNode = $('<div id="'+logEntryNodeName+'">'+output+'</div>');
			$(node).prepend(logEntryNode);
		}
	}
}

function PolarToRect(c){
	return { "x": (c.r)*Math.cos(c.q), "y": (c.r)*Math.sin(c.q) };
}