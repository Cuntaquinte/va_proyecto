
  function loadStackBars(){  

      var svg = d3.select(".stackB")
            .append("svg")
            .attr("width", 550)
            .attr("height", 200);

      var    margin = {top: 20, right: 180, bottom: 30, left: 40},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom,
          g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleBand()
          .rangeRound([0, width])
          .padding(0.3)
          .align(0.3);

      var y = d3.scaleLinear().range([height, 0]);

      var z = d3.scaleOrdinal()
          .range(["#8da0cb", "#fc8d62", "#66c2a5"]);

      var stack = d3.stack();

//-----------------------------------------------------------
      svg.append('text')
        .attr('class', 'infoLabel')
        .attr('x', (width/2) +20)
        .attr('y', 11)
                .attr("font-size", 9)
        .attr('text-anchor', 'middle')
        .text('Promedios del porcentaje del estado de salud general por ciudad ')
//-----------------------------------------------------------

      // d3.csv("imc-percent.csv", type, function(error, data) {
      d3.csv("data/imc-percent.csv",type).then(function(data){
      	 
        data.sort(function(a, b) { return b.total - a.total; });
        console.log(`Data: `,data)

        x.domain(data.map(function(d) { return d.Ciudad; }));
        y.domain([0, d3.max(data, function(d) { console.log(`D total: `,d.total);return d.total; })]).nice();
        z.domain(data.columns.slice(1));

        g.selectAll(".serie")
          .data(stack.keys(data.columns.slice(1))(data))
          .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function(d) { return z(d.key); })
          .selectAll("rect")
          .data(function(d) { return d; })
          .enter().append("rect")
            .attr("x", function(d) { return x(d.data.Ciudad); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth());

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
              .selectAll("text")
            .attr("fill", "#000");

        g.append("g")
            .attr("class", "axis axis--y")
            // .call(d3.axisLeft(y).ticks(10, "s"))
            .call(d3.axisLeft(y).tickFormat(d => d + "%"))
    
          .append("text")
            .attr("x", -45)
            .attr("y", y(y.ticks(10).pop())+5)


            // .attr("dy", "0.35em")
            // .attr("transform", "rotate(270)")
            // .attr("text-anchor", "start")
            // .attr("fill", "#000")
            // .text("Pocentaje");

        var legend = g.selectAll(".legend")
          .data(data.columns.slice(1).reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            .style("font", "10px sans-serif");

        legend.append("rect")
            .attr("x", width + 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width + 44)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .text(function(d) { return d; });
      });

      function type(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
      }
}//LoadStackBars