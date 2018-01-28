"use strict";

$(document).ready(function (){

	function populate_tests(tests) {
		/**
		tests=[
	      {
	        "name": str,
	        "description": str,
	        "ptsPossible": int,
	        "ptsEarned": int,
	        "memory": int,
	        "time": int,
	        "log": str,
	       },
	    ... */
	    const test_class = $('#tests');
	    test_class.empty();
	    test_class.append("<div class='row'><div class='col-sm-6 col-xs-8'> \
	    	<h4 class='test-table-title'>Name</h4></div>\
	    	<div class='col-sm-6 col-xs-4' style='text-align:right;'><h4 class='test-table-title'>Score</h4></div></div>");
	    for (var i = 0; i < tests.length; ++i) {
	    	const test = tests[i];
	    	var cls = "test-fail";
	    	if (test["ptsPossible"] >= test["ptsEarned"]) {
	    		cls = "test-success";
	    	}
	    	const score = "(" + test["ptsPossible"] + "/" + test["ptsEarned"] + ")"
	    	var h4 = $('<h4></h4>');
	    	h4.html(test["name"]);
	    	const test_name = $("<div class='col-sm-6 col-xs-8'></div>");
	    	test_name.append(h4);

	    	h4 = $('<h4></h4>');
	    	h4.html(score);
	    	const score_div = $("<div class='col-sm-6 col-xs-4'></div>");
	    	score_div.addClass(cls);
	    	score_div.append(h4);

	    	const wrapper = $("<div class='test-class'></div>");
	    	wrapper.append(test_name);
	    	wrapper.append(score_div);


	    	const drawer = $("<div class='container-fluid'><div class='row'><div class='col-sm-12'>\
	    		<div class='test-drawer'></div></div></div></div>")
	    	drawer.addClass('hidden');

	    	const description = $('<h4></h4>');
	    	description.html('Description:<p>'+test['description'] + "</p>");

	    	const output = $('<div class="highlighter-rouge"><div class="highlight">\
	    		<pre class="highlight" style="white-space:pre-wrap; overflow-y: scroll; overflow-x:hidden; height: 300px;">\
	    		<code style="color:white;font-family:monospace;">'+test['log']+'</code></pre></div></div>');
	    	drawer.append(description);
	    	drawer.append(output);

	    	const row = $("<div class='row'></div>");

			row.append(wrapper);
	    	row.append(drawer);

	    	wrapper.click(function() {
	    		if (drawer.hasClass('hidden')) {
	    			drawer.show('slide', {direction: 'down', easing: 'easeOutBounce'}, 200)
	    		} else {
	    			drawer.hide('slide', {direction: 'up', easing: 'easeOutBounce'}, 50)
	    		}
	    		drawer.toggleClass('hidden')
	    	});

	    	test_class.append(row);
	    }
	    $('.test-drawer').hide();
	}

	function update_page(ag_run) {
		populate_tests(ag_run["testcases"]);
		$("#timestamp").empty();
		$("#timestamp").text(ag_run["timestamp"]);

		var scored = 0;
		var total = 0;
		for(var i = 0; i < ag_run["testcases"].length; ++i) {
			const test = ag_run["testcases"][i];
			scored += test["ptsPossible"];
			total += test["ptsEarned"];
		}

		$("#total_score").text(""+scored);
		$("#total_points").text(""+total);
		const files = ag_run["checksum"].split("\n");
		const new_hashes = files.map(function (e){
			const split = e.split(" ");
			split[0] = split[0].slice(0, 7);
			return split.join(" ");
		}).join("\n");
		$('#sha1').text(""+new_hashes);
		$("#time").text(ag_run["timestamp"]);

		const revision = $('#revision');
		revision.empty();
		const link = $('<a class="fancy-link"></a>');
		link.attr('href', './?p='+ag_run["revision"]);
		link.text(ag_run["revision"]);
		revision.append(link);

	}

	function add_nav_stamps(runs) {
		for(var i = 0; i < runs.length; ++i) {
			const link = $('<a class="navbar-link"></a>');
			link.text(runs[i]["timestamp"]);
			link.click(function(run) {
				return function (event) {
					event.preventDefault();
					update_page(run);
				}}(runs[i]));
			const elem = $('<li></li>');
			elem.append(link);

			$('#nav-list').append(elem);
		}
	}

	/* Use ?v=... so that the browser cache gets busted
	meaning that results.json is a forced update everytime
	this will reduce issues where people see cached reports */

	$.get( "./results.json?v="+(new Date()).getTime(), function(data) {
		data.sort(function(a, b){
			const a_date = new Date(a['timestamp'].replace(" ", "T"));
			const b_date = new Date(b['timestamp'].replace(" ", "T"));
			const a_time = a_date.getTime();
			const b_time = b_date.getTime();
			if (a_time < b_time) {
				return -1;
			} else if (a_time > b_time) {
				return 1;
			}
			return 0;
		});
		add_nav_stamps(data);
		const latest = data[data.length-1];
		update_page(latest);
	})
	.fail(function(err) {
		const status = err.status;
		if (status >= 400 && status <= 499) {
			$('#client_error').removeClass('hidden');
		} else if (status >= 500) {
			$('#server_error').removeClass('hidden');
		} else {
			$('#offline').removeClass('hidden');
		}
		$('#main').addClass('hidden');
	});

});
