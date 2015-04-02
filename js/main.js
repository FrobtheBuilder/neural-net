var p = new Architect.Perceptron(2, 20, 1)

var rate = 0.3
for (var i = 0; i < 20000; i++) {
	p.activate([0, 0]);
	p.propagate(rate, [0])

	p.activate([0, 1]);
	p.propagate(rate, [1])

	p.activate([1, 0]);
	p.propagate(rate, [1])

	p.activate([1, 1]);
	p.propagate(rate, [0])
}

var pJson = p.toJSON();

document.querySelector("#container2").innerHTML = JSON.stringify(p.toJSON())

var s = new sigma(container)
/*
s.graph.addNode({
	id: "n0",
	label: "hello",
	x: 0,
	y: 0,
	size: 1,
	color: "#f00"
}).addNode({
	id: "n1",
	label: "world",
	x: 1,
	y: 1,
	size: 1,
	color: "#000"
}).addEdge({
	id: 'e0',
	source: 'n0',
	target: 'n1'
})
*/

function netToGraph(s) {
	var lastX = -1
	var y = 0
	pJson.neurons.forEach(function(e, i, arr) {
		var x

		if (e.layer == "input") {
			x = 0
		}
		else if (e.layer == "output") {
			x = 2
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
			color: "#000"
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

netToGraph(s)

s.refresh()
s.startForceAtlas2({
	edgeWeightInfluence: 0.5,
	outboundAttractionDistribution: true
});