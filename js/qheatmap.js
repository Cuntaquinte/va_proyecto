// loadChart();

 function loadChart() {   
  // console.log(`Ingreso a load`);
      var margin = ({top: 10, right: 10, bottom: 80, left: 80}),
         width = 140,
         height = 500;

      var svg = d3.select(".heat1")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    
      var svg2 = d3.select(".heat2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    
      var svg3 = d3.select(".heat3")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    
      var svg4 = d3.select(".heat4")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

      var svg5 = d3.select(".heat5")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    
      var svg6 = d3.select(".heat6")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    
   d3.tsv( "data/otu_pres_aus.tsv").then(function(otuData) { 
    otu_data=[];
    otu_data2=[];
    otu_data3=[];
    otu_data4=[];
    otu_data5=[];
    otu_data6=[];
    var bins=[];
    var n = +otuData.length;

  console.log(`Ingreso a data `,otuData);
    // Labels eje X    
    bins= otuData.columns;
    bins.splice(bins.indexOf("otu"), 1);

    render(svg, splitData(otuData,otu_data, 1));
    render(svg2,splitData(otuData,otu_data2,2));
    render(svg3,splitData(otuData,otu_data3,3));
    render(svg4,splitData(otuData,otu_data4,4));
    render(svg5,splitData(otuData,otu_data5,5));
    render(svg6,splitData(otuData,otu_data6,6));

    placeLegend(d3.select(".hmLegend").append("svg"));
    //-------------------------------------------------------------
    function render(svgChart,matrix){
       var  d3tip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([-8, 0])
                    .html(function(d) { return  d; });

        series = d3.nest()
            .key(d => d[0]).sortKeys(d3.ascending)
            .rollup(d => d[0].slice(2).map(x => x / d3.sum(d[0].slice(2))))
            .entries(matrix);

         x = d3.scaleBand()
            .domain(bins)
            .range([78,130])
            .padding(0.1)

        y = d3.scaleBand()
            .domain(series.map(d => d.key))
            .range([0, height -80])
            .padding(0.1)

        z = d3.scaleSequential(d3.interpolateOrRd)
            .domain([0, d3.max(series, d => d3.max(d.value))]);
        xAxis = g => g
          .attr("transform", `translate(${x.bandwidth()/2},${height - margin.bottom})`)
          .call(d3.axisBottom(x).tickSizeOuter(0).tickPadding(2))
          .call(g => g.select(".domain").remove())
          .selectAll("text")
          .attr("y", 0)
          .attr("x", -9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(305)")
          .attr("font-size", "7pt")
          .attr("text-anchor", "end")
          .attr("fill", "black")
          // .attr("border-width", "1px")
          // .attr("border-style", "solid");

        yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).tickSize(5).tickPadding(4))
          .call(g => g.select(".domain").remove())
          .selectAll("text")
            .attr("font-size", 10)
          .style("fill", "#777")

          svgChart.append("g")
              .call(xAxis);
          
          svgChart.append("g")
              .call(yAxis);

          const serie = svgChart.append("g")
            .selectAll("g")
            .data(series)
            .enter().append("g")
              .attr("transform", d => `translate(0,${y(d.key) + 1})`);
         
          // const tip = d3tip()//.attr('class', 'd3-tip').html(d => (100*d).toFixed(1));

          svgChart.call(d3tip)

           var scale = d3.scaleBand().rangeRound([0, d3.min([width, height])]).domain(d3.range(80));

          serie.append("g")
            .selectAll("rect")
            .data(d => d.value)
            .enter().append("rect")
            .attr("fill"  , d => z(d))
            .attr("x"     , (d,i) => x(bins[i]))
            .attr("y"     , -2)
            .attr("class", "cell")
            // .attr("x", function(d, i) { return scale(i); })
            // .attr("width", scale.bandwidth(n-10))
            // .attr("height", scale.bandwidth(n-10))
            .attr("opacity", 0.8)
            .attr("height", 20)
            .attr("width" , 20)
              .on('mouseover', d3tip.show)
              .on('mouseout' , d3tip.hide);

            return svgChart.node();
      }

  //-------------------------------------------
  function placeLegend(svgChart){
      svgChart
        .attr("width",  720)
        .attr("height", 30)
      // Datos Leyenda de colores
      valRange = [0, d3.max(series, d => d3.max(d.value)) ] ;
      legendBins = [...Array(9).keys()].map(x => d3.quantile(valRange, x * 0.1));
      legendHeight = 20;
      legendElementWidth = Math.round( ((width - (margin.left + margin.right))/ 3) / legendBins.length);

console.log(`valRange `,valRange,` legendBins `,legendBins, ` legendElementWidth `,legendElementWidth)
      const legend = svgChart.append("g")
          // .attr("transform", d => `translate(${margin.left},0)`);
          .attr("transform", d => `translate(5,0)`);

      legend
        .selectAll("rect")
        .data(legendBins)
        .enter()
        .append("rect")
        // .attr("x", (d, i) => legendElementWidth *(i+100))
        .attr("x", (d, i) => legendElementWidth *(i*15.5))
        .attr("y", 4)
        .attr("width", (legendElementWidth*5)+20)
        .attr("height", legendHeight -2)
        .style("fill", d => z(d));
      
      legend
        .selectAll("text")
        .data(legendBins)
        .enter()
        .append("text")
        .text(d => "≥" + (100*d).toFixed(1))
        .attr("x", (d, i) => legendElementWidth * (i*15.5))
        .attr("y", 30)
        .attr("font-size", "7.5pt")
        .attr("font-family", "Consolas, courier")
        .attr("fill", "black");


//-----------------------------------------------------------
      legend.append('text')
        .attr('class', 'otuLabel')
        .attr('x', 630 )
        .attr('y', 18)
        .attr('text-anchor', 'end')
        .text('Presencia / Ausencia de microbiota por ciudad')
//-----------------------------------------------------------
  }
  function splitData(Datos,matrix,indx){
      matrix=[];
      Datos.forEach(function(d, i) {
          var temp=[];
          bot=31*(indx-1)+1;
          ceil=(indx*31)+1

          if (i>=bot&& i < ceil){
            temp.push(d.otu);
            temp.push(0);
            temp.push(d.Medellin);
            temp.push(d.Bogota);
            temp.push(d.Barranquilla);
            temp.push(d.Bucaramanga);
            temp.push(d.Cali);

            matrix.push(temp);  
          }       
      });
       return matrix;
  }
  }); // End Data callback function 

}