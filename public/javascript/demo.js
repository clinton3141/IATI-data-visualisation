var data = [
		[1, 10, 15, 2, 5],
		[2, 15, 3, 14, 0],
		[15, 5, 5, 8, 10]
	],
	width = 500,
	height = 400,
	x = d3.scale.linear().range ([0, width]),
	y = d3.scale.linear().range ([0, height]);

var visualisation = d3.select("visualisation").append ("svg:svg")
	.attr("width", width)
	.attr("height", height);

visualisation.selectAll("svg:rect")
	.data(data[0])
		.enter()
		.append("svg:rect")
		.attr("x", x)
		.attr("y", y)
		.attr("height", function (d) { return data[0][d]; })
		.attr("fill", "red");
