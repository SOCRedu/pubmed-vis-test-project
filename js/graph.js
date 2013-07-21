//api key:f6bc08acc6c7dbd33c60f04ac9d55f38
(function(){
  $(document).ready(function(){
    
    $("#searchButton").click(function() {
      // var search_term = "Venter JC[Auth]";
      var search_term = $("#inputSearch").val();
        args = {'apikey' : '191d24f81e61c107bca103f7d6a9ca10',
                'db'     : 'pubmed',
                'term'   : search_term,
                'retmax' : 500,          // maximum number of results from Esearch
                'max'    : 25,          // maximum number of results passed to Esummary
                'start'  : 0};
        $.getJSON('http://entrezajax.appspot.com/esearch+esummary?callback=?', args, function(data) {
          if(data.entrezajax.error == true) {
          $("#result").html('<p>' + 'Sorry - EntrezAjax failed with error ' + data.entrezajax.error_message + '</p>');
          return;
          }
          $('#result').html(data.entrezajax.count + ' results found<br/>');
          $.each(data.result, function(i, item) {
            var author_list = '';
            for(var i = 0; i < item.AuthorList.length; i ++) {
              if(i != 0) {
                author_list += ', ';
              }
              author_list += item.AuthorList[i];
            }
            var html = '<p><a href=\'http://www.ncbi.nlm.nih.gov/pubmed/' + item.ArticleIds.pubmed + '\'>' + item.Title + '</a><br/>' + author_list + '<br/>' + item.FullJournalName + ' ' + item.PubDate + '</p>';
            $("<div/>").html(html).appendTo('#result');
          });
        });
      });

    function createGraph()
    {

    }

    var w = 960,
        h = 500,
        root;

    var force = d3.layout.force()
        .linkDistance(80)
        .charge(-120)
        .gravity(.05)
        .size([w, h]);

    var vis = d3.select("#chart").append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    d3.json("graph.json", function(json) {
      root = json;
      update();
    });

    function update() {
      var nodes = flatten(root),
          links = d3.layout.tree().links(nodes);

      // Restart the force layout.
      force
          .nodes(nodes)
          .links(links)
          .start();

      // Update the links…
      var link = vis.selectAll("line.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links.
      link.enter().insert("svg:line", ".node")
          .attr("class", "link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      // Exit any old links.
      link.exit().remove();

      // Update the nodes…
      var node = vis.selectAll("g.node")
          .data(nodes, function(d) { return d.id; })

      node.select("circle")
          .style("fill", color);

      // Enter any new nodes.
      var nodeEnter = node.enter().append("svg:g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .on("click", click)
          .on("dblclick", dblclick)
          .call(force.drag);

      nodeEnter.append("svg:circle")
          .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
          .style("fill", color);

      nodeEnter.append("svg:text")
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });

      // Exit any old nodes.
      node.exit().remove();

      // Re-select for update.
      link = vis.selectAll("line.link");
      node = vis.selectAll("g.node");

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      });
    }

    // Color leaf nodes orange, and packages white or blue.
    function color(d) {
      return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update();
    }

    function dblclick(d) {
    	document.getElementById("testSize").innerHTML=d.size;
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
      }

      recurse(root);
      return nodes;
    }
  }); //document ready
})();