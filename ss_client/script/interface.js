var surface_rotation = 0;
var surface_scale = 0.24;

function Interface_Rotate(amt){
	surface_rotation= (surface_rotation+amt)%360;
	Interface_Transform();
}

function Interface_Scale(amt){
	if (surface_scale+amt >= 0.2 && surface_scale+amt <= 1){
		surface_scale = Math.min(Math.max(0.2, surface_scale+amt), 1);
		Interface_Transform();
	}
}

function Interface_Transform(){
	$("#surface").css("-webkit-transform", "rotate("+surface_rotation+"deg) scale("+surface_scale+")");
}

function Interface_KeyProcess(event){
	switch (event.charCode){
		case 13: Interface_DelegateEnter(); break;

		case 45: Interface_Scale(-0.02); break;
		case 61: Interface_Scale(0.02); break;

		case 91: Interface_DelegateCCW(); break;
		case 93: Interface_DelegateCW(); break;

		case 97: $("#menu_button_A").trigger("click"); break;
		case 111: $("#menu_button_O").trigger("click"); break;
		case 117: $("#menu_button_U").trigger("click"); break;
		case 121: $("#menu_button_Y").trigger("click"); break;

		default: console.log(event.charCode); break;
	}
}

function Interface_DelegateCCW(){
	switch (gamestate.phase){
		default:	
			Interface_Rotate(-30); 
		break;	
	}
}

function Interface_DelegateCW(){
	switch (gamestate.phase){
		default:	
			Interface_Rotate(30); 
		break;	
	}
}


function Interface_DelegateEnter(){
	switch (gamestate.phase){
		default:
			console.log("Delegate Enter", gamestate.phase);
		break;
	}
}

function Interface_DropClicked(drop){
	//console.log('Interface_DropClicked', arguments);
	switch (gamestate.phase){
		case "Action - Pull - Drop":
			Action_Pull_Drop(drop);
		break;
		case "Action - Place":
			Action_Place_Drop(drop);
		break;
	}	
}

function Interface_HexClicked(hex){
	//console.log('Interface_HexClicked', arguments);
	switch (gamestate.phase){
		case "Action - Push":
			Action_Push_Token(hex);
		break;
		case "Action - Push - Hex":
			Action_Push_Hex(hex);
		break;
		case "Action - Pull":
			Action_Pull_Token(hex);
		break;
		case "Action - Place - Hex":
			Action_Place_Hex(hex);
		break;
		case "Action - Land":
			Action_Land_Hex(hex);
		break;
	}	
}


document.onkeypress=Interface_KeyProcess;