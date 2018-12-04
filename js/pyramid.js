
render("p");render("g");render("c");
 function render(item){

  d3.csv("data/microbio_sexprot.csv").then(function (data) {
// console.log(`hol2: `+data)
    var w = 500,
        h = 150,
        topMargin = 45,
        labelSpace = 40,
        innerMargin = w/2+labelSpace,
        outerMargin = 15,
            margin = { top: 20, right: 20, bottom: 30, left: 60 },
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,

    xScale = d3.scaleBand().padding(0.1),
     xValue = function (d) { return d[0]; },
        gap = 2,
        classBar="";
        classH="";
        classM="";
        nutriTopic="";
        leftLabel = "Mujeres",
        rightLabel = "Hombres";

    var dataRange;
    if (item =="p"){
        dataRange  = d3.max(data.map(function(d) { return Math.max(d.per_prot_hombre, d.per_prot_mujer) }));
    }else if  (item =="g"){
        dataRange  = d3.max(data.map(function(d) { return Math.max(d.per_gras_hombre, d.per_gras_mujer) }));
    }else if  (item =="c"){
        dataRange  = d3.max(data.map(function(d) { return Math.max(d.per_carb_hombre, d.per_carb_mujer) }));
    }

    /* edit with care */
    var chartWidth = w - innerMargin - outerMargin,
        barWidth = h / data.length-9,
        yScale = d3.scaleLinear().domain([0, data.length]).range([0, h-topMargin]),
        total = d3.scaleLinear().domain([0, dataRange]).range([0, chartWidth - labelSpace]),
        commas = d3.format(",.0f");

    /* main panel */
    var vis;

    if (item =="p"){
          nutriTopic="proteína";
         classBar="bar1";classH="malebarP";classM="femalebarP";
         vis = d3.select(".visP").append("svg");
    }else if  (item =="g"){
          nutriTopic="grasas";
         classBar="bar2";classH="malebarG";classM="femalebarG";
         vis = d3.select(".visG").append("svg");
    }else if  (item =="c"){
          nutriTopic="carbohidratos";
         classBar="bar3";classH="malebarC";classM="femalebarC";
         vis = d3.select(".visC").append("svg");
    }
// console.log(`x: `+vis)
      
    vis
    .attr("width", w)
    .attr("height", h);


      xScale.rangeRound([0, innerWidth])
        .domain(data.map(function (d) { return xValue(d); }));
      
      vis.append("g").attr("class", "xaxis");

      vis.select(".xaxis")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(d3.axisBottom(xScale));

    vis.append('text')
      .attr('class', 'nutriLabel')
      .attr('x', w / 2 )
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .text('Promedio del porcentaje de '+nutriTopic+' por género.')


    /* per_prot_hombre label */
    vis.append("text")
      .attr("class", classBar)
      // .attr("class", "label")
      .text(leftLabel)
      .attr("x", w-innerMargin)
      .attr("y", topMargin-3)
      .attr("text-anchor", "end");

    /* per_prot_mujer label */
    vis.append("text")
      .attr("class", "label")
      .text(rightLabel)
      .attr("x", innerMargin)
      .attr("y", topMargin-3);

    /* female bars and data labels */ 
    var bar = vis.selectAll("g.bar")
        .data(data)
      .enter().append("g")
      .attr("class", classBar)
        // .attr("class", "bar")
        .attr("transform", function(d, i) {
          return "translate(0," + (yScale(i) + topMargin) + ")";
        });

    var wholebar = bar.append("rect")
        .attr("width", w)
        .attr("height", barWidth-gap)
        .attr("fill", "none")
        .attr("pointer-events", "all");

    var highlight = function(c) {
      return function(d, i) {
        bar.filter(function(d, j) {
          return i === j;
        }).attr("class", c);
      };
    };
// console.log(`classBar: `+classBar)

    bar
      .on("mouseover", highlight("highlight "+classBar))
      .on("mouseout", highlight(classBar));

    bar.append("rect")
        .attr("class", classM)
        // .attr("class", "femalebar")
        .attr("height", barWidth-gap);

    bar.append("text")
        // .attr("class", classM)
        .attr("class", "femalebar")
        .attr("dx", -3)
        .attr("dy", "1em")
        .attr("text-anchor", "end");

    bar.append("rect")
        .attr("class", classH)
        // .attr("class", "malebar")
        .attr("height", barWidth-gap)
        .attr("x", innerMargin);

    bar.append("text")
        // .attr("class", classH)
        .attr("class", "malebar")
        .attr("dx", 3)
        .attr("dy", "1em");

    /* sharedLabels */
    bar.append("text")
        .attr("class", "shared")
        .attr("x", w/2)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.ciudad; });

    refresh(data);

    function refresh(data) {
      var bars = d3.selectAll("g."+classBar)
          .data(data);
      bars.selectAll("rect."+classH)
      // bars.selectAll("rect.malebar")
        .transition()
          .attr("width", function(d) { 
                topic=(item="p")?d.per_prot_hombre:(item=="g")?d.per_gras_hombre:d.per_carb_hombre;
              return total(topic); 
            });
      bars.selectAll("rect."+classM)
      // bars.selectAll("rect.femalebar")
        .transition()
          .attr("x", function(d) {
                topic=(item="p")?d.per_prot_mujer:(item=="g")?d.per_gras_mujer:d.per_carb_mujer;
                 return innerMargin - total(topic) - 2 * labelSpace; 
               }) 
          .attr("width", function(d) { 
                topic=(item="p")?d.per_prot_mujer:(item=="g")?d.per_gras_mujer:d.per_carb_mujer;
                return total(topic); 
              });

      bars.selectAll("text.malebar")
          .text(function(d) {
                topic=(item="p")?d.per_prot_hombre:(item=="g")?d.per_gras_hombre:d.per_carb_hombre;
               // return commas(topic);
              return topic;  
             })
        .transition()
          .attr("x", function(d) { 
                topic=(item="p")?d.per_prot_hombre:(item=="g")?d.per_gras_hombre:d.per_carb_hombre;
                return innerMargin + total(topic); 
              });
      bars.selectAll("text.femalebar")
          .text(function(d) { 
                topic=(item="p")?d.per_prot_mujer:(item=="g")?d.per_gras_mujer:d.per_carb_mujer;
              // return commas(topic); 
              return topic; 
            })
        .transition()
          .attr("x", function(d) { 
               topic=(item="p")?d.per_prot_mujer:(item=="g")?d.per_gras_mujer:d.per_carb_mujer;
              return innerMargin - total(topic) - 2 * labelSpace;
           });
    }

});
}