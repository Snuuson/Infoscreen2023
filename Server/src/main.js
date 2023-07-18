	var FeiertagsObj = {

	Feiertage: new Array(0,0,0,0,0,0,0),


	};

	function tableToArray(tableName){

		var table = document.getElementById(tableName);
		var myArray = [];
		for(var r = 0;r<table.rows.length;r++){
			myArray[r]= [];
			for(var s = 0;s < table.rows[r].cells.length;s++){
				myArray[r][s] = table.rows[r].cells[s].innerHTML.replace(/&nbsp;/g, ' ');

			}
		}

		return myArray;
	}

	function arrayToTable(array,tableName){

		var table = document.getElementById(tableName);
		for(var r = 0; r<array.length;r++){
			for(var s = 0; s<array[r].length;s++){
				table.rows[r].cells[s].innerHTML = array[r][s].replace(/ /g,'&nbsp;');
			}
		}


	}

	function arrayToTable2(array,tableName){

		var table = document.getElementById(tableName);
		table.innerHTML = "";
		for(var r = 0; r<array.length;r++){
			var tr = document.createElement('TR');
			for(var s = 0; s<array[r].length;s++){
				var td = document.createElement('TD');
				td.innerHTML = array[r][s].replace(/ /g,'&nbsp;');
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}

		setCSSTable2();

	}

	function sendTable(tableArray,tableName){
		jsonTableArray  = JSON.stringify(tableArray);
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log("response = " + xhttp.responseText);

		    }
		  };
		xhttp.open("POST", "updateTable.php", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		console.log(tableName+"=" + jsonTableArray);
		xhttp.send('table'+"=" + jsonTableArray+'&'+'tableName='+tableName);
	}

	function getTable(tableName){

		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
				responseArray= JSON.parse(xhttp.responseText);
				if(tableName == "table2"){
				arrayToTable2(responseArray,tableName);
				}else{
				arrayToTable(responseArray,tableName);
			}

		    }
		  };
		xhttp.open("GET", "getTable.php?tableName="+tableName, true);
		xhttp.send();

	}

	function getLine(lineName){

		var responseArray;
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
				//fillLines(xhttp.responseText,lineName);
				//console.log(xhttp.responseText,lineName);
				//console.log(document.getElementById(lineName));
				document.getElementById(lineName).innerHTML = xhttp.responseText;



		    }
		  };
		xhttp.open("GET", "getLine.php?lineName="+lineName, true);
		xhttp.send();

	}

	function sendLine(lineNumber){
		var line = document.getElementById(lineNumber);
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {

				//console.log("response = " + xhttp.responseText);

		    }
		  };
		xhttp.open("POST", "updateLine.php", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		console.log("line="+line.innerHTML.replace(/&nbsp;/g, ' '));
		xhttp.send("line="+line.innerHTML.replace(/&nbsp;/g, ' ')+"&lineName="+lineNumber);

	}

	function getStatus(){
		var responseArray;
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
				//responseArray= JSON.parse(xhttp.responseText);
				//console.log(xhttp.responseText);
				if(xhttp.responseText == 1){

					sign.innerHTML="BITTE   EINTRETEN";
					sign.style.backgroundColor = 'green';
				}
				else{
					sign.innerHTML="BITTE   WARTEN";
					sign.style.backgroundColor = '#b534d8';
				}


		    }
		  };
		xhttp.open("GET", "getStatus.php", true);
		xhttp.send();
	}

	function setFeiertage(Tag){
		//Fills Feiertage-Array in FeiertagsObj
		// Array[0-5] = Mo-Sa --- array[6] is there atleast 1 Feiertag
		if(Tag != 6){
			if(FeiertagsObj.Feiertage[Tag] == 0){
				FeiertagsObj.Feiertage[Tag] = 1;}
			else{
				FeiertagsObj.Feiertage[Tag] = 0;
			}

			console.log(FeiertagsObj.Feiertage[Tag]);
		}else{
			for(var i = 0;i<FeiertagsObj.Feiertage.length;i++){
				FeiertagsObj.Feiertage[i] = 0;
			}

		}
		FeiertagsObj.Feiertage[6] = 0;
		for(var i = 0;i<FeiertagsObj.Feiertage.length-1;i++){
			if(FeiertagsObj.Feiertage[i]==1){
				FeiertagsObj.Feiertage[6] = 1;
			}
		}
		/*
		if(FeiertagsObj.Feiertage[6] == 1){

			var table = document.getElementById("table2");
			if(table.rows[0].cells.length==3){
				for(var i = 0;i<table.rows.length;i++){
					table.rows[i].insertCell(1);
					table.rows[i].cells[1].innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;-----&nbsp;&nbsp;&nbsp;&nbsp;";
					if(i == 0){
						table.rows[i].cells[1].innerHTML = "";
					}

				}
			}
		}else if(FeiertagsObj.Feiertage[6] == 0){
			var table = document.getElementById("table2");
			if(table.rows[0].cells.length==4){
				console.log("hi");
				for(var i = 0;i<table.rows.length;i++){
					table.rows[i].deleteCell(1);
				}
			}
		}*/
		setCSSTable2();
	}

	function setCSSTable2(){
		var table = document.getElementById("table2");
		for(var i = 0;i<table.rows.length;i++){
			table.rows[i].cells[0].setAttribute("class","grey");
		}
		for(var i = 1;i<table.rows[0].cells.length;i++){
			table.rows[0].cells[i].setAttribute("class","grey");
		}

		for(var i = 1;i<table.rows.length;i++){
			for(var j = 1;j<table.rows[0].cells.length;j++){
			table.rows[i].cells[j].setAttribute("class","cursive");
			}
		}

		for(var i = 1;i<table.rows.length;i++){
			if(FeiertagsObj.Feiertage[i-1] == 1){
				table.rows[i].cells[0].style.color = '#e65c00';
				table.rows[i].cells[0].style.fontWeight = 'bold';
			}else{
				table.rows[i].cells[0].style.color = 'black';
				table.rows[i].cells[0].style.fontWeight = 'normal';
			}
		}

	}

	function sendFeiertagsObj(){

		var FeiertageString = JSON.stringify(FeiertagsObj);

		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log("response = " + xhttp.responseText);
		    }
		  };
		xhttp.open("POST", "updateFeiertage.php", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		console.log("Feiertage = " + JSON.stringify(FeiertagsObj));
		xhttp.send("FeiertageObj=" + FeiertageString);

	}

	function getFeiertagsObj(){

		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log("FEIERTAGE OBJECT = " + JSON.parse(xhttp.responseText));
				FeiertagsObj = JSON.parse(xhttp.responseText);
				setCSSTable2();
		    }
		  };
		xhttp.open("GET", "getFeiertage.php", true);
		xhttp.send();
	}
