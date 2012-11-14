function Render(){
	Render_Board(gamestate.board);
	Render_Stats(gamestate);
	RenderLog(gamestate.log)
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
	Render_Board_Hexes(board.hexes);
	$("div").removeClass("neighbor");
	if (gamestate.active.action && gamestate.active.action.token){
		Render_Mark_Neighbor(gamestate.active.action.token.row, gamestate.active.action.token.col, 0, function(r,c){
			var hname = 'hex_'+r+'_'+c;
			$('#'+hname).addClass("neighbor");
		});
	}
	
	RenderDrops(board.drops);
}

function RenderDrops(drops){
	var node = $('#drops');
	if (node.length == 0){
		node = $('<div id="drops"></div>');
		var x = $('#board').position().left;
		//var y = $('#board').position().top;
		var height = drops.length*260;
		//var x = (Object.keys(board.hexes).length*220+80);
		//var y = (Object.keys(board.hexes).length*260+130);
		$(node).css({ 'width':'300px', 'height':height+'px', 'top':(-height/2)+'px', 'left':(-x+20)+'px'});
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
		$(node).css({ 'width':'300px', 'height':'260px', 'top':(p*260)+'px', 'left':'0px'});
		$("#drops").append(node);
	}
	var tname = 'drop_'+p+'_tile';
	if (drop.tile == 1){
		var tile = $('#'+tname)
		if (tile.length == 0){
			tile = $('<div id="'+tname+'" class="tile"></div>');
			$(node).append(tile);
			$(drop).click(function(){ Interface_DropClicked( { 'position': p } ); });
		}
	} else {
		$('#'+tname).remove();
	}}

function Render_Board_Hexes(hexes){
	//console.log("Render_Board_Hexes", arguments);
	for (var row in hexes){
		for (var col in hexes[row]){
			Render_Board_Hex(hexes[row][col], row, col)	
		}	
	}
}

function Render_Mark_Neighbor(row, col, showFilled, func){
	if (!func) return;
	var neighbors = Gamestate_Hex_Neighbors(row, col, showFilled);
	for(var n = 0; n < neighbors.length; n++){
		func(neighbors[n].row, neighbors[n].col);
	}
}

function Render_Board_Hex(hItem, row, col){
	var hname = 'hex_'+row+'_'+col;
	var hex = $('#'+hname)
	if (hex.length == 0){
		hex = $('<div id="'+hname+'" class="hex"></div>');
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
}

function Render_Stats(gamestate){
	//console.log("Render_Stats", arguments);
	var node = $('#stats');
	if (node.length == 0){
		node = $('<div id="stats"></div>');
		$('body').append(node);
	}
}

function Render_Menu(phase){
	//console.log("Render_Menu", arguments);
	console.log()
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
		case "Action - Pull - Drop": Render_Menu_Action_Pull_Hex(); break;
		
		case "Action - Place": Render_Menu_Action_Place(); break;
		case "Action - Place - Hex": Render_Menu_Action_Place_Hex(); break;
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

function RenderLog(log){
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
			logEntryNode = $('<div id="'+logEntryNodeName+'">'+log[i]+'</div>');
			$(node).prepend(logEntryNode);
		}
	}
}

function PolarToRect(c){
	return { "x": (c.r)*Math.cos(c.q), "y": (c.r)*Math.sin(c.q) };
}