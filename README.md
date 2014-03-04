gexfd3 .1
======

A small library for rendering parsed GEXF graphs in D3.js

Requires https://github.com/Yomguithereal/gexf-parser & https://github.com/mbostock/d3/

Load a GEXF using gexf-parser and send the results to gexfd3.graph()

Roughly follows the patterns of D3 layouts, creates a gexfD3.nodes() and gexfD3.links() that work in a force layout and have .x and .y coordinates as well as viz settings from the GEXF and GEXF attributes in a properties array.

Simple example:
http://bl.ocks.org/emeeks/9357371

Complicated example:
http://bl.ocks.org/emeeks/9357131