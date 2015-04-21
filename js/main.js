
function consolize(jelement) {
	return function(message) {
		jelement.append("<p>" + message + "</p>")
	}
}

var nlog = consolize($("#neural-console"))



// a perceptron made by architect and a training function that takes one
// parameter, the perceptron to train. Also a sigma instance.
function showPerceptron(perceptron, sigma, train) {
	train(perceptron);
	netToGraph(perceptron.toJSON(), sigma) 
	sigma.refresh()
	
	sigma.startForceAtlas2({
	edgeWeightInfluence: 0.5,
		outboundAttractionDistribution: true
	})
	
	setTimeout(function() {
		sigma.stopForceAtlas2()
	}, 5000)
}

var s = new sigma('container').settings({maxEdgeSize: 5})
showPerceptron(new Architect.Perceptron(2, 90, 1), s, function(p) {
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
})