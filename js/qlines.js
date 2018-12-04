render("Medellín")

 function render( category) {
    var margin = {top: 20, right: 200, bottom: 100, left: 50},
        margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        height2 = 300 - margin2.top - margin2.bottom+150;

    var bisectDate = d3.bisector(function(d) { return d.id; }).left;
    var xScale =  d3.scaleBand().rangeRound([0, width]).padding(0.1);
        // .range([0, width]),

        xScale2 =  d3.scaleBand().rangeRound([0, width]).padding(0.1);
        // .range([0, width]); // Duplicate xScale for brushing ref later

    var yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    // 40 Custom DDV colors 
    var color = d3.scaleOrdinal().range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);  

    var xAxis = d3.axisBottom(xScale)
        .tickSize(6),
        xAxis2 = d3.axisBottom(xScale2);    

    var yAxis = d3.axisLeft(yScale);  

    var line = d3.line()
        // .interpolateBasis()
        .x(function(d) { return xScale(d.id); })
        .y(function(d) { return yScale(d.rating); })
        .defined(function(d) { return d.rating; });  // Hiding line value defaults of 0 for missing idData

    var maxY; // Defined later to upid yAxis

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom) //height + margin.top + margin.bottom
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  svg.selectAll("text")
    .attr("y", 5)
    .attr("x", 9)
    .attr("dy", ".05em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

    // Create invisible rect for mouse tracking
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)                                    
        .attr("x", 0) 
        .attr("y", 0)
        .attr("id", "mouse-tracker")
        .style("fill", "white"); 

    //for slider part-----------------------------------------------------------------------------------
      
    var context = svg.append("g") // Brushing context box container
        .attr("transform", "translate(" + 0 + "," + 410 + ")")
        .attr("class", "context");

    //append clip path for lines plotted, hiding those part out of bounds
    svg.append("defs")
      .append("clipPath") 
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height); 

    //end slider part----------------------------------------------------------------------------------- 

   d3.csv( "data/microbio_meta.csv").then(function(idData) { 
        color.domain(d3.keys(idData[0]).filter(function(key) { // Set the domain of the color ordinal scale to be all the csv headers except "id", matching a color to an issue
          return key !== "id"; 
      }));

      var categories = color.domain().map(function(name) { // Nest the idData into an array of objects with new keys
        return {
          name: name, 
          // ciudad: ciudad, // "ciudad": the csv headers except id
          values: idData.map(function(d) { // "values": which has an array of the ids and ratings    
                return {
                      id: d.id,
                      rating: +(d[name]),
                      };
                  }),
          visible: (name === category ? true : false) // "visible": all false except for season which is true.
        };
      });


console.log(categories[0].values)

      xScale.domain(idData.map((s) => s.id)); // extent = highest and lowest points, domain is idData, range is bouding box

      // var maxYear = d3.max(idData, function(d){ console.log(d.id);return parseInt(d.id)})
      // xScale.domain([0,maxYear])
      yScale.domain([-.7, 1.5
        //d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.rating; }); })
      ]);

      xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later
     
     //for slider part-----------------------------------------------------------------------------------

     var brush = d3.brushY(xScale2)//for slider bar at the bottom
        // .x(xScale2) 
        .on("brush", brushed);

      context.append("g") // Create brushing xAxis
          .attr("class", "x axis1")
          .attr("transform", "translate(0," + height2 + ")")
          .call(xAxis2)

      var contextArea = d3.area() // Set attributes for area chart in brushing context graph
        // .interpolate("monotone")
        .x(function(d) { return xScale2(d.id); }) // x is scaled to xScale2
        .y0(height2) // Bottom line begins at height2 (area chart not inverted) 
        .y1(0); // Top line of area, 0 (area chart not inverted)

      //plot the rect as the bar at the bottom
      context.append("path") // Path is created using svg.area details
        .attr("class", "area")
        .attr("d", contextArea(categories[0].values)) // pass first categories idData .values to area path generator 
        .attr("fill", "#F1F1F2");
        
      //append the brush for the selection of subsection  
      context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("height", height2) // Make brush rects same height 
          .attr("fill", "#E6E7E8");  
      //end slider part-----------------------------------------------------------------------------------

      // draw line graph
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 60)
          .attr("x", 100)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Anomalías(σ) de Temperatura °F ");

      var issue = svg.selectAll(".issue")
          .data(categories) // Select nested idData and append to new svg group elements
        .enter().append("g")
          .attr("class", "issue");   

      issue.append("path")
          .attr("class", "line")
          .style("pointer-events", "none") // Stop line interferring with cursor
          .attr("id", function(d) {
            return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue ciudad, with any spaces replaced with no spaces)
          })
          .attr("d", function(d) { 
            return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
          })
          .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
          .style("stroke", function(d) { return color(d.name); });

      // draw legend
      var legendSpace = 100 / categories.length; // 450/number of issues (ex. 40)    

      issue.append("rect")
          .attr("width", 10)
          .attr("height", 10)          
          .attr("x", width + (margin.right/4+20) ) 
          .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
          .attr("fill",function(d) {
                 return d.visible ? color(d.ciudad) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
          })
          .attr("class", "legend-box")

          .on("click", function(d){ // On click make d.visible 
              d.visible = !d.visible; // If array key for this idData selection is "visible" = true then make it false, if false then make it true

              maxY = findMaxY(categories); // Find max Y rating value categories idData with "visible"; true
              yScale.domain([-0.7,maxY]); // Redefine yAxis domain based on highest y value of categories idData with "visible"; true
              svg.select(".y.axis")
                .transition()
                .call(yAxis);   

              issue.select("path")
                .transition()
                .attr("d", function(d){
                     return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                })

              issue.select("rect")
                .transition()
                .attr("fill", function(d) {
                         return d.visible ? color(d.name) : "#F1F1F2";
                });
          })

          .on("mouseover", function(d){
              d3.select(this)
                .transition()
                .attr("fill", function(d) { return color(d.name); });

              d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
                .transition()
                .style("stroke-width", 2.5);  
          })

          .on("mouseout", function(d){
              d3.select(this)
                .transition()
                .attr("fill", function(d) {
                return d.visible ? color(d.name) : "#F1F1F2";});

              d3.select("#line-" + d.name.replace("  ", "").replace("/", ""))
                .transition()
                .style("stroke-width", 1.5);
          })
          
      issue.append("text")
          .attr("x", width + (margin.right/2)-15) 
          .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  
          .text(function(d) { return d.name; }); 

      // Hover line 
      var hoverLineGroup = svg.append("g") 
                .attr("class", "hover-line");

      var hoverLine = hoverLineGroup // Create line with basic attributes
            .append("line")
                .attr("id", "hover-line")
                .attr("x1", 10).attr("x2", 10) 
                .attr("y1", 0).attr("y2", height + 10)
                .style("pointer-events", "none") // Stop line interferring with cursor
                .style("opacity", 1e-6); // Set opacity to zero 

      var hoverDate = hoverLineGroup
            .append('text')
                .attr("class", "hover-text")
                .attr("y", height - (height-40)) // hover id text position
                .attr("x", width - 150) // hover id text position
                .style("fill", "#E6E7E8");

      var columnNames = d3.keys(idData[0]) 
                      .slice(1); //remove the first column ciudad (`id`);
// console.log(`columnames: `+columnNames)
      var focus = issue.select("g") // create group elements to house tooltip text
          .data(columnNames) // bind each column ciudad id to each g element
          .enter().append("g") //create one <g> for each columnName
          .attr("class", "focus"); 

      focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
            .attr("class", "tooltip")
            .attr("x", width + 20) // position tooltips  
            .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips       

      // Add mouseover events for hover line.
      d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
      .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
      .on("mouseout", function() {
          hoverDate
              .text(null) // on mouseout remove text for hover id

          d3.select("#hover-line")
              .style("opacity", 1e-6); // On mouse out making line invisible
      });
    

      function mousemove() { 
          var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
          var graph_x = yScale.invert(mouse_x); // 

          // var format = d3.time.format('%Y'); 
          // hoverDate.text(format(graph_x)); // scale mouse position to xScale id and format it to show month and year
          
          d3.select("#hover-line") // select hover-line and changing attributes to mouse position
              .attr("x1", mouse_x) 
              .attr("x2", mouse_x)
              .style("opacity", 1); // Making line visible

          // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
 console.log(`d3 moue: `+d3.mouse(this)[0])
          var x0 = yScale.invert(d3.mouse(this)[0]), 
          i = x0,//bisectDate(idData, x0, 0), 
          d0 = idData[i - 1],
          d1 = idData[i],
          
          d = x0 - d0.id > d1.id - x0 ? d1 : d0;

          focus.select("text").text(function(columnName){
             return (d[columnName]+"°F ("+d.id+")");
          });
      }; 

      //for brusher of the slider bar at the bottom
      function brushed() {

        xScale.domain(brush.empty() ? xScale2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent 

        svg.select(".x.axis") // replot xAxis with transition when brush used
              .transition()
              .call(xAxis);

        maxY = findMaxY(categories); // Find max Y rating value categories idData with "visible"; true
        yScale.domain([-0.7,maxY]); // Redefine yAxis domain based on highest y value of categories idData with "visible"; true
        
        svg.select(".y.axis") // Redraw yAxis
          .transition()
          .call(yAxis);   

        issue.select("path") // Redraw lines based on brush xAxis scale and domain
          .transition()
          .attr("d", function(d){
              return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
          });
        
      };      

      
      function findMaxY(idData){  // Define function "findMaxY"
        var maxYValues = idData.map(function(d) { 
          if (d.visible){
            return d3.max(d.values, function(value) { // Return max rating value
              return value.rating; })
          }
        });
        return d3.max(maxYValues);
      }

    }); // End Data callback function 
//------------fcns--------------------
}