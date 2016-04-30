
function parse_date(array) {
	// [year, month, day, hour, minutes, seconds]
	// parses a date array into unix time stamp in milliseconds or false
	if( array == undefined || array == false )
		return false;
	else
		// month is zero based - for some strange reason
		return (new Date(array[0], array[1]-1, array[2], array[3], array[4], array[5], 00)).getTime();
}

function parse_config(json) {
	// parses the config
	console.log(json);
	config = {
		"start": parse_date(json.start),
		"end": parse_date(json.end),
		"critical_time": json.critical_time,
		"goal_time": json.goal_time,
		"goal_critical": json.goal_critical,
		"goals": {}
	}
	for(var goal_name in json.goals) {
		config.goals[goal_name] = parse_date(json.goals[goal_name]);
	}
}

function calc_diff(diff) {
	// calculates an array with [hours, minutes, seconds, milliseconds] from a unix timestamp diff

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
	// returns a string representation of the returned array from calc_diff
	return (diff[0]>100 ? diff[0] : ("0"+diff[0]).slice(-2)) + ":" + ("0"+diff[1]).slice(-2) + ":" + ("0"+diff[2]).slice(-2);
}

function date2text(date) {
	// returns a string representation of a javascript date object
	return date.getFullYear() +"-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" + ("0"+date.getDate()).slice(-2) + " " + ("0"+date.getHours()).slice(-2) + ":" + ("0"+date.getMinutes()).slice(-2) + ":" + ("0"+date.getSeconds()).slice(-2);
}

function refresh_countdown() {
	// does the actual heavy lifting ;)
	
	var now = (new Date()).getTime();
	// if current date is before the start, count time until start
	if( config.start != false && now < config.start )
		aim = config.start;
	else 
		aim = config.end;
	
	var main_diff = aim - now;
	var countdown = calc_diff(main_diff);
	$(".main > .clock").text(diff2text(countdown));
	// check if time is critical
	if( aim == config.end ) {
	       if( main_diff <= config.critical_time*1000 )
			$(".main > .clock").removeClass("warmup").addClass("critical");
		else
			$(".main > .clock").removeClass("critical warmup");

		$(".main > .text").text("Until " + date2text(new Date(aim)));
	}
	else if( aim == config.start ) {
		$(".main > .clock").addClass("warmup");
		$(".main > .text").text("Until start@" + date2text(new Date(aim)));
	}

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
	// set intervall/timer
	window.setInterval(refresh_countdown, 200);
	// update countdown imediatly
	refresh_countdown()
});

