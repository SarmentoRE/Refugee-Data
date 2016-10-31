'use strict';

var container = document.getElementById('container');
var globe = new DAT.Globe(container);
var xmlhttp = new XMLHttpRequest();
var url = "//data.unhcr.org/api/stats/time_series_years.json";
var year;
var country;

xmlhttp.open('GET', url, true);
xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		year = JSON.parse(this.responseText);
		yearList(year);
		yearSelect(year)
		globe.animate();
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
	buildGlobe(globe);
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
		buildGlobe(globe);
    };

    for(var i = 0; i<year.length; i++) {
		var y = document.getElementById('year'+year[i]);
        y.addEventListener('click', settime(i), false);
    }
}

function buildGlobe(globe){
	globe.reset();
	year = document.getElementsByClassName("year active").value;
	if (document.getElementById("searchBox").selectedIndex == null){
		country = "Afghanistan";
	}
	else{
		country = document.getElementById("searchBox").selectedIndex.value;
	}
	if(year == null){
		year = "2000";
	}
	var data;
	var refugees;
	var point = {series : []};
	var test;
	var file = "cords.json";
	var counter = 0;
	var split;
	xmlhttp = new XMLHttpRequest();
	console.log(year+"    "+country);
	url = "//data.unhcr.org/api/stats/time_series.json?year="+year+"&country_of_residence="+country+"&population_type_code=RF";
	xmlhttp.open("GET", url, true);
	console.log(file);
	xmlhttp.onreadystatechange = function() { console.log(this.readyState);
		if(this.readyState == 4 && this.status == 200) {
			data = JSON.parse(this.responseText);
			var rawFile = new XMLHttpRequest();
			
			rawFile.open("GET", file, false);
			rawFile.onreadystatechange = function (){
				console.log(file);
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status === 0)
					{
						var allText = JSON.parse(rawFile.responseText);
						var originCords = [];
						for(var i = 1; i <allText.length; i++){
							for(var j = 0; j < data.length; j++){
								if((allText[i].cord).contains(data[j].country_of_origin_en))
								{
									split = (allText[i].cord).split("\t",2);
									originCords = originCords.concat(split);
									refugees[counter] = data[j].value;
									counter++;
								}
							}
						}
						
						counter = 0;
						for(var i =0; i<originCords.length+refugees.length; i+=3){
							console.log("Point"+point.series[i]);
							console.log("refugees"+refugees[Math.floor(counter/2)]);
							if((refugees[Math.floor(counter/2)]) != null){
								point.series[i] = originCords[counter];
								point.series[i+1] = originCords[counter+1];
								point.series[i+2] = refugees[Math.floor(counter/2)];
								console.log(point.series[i]);
							}
							counter+=2;
						}
						window.data = point;
						globe.addData(point.series, {format: 'magnitude'});
						globe.createPoints();
						globe.animate();
						document.body.style.backgroundImage = 'none';
					}
				}
				
			}
			rawFile.send(null);
			xmlhttp.send();
		}
	}
}
