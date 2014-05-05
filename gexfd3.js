
gexfD3 = 
  function () {

      var nodes = [];
      var links = [];
      var linksFile = "";
      var fileName = "";
      var xExtent = [];
      var yExtent = [];
      var nodeScale = [1,10];
      var layoutSize = [500,500];
      var sizeExtent = [];
      var dAtt = "";
      var dynamicExtent = [];
      var sizeScale, xScale, yScale, dynamicScale;
      var gexfD3Brush = d3.svg.brush();
      var linkAttributes = [];
      var nodeAttributes = [];
      var nodeHash = {};

      this.graph = function(gexfParsed) {
        if (!arguments.length) return true;

      var gNodes = gexfParsed.nodes;
      var gLinks = gexfParsed.edges;

      nodes = [];
      links = [];
      nodeHash = {};
      //Create JSON nodes array      
      var x = 0;
      gNodes.forEach(function(gNode) {
        var newNode = {id: x, properties: {}};
        newNode.label = gNode.label || gNode.id;
        newNode.rgbColor = gNode.viz.color || "rgb(122,122,122)";
        newNode.x = gNode.viz.position.x;
        newNode.y = gNode.viz.position.y;
        newNode.z = gNode.viz.position.z;
        newNode.originalX = newNode.x;
        newNode.originalY = newNode.y;
        newNode.size = gNode.viz.size;
        nodeHash[gNode.id] = newNode;
        for (y in gNode.attributes) {
          if (!(typeof(gNode.attributes[y]) === "undefined") && !(gNode.attributes[y].toString() == "NaN" )) {
            newNode.properties[y] = gNode.attributes[y];
          }
        }
        nodes.push(newNode);
        x++;
      })
      //get node attributes based on attributes in the first node
      //this won't work for assymetrical node attributes
      nodeAttributes = d3.keys(nodes[0].properties);

      //Create JSON links array
      var x = 0;
      while (x < gLinks.length) {
        var newLink = {id: x, properties: {}};
        newLink.source = nodeHash[gLinks[x].source];
        newLink.target = nodeHash[gLinks[x].target];
        //process attributes
        for (y in gLinks[x].attributes) {
        newLink.properties[y] = gLinks[x].attributes[y];
        y++;
        }
        links.push(newLink)
        x++;
      }
      linkAttributes = d3.keys(links[0].properties);

        sizeExtent = d3.extent(nodes, function(d) {return parseFloat(d.size)})
        sizeScale = d3.scale.linear().domain(sizeExtent).range(nodeScale);
        return this;
      }
      this.nodes = function(incNodes) {
        if (!arguments.length) return nodes;
        nodes = incNodes;
        return this;
      }
      this.links = function(incLinks) {
        if (!arguments.length) return links;
        links = incLinks
        return this;
      }
      
      this.linkAttributes = function(incAtts) {
        if (!arguments.length) return linkAttributes;
        linkAttributes = incAtts;
        return this;
      }

      this.nodeAttributes = function(incAtts) {
        if (!arguments.length) return nodeAttributes;
        nodeAttributes = incAtts;
        return this;
      }
      
      this.nodeScale = function(incScale) {
        if (!arguments.length) return sizeScale;
        nodeScale = incScale;
        sizeScale = d3.scale.linear().domain(sizeExtent).range(nodeScale);
        return this;
      }



this.overwriteLinks = function(data) {
      if (!arguments.length) return nodes;
      //OVERWRITE links for parallel links
      links = [];
        for (x in data) {
        var newLink = {id: x, properties: {}};
        newLink.source = nodeHash[data[x].source];
        newLink.target = nodeHash[data[x].target];
        newLink.id = x;
        newLink.properties.type = "base";
        newLink.properties.year = data[x].year;
        //process attributes
        if (newLink.source && newLink.target) {
          links.push(newLink);
        }
        x++;
        }
        linkAttributes = d3.keys(links[0].properties);
      
      return this;
      }

      this.size = function(incSize) {
      if (!arguments.length) return layoutSize;

      //Measure
      layoutSize = incSize;
      xExtent = d3.extent(nodes, function(d) {return parseFloat(d.x)})
      yExtent = d3.extent(nodes, function(d) {return parseFloat(d.y)})
      xScale = d3.scale.linear().domain(xExtent).range([0,layoutSize[0]]);
      yScale = d3.scale.linear().domain(yExtent).range([layoutSize[1],0]);
      return this;
      }

      this.dynamicAttribute = function(incAtt) {
      if (!arguments.length) return dAtt;
        dAtt = incAtt;
        var nDE = [Infinity, -Infinity];
        var lDE = [Infinity, -Infinity];        
        if (nodeAttributes.indexOf(dAtt) > -1) {
          //currently filters out 0 entries
//          nDE = d3.extent(nodes, function(d) {return parseInt(d.properties[dAtt])})
          nDE = d3.extent(nodes.filter(function(p) {return p.properties[dAtt] != 0}), function(d) {return parseInt(d.properties[dAtt])})
        }
        if (linkAttributes.indexOf(dAtt) > -1) {
//          lDE = d3.extent(links, function(d) {return parseInt(d.properties[dAtt])})
          lDE = d3.extent(links.filter(function(p) {return p.properties[dAtt] != 0}), function(d) {return parseInt(d.properties[dAtt])})
        }
        dynamicExtent = [Math.min(nDE[0],lDE[0]), Math.max(nDE[1],lDE[1])]
        dynamicScale = d3.scale.linear().domain(dynamicExtent).range([0,layoutSize[0]]);
      return this;
      }
      
      this.dynamicBrush = function(incSelection) {
      if (!arguments.length) return gexfD3Brush;
    gexfD3Brush
    .x(dynamicScale)
    .extent(dynamicExtent)
    var brushAxis = d3.svg.axis().scale(dynamicScale).orient("bottom").tickSize(-40).ticks(20).tickFormat(d3.format("d"));

      incSelection.append("g").attr("id", "bgAxis").append("g").attr("transform", "translate(50,35)").call(brushAxis)
      incSelection.append("g").attr("id", "fgBrush").attr("transform", "translate(50,0)")
      .call(gexfD3Brush)
      .selectAll("rect").attr("height", 35);
      return this;
      }
      
      this.xScale = function(newScale) {
      if (!arguments.length) return xScale;
      xScale = newScale;
      return this;        
      }
      
      this.yScale = function(newScale) {
      if (!arguments.length) return yScale;
      yScale = newScale;
      return this;        
      }

      return this;
    }