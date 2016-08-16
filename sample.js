var data = {
	options: {
		defaultNodeSize: {
			width: 50,
			height: 25
		},
		defaultMargin: 50,
		wrapperSize: {
			width: 600,
			height: 768
		}
	},
	nodes: [
		{
			id: 1,
			label: 'Kostya'
		},
		{
			id: 2,
			label: 'Andrey'
		},
		{
			id: 3,
			label: 'Vlad',
			size: {
				width: 200,
				height: 50
			}
		},
		{
			id: 4,
			label: 'Sergey',
			size: {
				width: 300,
				height: 50
			}
		},
		{
			id: 5,
			label: 'Denis',
      size: {
        width: 250,
        height: 100
      }
		},
		{
			id: 6,
			label: 'Anton'
		},
		{
			id: 7,
			label: 'Evgeniy',
      size: {
        width: 100,
        height: 70
      }
		},
		{
			id: 8,
			label: 'Vadim'
		},
    {
      id: 9,
      label: 'Valera'
    },
    {
      id: 10,
      label: 'Maxim',
      size: {
        width: 100,
        height: 70
      }
    }
	],
	edges: [
		[1, 8],
		[1, 3],
		[1, 4],
		[2, 7],
		[4, 6],
		[6, 7],
		[7, 8],
    [9, 10]
	]
};	

(function(data) {
	var positionCalculate = function() {
		var self = this;
		this.prevPositions = { x: 0, y: 0 };
		this.getX = function(){
			var current = this.prevPositions.x;
			this.prevPositions.x += 75;
			return current;
		} 
	}
	var options = {
			defaultNodeSize: {
				width: 0,
				height: 0
			},
			wrapperSize: {
				width: 0,
				height: 0
			}
		},
		polygon = d3.select("#graph").append("svg"),
		nodes = data.nodes,
		edges = data.edges,
		position = new positionCalculate;
	options = Object.assign(options, data.options);
	polygon
		.style(
			'width', options.wrapperSize.width + 'px'
		)
		.style(
			'height', options.wrapperSize.height + 'px'
		);
	if (edges.length) {
		var popularNodes = {};
		edges.forEach( function(val, index) {
			val.forEach( function(node) {
				popularNodes[node] = popularNodes[node] 
					? popularNodes[node] + 1
					: 1;
			});
		});
    for (var i = 1; i < Object.keys(popularNodes).length; i++) {
      popularNodes[i] = !popularNodes[i] ? 0 : popularNodes[i];
    }
    var sortable = [];
    for (var node in popularNodes) {
        sortable
          .push(
            ['key-'+node, popularNodes[node]]
          )
    }
    sortable.sort(
        function(a, b) {
            return  b[1] - a[1]
        }
    )
    var nextRow,
      currentRowWidth = 0,
      currentRowIndex = 1,
      rowHeight = 0,
      currentTempHeight = 0;
    sortable.forEach( function(e, i) {
      var index = e[0].split('key-')[1] - 1;
      var node = nodes[index];
			if (node) {
  			var nodeWidth = node.size ? 
  			( node.size.width 
  				? node.size.width 
  				: options.defaultNodeSize.width
  			) 
  			: options.defaultNodeSize.width;
  			currentRowWidth += nodeWidth + options.defaultMargin;
			  nextRow = currentRowWidth > options.wrapperSize.width; 	
        if (nextRow) {
          currentRowIndex++;
          currentRowWidth = nodeWidth + options.defaultMargin;
        }
        var nodeHeight = node.size ? 
        ( node.size.height 
          ? node.size.height 
          : options.defaultNodeSize.height
        ) 
        : options.defaultNodeSize.height;

        if (nextRow) {
          rowHeight += currentTempHeight + options.defaultMargin;
        }
        currentTempHeight = currentTempHeight < nodeHeight ? nodeHeight : currentTempHeight;
        var nodeSize = {
          width: nodeWidth,
          height: nodeHeight
        },
        nodePosition = {
          x: (currentRowWidth ? currentRowWidth - nodeWidth : nodeWidth),
          y: currentRowIndex == 1 ? 0 : rowHeight 
        };
        nodes[index].position = nodePosition;
        nodes[index].size = nodeSize;
        _renderNodes(polygon, nodePosition, nodeSize, nextRow, node);
        if (nextRow) {
          currentTempHeight = 0;
        }
        nextRow = false;
			}
		});
	}
  var prev;
	function _renderNodes(polygon, position, size, nextRow, node) {
    polygon
      .append("rect")
      .style('fill','blue')
      .attr("width", size.width)
      .attr("height", size.height)
      .attr('x',  position.x)
      .attr('y', position.y)
    prev = position;
    var text = polygon
                .attr('x',  position.x)
                .attr('y', position.y)
                .append("text");
    text
      .text(node.label)
      .attr('x',  position.x + (size.width / 2))
      .attr('y', position.y + (size.height / 2))
      .style('fill', '#fff')
      .attr("font-size", "10px")
	}
})(data);