'use strict';

var container = document.getElementById('container');
var globe = new DAT.Globe(container);
var xmlhttp = new XMLHttpRequest();
var url = "//data.unhcr.org/api/stats/time_series_years.json";
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
url = "//data.unhcr.org/api/stats/country_of_residence.json";
xmlhttp.open("GET", url, true);
xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		country = JSON.parse(this.responseText);
		countrySearch(country);
	}
};
xmlhttp.send();

function yearList(year){
	var x ="", i;
	for (i=0; i<year.length; i++) {
		x = x + "<span id = \"year"+year[i]+"\" class=\"year\">"+year[i]+"</span>";
	}
	document.getElementById("currentInfo").innerHTML = x;
}

function countrySearch(country){
	var x = "<select name=\"countrys\">", i;
	for(i=0; i<country.length; i++){
		x = x + "<option value=\""+country[i].country_of_residence+"\">"+country[i].country_of_residence_en+"</option>";
	}
	x += "</select>"
	document.getElementById("searchBox").innerHTML = x;
	document.getElementById("title").innerHTML = getElementsByName("countrys");
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
			buildGlobe(globe);
        };
    };

    for(var i = 0; i<year.length; i++) {
		var y = document.getElementById('year'+year[i]);
        y.addEventListener('click', settime(i), false);
    }
}

function buildGlobe(globe){
	year = getElementsByClassName("year active");
	country = getElementsByName("countrys").value;
	var data;
	var refugees;
	var point;
	xmlhttp = new XMLHttpRequest();
	url = "//data.unhcr.org/api/stats/time_series.json?year="+year+"&country_of_residence="+country+"&population_type_code=RF";
	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			data = JSON.parse(this.responseText);
			
			var rawFile = new XMLHttpRequest();
			var file = "file://cords.txt"
			var counter = 0;
			var split;
			
			rawFile.open("GET", file, false);
			rawFile.onreadystatechange = function (){
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{
						var allText = (rawFile.responseText).split("\n");
						var line;
						for(var i = 1; i <allText.length; i++){
							for(var j = 0; j < data.length; j++){
								if((allText[i].toUpperCase).contains((data[j].country_of_origin_en).toUpperCase))
								{
									line[counter] = allText[i];
									refugees[counter] = data[j].value;
									counter++;
								}
							}
						}
						counter = 0;
						for(var i =0; line.length >= counter; i+=3){
							split = line[counter].split("\t",2);
							point[i] = split[0];
							point[i+1] = split [1];
							point[i+2] = refugees[counter];
							counter++;
						}					
					}
				}
				
			}
			rawFile.send(null);
		}
	}
	globe.addData(point, {format: 'magnitude'})
	globe.createPoints();
	globe.animate();
}
