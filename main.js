'use strict';

var container = document.getElementById('container');
var globe = new DAT.Globe(container);
var xmlhttp = new XMLHttpRequest();
var url = "//data.unhcr.org/api/stats/time_series_years.json";
var year;

xmlhttp.open("GET", url, true);
xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		year = JSON.parse(this.responseText);
		yearList(year);
	}
};
xmlhttp.send();

function yearList(year){
	var x ="<span id = \"yearAll\" class=\"year\">All</span>", i;
	for (i=0; i<year.length; i++) {
		x = x + "<span id = \"year"+year[i]+"\" class=\"year\">"+year[i]+"</span>";
	}
	document.getElementById("currentInfo").innerHTML = x;
}