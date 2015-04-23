
//takes a synaptic network in json format, injects it into a sigma graph
Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}
function netToGraph(JSONnetwork, sigma) {
	sigma.graph.clear()
	var s = sigma
	var pJson = JSONnetwork

	var lastLayer = 0
	var layer = 0
	pJson.neurons.forEach(function(e, i) {
		var color = "#000"
		var prevLayer = layer
		if (e.layer == "input") {
			layer = 0
			color = "#00d"
		}
		else if (e.layer == "output") {
			layer = lastLayer + 1
			color = "#d00"
		}
		else {
			layer = Number(e.layer) + 1
			
		}
		if (prevLayer != layer) {
			lastLayer++
		}
		s.graph.addNode({
			id: "neuron" + i,
			label: "L." + e.layer + ", B: " + Math.round(e.bias),
			layer: layer,
			x: 0,
			y: 0,
			size: 1,
			color: color
		})
	})

	pJson.connections.forEach(function(e, i, arr) {
		var weight = 0;
		var color = "#000"
		if (e.weight < 0) {
			weight = Math.abs(e.weight)
			color = "#f00"
		}
		else {
			weight = e.weight
		}
		s.graph.addEdge({
			id: "connection"+i,
			source: "neuron"+e.from,
			target: "neuron"+e.to,
			color: color,
			size: weight/2,
			label: String(Math.round(e.weight))
		})
	})
}

function formatPerceptron(sigma, width, height) {
	var layers = []
	sigma.graph.nodes().forEach(function(e, i) {
		if (layers[e.layer] === undefined) {
			layers[e.layer] = []
		}
		layers[e.layer].push(e)
	})
	var maxY = 0;
	layers.forEach(function(e, i, arr) {
		e.forEach(function(le, li, larr) {
			le.x = i.map(0, arr.length, 0, width)
			le.y = li.map(0, larr.length, 0, height)
			if (maxY < le.y)
				maxY = le.y
		})
	})
	
	layers.forEach(function(e, i) {
		e.forEach(function(le, li, larr) {
			if (i == 0 || i == layers.length-1) {
				if (larr.length == 1) {
					le.y = maxY * (1/2)
				}
				else {
					le.y = li.map(-1, larr.length, 0, maxY)
				}
			}
		})
	})
	sigma.refresh()
}