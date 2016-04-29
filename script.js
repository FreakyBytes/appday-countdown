
var config = {}

function parse_date(array) {
	if( array == undefined || array == false )
		return false;
	else
		return Date(array[0], array[1], array[2], array[3], array[4], array[5]).getTime();
}

function parse_config() {
	console.log($("#jsonConfig").text());
	var json = JSON.parse($("#jsonConfig").html());
	console.log(json);
	config = {
		"start": parse_date(json.start),
		"end": parse_date(json.end),
		"goal_time": json.goal_time,
		"goals": {}
	}
	for(var goal_name in json.goals) {
		config.goals[goal_name] = parse_date(json.goals[goal_name]);
	}
}

function date_diff(now, date) {
	var diff = date - now;
	// do not return negative numbers
	if( diff <= 0 )
		return [0, 0, 0, 0];
	// hours, minutes, seconds, milliseconds
	return [
		Math.floor(diff/3600000),
		Math.floor((diff % 3600000)/60000),
		Math.floor((diff % 60000)/1000),
		Math.floor(diff % 1000)
	];
}

function refresh_countdown() {
	var now = Date().getTime();
	// if current date is before the start, set start date as "now"
	if( config.start != false && now < config.start )
		now = config.start;
	
	countdown = date_diff(now, config.end);
	$(".main > .clock").text(countdown[0]+":"+countdown[1]+":"+countdown[2]);
}

$(document).ready(function () {
	parse_config();
	window.setInterval(refresh_countdown, 1000);
});

