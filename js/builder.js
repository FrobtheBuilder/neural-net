
//takes a synaptic network in json format, injects it into a sigma graph
function netToGraph(JSONnetwork, sigma) {
	var s = sigma
	var pJson = JSONnetwork

	var lastX = -1
	var y = 0
	pJson.neurons.forEach(function(e, i) {
		var x
		var color = "#000"
		if (e.layer == "input") {
			x = 0
			color = "#00d"
		}
		else if (e.layer == "output") {
			x = 2
			color = "#d00"
		}
		else {
			x = Number(e.layer) + 1
		}
		if (x == lastX) {
			y++
		}
		else {
			y = 20
		}

		s.graph.addNode({
			id: "neuron" + i,
			label: String(i),
			x: x,
			y: y,
			size: 1,
			color: color
		})

		lastX = x
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
			size: weight*50
		})
	})
}

