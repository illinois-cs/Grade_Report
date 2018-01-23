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
	    test_class.append("<div class='row'><div class='col-sm-6 col-xs-6'> \
	    	<h4 class='test-table-title'>Name</h4></div>\
	    	<div class='col-sm-6 col-xs-6'><h4 class='test-table-title'>Score</h4></div></div>");
	    for (var i = 0; i < tests.length; ++i) {
	    	const test = tests[i];
	    	var cls = "test-fail";
	    	if (test["ptsPossible"] === test["ptsEarned"]) {
	    		cls = "test-success";
	    	}
	    	const score = "(" + test["ptsPossible"] + "/" + test["ptsEarned"] + ")"
	    	var h4 = $('<h4></h4>');
	    	h4.html(test["name"]);
	    	const test_name = $("<div class='col-sm-6 col-xs-6'></div>");
	    	test_name.append(h4);

	    	h4 = $('<h4></h4>');
	    	h4.html(score);
	    	const score_div = $("<div class='col-sm-6 col-xs-6'></div>");
	    	score_div.addClass(cls);
	    	score_div.append(h4);

	    	const wrapper = $("<div class='test-class'></div>");
	    	wrapper.append(test_name);
	    	wrapper.append(score_div);


	    	const drawer = $("<div class='container-fluid'><div class='row'><div class='col-sm-12'>\
	    		<div class='test-drawer'></div></div></div></div>")
	    	drawer.addClass('hidden');

	    	const description = $('<h4></h4>');
	    	description.text('Description '+test['description']);

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
		$('#sha1').text(""+ag_run["checksum"])
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
		add_nav_stamps(data);
		const latest = data.reduce(function(acc, cur) {
			if (acc["revision"] < cur["revision"]) {
				return cur;
			} else {
				return acc;
			}
		});
		update_page(latest);
	})
	.fail(function() {
		$('#error').removeClass('hidden');
		$('#main').addClass('hidden');
	});

});