var p = new Architect.Perceptron(2, 90, 1)

var rate = 0.3
for (var i = 0; i < 20000; i++) {
	p.activate([0, 0])
	p.propagate(rate, [0])

	p.activate([0, 1])
	p.propagate(rate, [1])

	p.activate([1, 0])
	p.propagate(rate, [1])

	p.activate([1, 1])
	p.propagate(rate, [0])
}

document.querySelector("#container2").innerHTML = JSON.stringify(p.toJSON())

var s = new sigma(container)
s.settings({maxEdgeSize: 5})
function netToGraph(JSONnetwork, sigma) {
	var s = sigma
	var pJson = JSONnetwork

	var lastX = -1
	var y = 0
	pJson.neurons.forEach(function(e, i, arr) {
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
			x = Number(e.layer + 1)
		}
		if (x == lastX) {
			y++
		}
		else {
			y = 0
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

netToGraph(p.toJSON(), s)

s.refresh()
s.startForceAtlas2({
	edgeWeightInfluence: 0.5,
	outboundAttractionDistribution: true
})