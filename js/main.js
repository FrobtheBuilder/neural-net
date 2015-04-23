var p

var s = new sigma({
	renderer: {                                                        
        container: document.getElementById("container"),                                        
        type: "canvas"
    },                                                                 
    settings: {
		maxEdgeSize: 5,
		labelThreshold: 2,
		defaultEdgeLabelSize: 13,
		edgeLabelSize: 'fixed',
		edgeLabelThreshold: 0,
	}
})

$(function() {
	p = showPerceptron(perceptrons.XOR, s)
	$("#xor").click(function() {
		p = showPerceptron(train.XOR(new Architect.Perceptron(2, 10, 1)), s)
	})
	$("#xor-small").click(function() {
		p = showPerceptron(perceptrons.XORSMALL, s)
	})
	$("#xor-dual").click(function() {
		p = showPerceptron(perceptrons.XORDUAL, s)
	})
	$("#and").click(function() {
		p = showPerceptron(perceptrons.AND, s)
	})
	$("#and-small").click(function() {
		p = showPerceptron(perceptrons.ANDSMALL, s)
	})
	$("#sin").click(function() {
		p = showPerceptron(perceptrons.SINSINGLE, s)
	})
	$("#sin-dual").click(function() {
		p = showPerceptron(perceptrons.SINDUAL, s)
	})
	$("#dump").click(function() {
		dumpSigmaJSON(s, $("#toilet"))
		//$("#toilet").append($.csv.fromArrays(s.graph.nodes()))
		//doCSV(JSON.stringify(s.graph.nodes()))
	})
})

function noAct() {}

function consolize(jelement) {
	return function(message) {
		jelement.append("<p>" + message + "</p>")
		var objDiv = jelement.get([0])
		objDiv.scrollTop = objDiv.scrollHeight
	}
}

var nlog = consolize($("#neural-console"))



// a perceptron made by architect and a training function that takes one
// parameter, the perceptron to train. Also a sigma instance.
function showPerceptron(p, sigma) {
	perceptron = p()
	perceptron.test()
	netToGraph(perceptron.toJSON(), sigma)
	formatPerceptron(sigma, 5, 5)
	return perceptron;
}

function logBasicTests(log, str, net, options, realfn) {
	log("<hr>Network trained. Sample results:")
	if (realfn == null) realfn = function(){}
	options.forEach(function(e, i) {
		log(str + "(" + e + ") -> " + net.activate(e) + " <br>≈ " 
				+ "expected: " + realfn(e))
	})
}

var train = {
	AND : function(p, r) {
		var rate = (r || 0.3)
			return function() {
			for (var i = 0; i < 20000; i++) {
				p.activate([0, 0])
				p.propagate(rate, [0])

				p.activate([0, 1])
				p.propagate(rate, [0])

				p.activate([1, 0])
				p.propagate(rate, [0])

				p.activate([1, 1])
				p.propagate(rate, [1])
			}
			p.test = function() {
				logBasicTests(nlog, "and", p, [
					[0, 0],
					[0, 1],
					[1, 0],
					[1, 1]
				], function(x) {
					if (x[0] == 1 && x[1] == 1) 
						return 1
					else
						return 0
				})
			}
			return p
		}
	},
	XOR: function(p, r) {
		var rate = (r || 0.3)
		return function() {
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
			console.log(rate)
			p.test = function() {
				logBasicTests(nlog, "xor", p, [
					[0, 0],
					[0, 1],
					[1, 0],
					[1, 1]
				], function(x){
					if (x[0] != x[1]) {
						return 1;
					}
					else {
						return 0;
					}
				})
			}
			return p
		}
	},
	SIN: function(p, r) {
		var rate = (r || 0.2)
		return function() {
			var sinInputTable = _.range(0, 7, Math.PI/10)
			var sinTable = sinInputTable.map(function(e, i) {
				   return Math.sin(e)
			   })

			for (var i = 0; i < 100000; i++) {
				sinTable.forEach(function(e, i) {
					p.activate([sinInputTable[i]])
					p.propagate(rate, [sinMap(e)])
				})
			}
			p.test = function() {
				logBasicTests(nlog, "sin", p, [
					[Math.PI/4],
					[Math.PI/3],
					[Math.PI/2]
				], Math.sin)
				var points = _.range(0, 7, 0.2)
				plot(
					points,
					points.map(function(e, i) {
						return (sinUnmap(p.activate([e])[0]))
					})
				)
			}
			return p
		}
	}
}



var perceptrons = {
	XOR: train.XOR(new Architect.Perceptron(2, 10, 1)),
	XORSMALL: train.XOR(new Architect.Perceptron(2, 3, 1)),
	XORDUAL: train.XOR(new Architect.Perceptron(2, 10, 10, 1), 0.00001),
	AND: train.AND(new Architect.Perceptron(2, 10, 1)),
	ANDSMALL: train.AND(new Architect.Perceptron(2, 2, 1)),
	SINSINGLE: train.SIN(new Architect.Perceptron(1, 20, 1), 0.1),
	SINDUAL: train.SIN(new Architect.Perceptron(1, 10, 10, 1), 0.1)
}

//var p = showPerceptron(train.XOR(new Architect.Perceptron(2, 10, 1)), s)
Chart.defaults.global.responsive = true;

function plot(inputs, outputs) {
	var contx = $("#plot").get(0).getContext("2d")
	var plot = new Chart(contx).Line({
		labels: inputs,
		datasets: [
			{
				label: "sin(x) according to javascript",
				fillColor: "rgba(220,220,220,0.0)",
				strokeColor: "rgba(150,150,150,1)",
				pointColor: "rgba(220,130,130,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: inputs.map(Math.sin)
			},
			{
				label: "sin(x) according to perceptron",
				fillColor: "rgba(190,190,190,0.0)",
				strokeColor: "rgba(220,100,100,1)",
				pointColor: "rgba(220,130,130,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: outputs
			}
		]
	}, { pointDot : false, bezierCurve : false })
}

function sinMap(x) {
	return x.map(-1, 1, 0, 1)
}

function sinUnmap(x) {
	return x.map(0, 1, -1, 1)
}

function dumpSigmaJSON(sigma, element) {
	element.text("")
	element.append("<p>NODES: <br>" + JSON.stringify(sigma.graph.nodes()) + "</p>")
	element.append("<p>EDGES: <br>" + JSON.stringify(sigma.graph.edges()) + "</p>")
}

function dumpSigmaCSV(sigma, name) {
	JSONToCSVConvertor(JSON.stringify(sigma.graph.nodes()), name + "nodes", true)
	JSONToCSVConvertor(JSON.stringify(sigma.graph.edges()), name + "edges", true)
}
