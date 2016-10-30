'use strict';

var container = document.getElementById('container');
var globe = new DAT.Globe(container);
var xmlhttp = new XMLHttpRequest();
var url = "data.unhcr.org/api/stats/time_series_years.json";
var year;
var country;

xmlhttp.open("GET", url, true);
xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		year = JSON.parse(this.responseText);
		yearList(year);
		yearSelect(year)
	}
};
xmlhttp.send();

xmlhttp = new XMLHttpRequest();
url = "data.unhcr.org/api/stats/country_of_residence.json";
xmlhttp.open("GET", url, true);
xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		country = JSON.parse(this.responseText);
		countrySearch(country);
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

function countrySearch(country){
	var x = "", i;
	for(i=0; i<country.length; i++){
		x = x + "<option value=\""+country[i].country_of_residence_en+"\">";
	}
	document.getElementById("countrys").innerHTML = x;
}

function yearSelect(year){
	var settime = function(t) {
        return function() {
			var y = document.getElementById('year'+year[t]);
			if (y.getAttribute('class') === 'year active') {
				return;
			}
			var yy = document.getElementsByClassName('year');
			for(i=0; i<yy.length; i++) {
				yy[i].setAttribute('class','year');
			}
			y.setAttribute('class', 'year active');
        };
    };

    for(var i = 0; i<year.length; i++) {
		var y = document.getElementById('year'+year[i]);
        y.addEventListener('click', settime(i), false);
    }
}
