
//var config = {}
var config = {
	"start": parse_date([2016, 04, 29, 10, 00, 00]),
	"end": parse_date([2016, 04, 30, 10, 26, 00]),
	"critical_time": 1800,
	"goal_time": 600,
	"goal_critical": 60,
	"goals": {
		"Goal #1": parse_date([2016, 04, 30, 01, 34, 00]),
		"Goal blablabal 2": parse_date([2016, 04, 30, 01, 50, 00]),
		"Goal #3": parse_date([2016, 04, 30, 03, 00, 00])
	}
}

function parse_date(array) {
	if( array == undefined || array == false )
		return false;
	else
		// month is zero based - for some strange reason
		return (new Date(array[0], array[1]-1, array[2], array[3], array[4], array[5], 00)).getTime();
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

function calc_diff(diff) {
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

function diff2text(diff) {
	return ("0"+diff[0]).slice(-2) + ":" + ("0"+diff[1]).slice(-2) + ":" + ("0"+diff[2]).slice(-2);
}

function refresh_countdown() {
	var now = (new Date()).getTime();
	// if current date is before the start, set start date as "now"
	if( config.start != false && now < config.start && false)
		now = config.start;
	
	var main_diff = config.end - now;
	var countdown = calc_diff(main_diff);
	$(".main > .clock").text(diff2text(countdown));
	// check if time is critical
	if( main_diff <= config.critical_time*1000 )
		$(".main > .clock").addClass("critical");
	else
		$(".main > .critical").removeClass("critical");

	// find next goal
	var goal_name = "";
	var goal_time = 0;
	var goal_diff = 0;
	var found = false;
	for( goal_name in config.goals ) {
		goal_time = config.goals[goal_name];
		var goal_diff = goal_time - now;
		if( goal_time >= now-1500 && goal_diff <= config.goal_time*1000 ) {
			// goal is in the future, but not too far away.
			found = true;
			break;	
		}
	}
	if( found ) {
		var goal_countdown = calc_diff(goal_diff);
		$(".goal > .clock").text(diff2text(goal_countdown));
		$(".goal > .text").text("Until " + goal_name);
		if( goal_diff <= config.goal_critical*1000 )
			$(".goal > .clock").addClass("critical");
		else
			$(".goal > .critical").removeClass("critical");
		$(".goal").show();
	}
	else
		$(".goal").hide();


}

$(document).ready(function () {
	//parse_config();
	window.setInterval(refresh_countdown, 200);
	// update countdown
	refresh_countdown()
	// display end time
	end = new Date(config.end);
	$(".main > .text").html("Until " + end.getFullYear() +"-" + ("0"+(end.getMonth()+1)).slice(-2) + "-" + ("0"+end.getDate()).slice(-2) + " " + ("0"+end.getHours()).slice(-2) + ":" + ("0"+end.getMinutes()).slice(-2) + ":" + ("0"+end.getSeconds()).slice(-2));
});

