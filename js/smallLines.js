 function loadLines(cityTarget){  

// alert(`cityTarget: `+cityTarget)
     var //svg = d3.select(".chart1"),
          margin = {top: 21, right: 20, bottom: 80, left: 10},
          width = 890 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

       // console.log(`W: `+width+` H: `+height);

      var t = d3.transition()
          .duration(750)
          .ease(d3.easeLinear);
      var duration =750;

      var svg = d3.select(".chart1")
        .append("svg")
        .attr("width", 890)
        .attr("height", 310);

      var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
          y = d3.scaleLinear().rangeRound([height, 0]);   
// ----------------------Controls-----------------------------

      const buttonNames = ["Proteína", "Grasas", "Carbohidratos"],
          buttonValues = ["sortP", "sortG", "sortC"];

          ctrl = d3.select(".chart1")
                  .append("div")
                  .attr("class","controles");

        for (var i = 0; i < buttonNames.length; i++) {
          // alert(`fua fua`)
          ctrls=d3.select(".controles")
            .append("button")
            .attr("type","button")
            .attr("class","buttonSort")
            .attr("id",function(d) { return buttonValues[i];})
            .append("div")
            .attr("class","label")
            .text(function(d) { return  'Ordenar por '+buttonNames[i];})
        }
//-----------------------------------------------------------
      svg.append('text')
        .attr('class', 'nutriLabel')
        .attr('x', width / 2 )
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .text('Datos nutricionales para la ciudad de '+cityTarget)
//-----------------------------------------------------------

      // const vLine = d3.line().x(d => x(d.id)).y(d => y(d.per_protein));
      
      d3.csv( "data/microbio_meta.csv").then(function(data) { 
          lastAdded="";
          estado="";
          p="";
          gr="";
          c="";
          nutri_data=[];
          nutri_data2=[];
          nutri_data3=[];
          nutri_data4=[];
        data =data.filter(function(d){  return d.city == cityTarget;});
         var g =svg.append("g");
          // console.log(`******`+data.length);
          render(g, data);
          d3.selectAll(".buttonSort")
            .on("click", function(d, i, arr) {     
              sortLines(arr[i].id);
          });
        // d3.select("#sort").on("click", sortLines(this.value));
          function sortLines(item){
          // alert(item);
                switch (item) {
                    case "sortP":{
                        data.sort(function(a, b) {
                          return d3.descending(a.per_protein, b.per_protein)
                        })
                    }break;
                    case "sortG":{
                        data.sort(function(a, b) {
                          return d3.descending(a.per_total_fat, b.per_total_fat)
                        })
                    }break;
                    case "sortC":{
                        data.sort(function(a, b) {
                          return d3.descending(a.per_carbohydrates, b.per_carbohydrates)
                        })
                    }break;
                  }
              g.remove();
              g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                render(g, data);
          }
//--------------------------------------------

        function render(svgChart,matrix){
            var line = d3.line()
            .x(function(d) { return x(d.id); })
            .y(function(d) { return y(+d.per_protein); })

          var line2 = d3.line()
            .x(function(d) { return x(d.id); })
            .y(function(d) { return y(+d.per_total_fat); })

          var line3 = d3.line()
            .x(function(d) { return x(d.id); })
            .y(function(d) { return y(+d.per_carbohydrates); })    
// console.log(`>>>>>>>>`+svgChart;

          var chartLayer = svgChart.append("g").attr("class", "chartLayer")
              .attr("transform", "translate("+[margin.left, margin.top]+")")

          var overLayer = svgChart.append("g").attr("class", "overLayer")
              .attr("transform", "translate("+[margin.left, margin.top]+")")
           var guideLine = overLayer.append("line")
            .attr("class", "guideLine")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            // .attr("y2", height-(margin.top+margin.bottom))
            .attr("y2", height-2)
            .attr("stroke", "black")
    
          var eventCapture = chartLayer.append("rect")
              .attr("width", width-(margin.left+margin.right))
              .attr("height", height-(margin.top+margin.bottom))
              .attr("opacity", 0)


            var tooltip = d3.select("body")
              .append("div")
              .data(matrix)
              .style("position", "absolute")
              .style("z-index", "10")
              .style("right", "0")
              .style("visibility", "hidden")
              .html(function(d) {
                    setNutriEstado(d);
                    console.log(`G: `+gr+` P: `+p);
                    estado=getEstado(p,gr,c);
                    info="<table class='qresumen'><tr> <td colspan=3>Muestra: <b>"+d.id+"</b>, " + d.sex + " de <b>" + d.age + "</b> años</td></tr><tr> <td>%Proteina:</td>  <td>["+d.per_protein+"]</td> <td><b>"+p+"</b></td> </tr><tr> <td> %Grasa: </td>  <td>["+d.per_total_fat+"]</td> <td><b>"+gr+"</b></td> </tr><tr> <td>%Carbohidratos:</td>  <td>["+d.per_carbohydrates+"]</td> <td><b>"+c+"</b></td> </tr><tr> <td  colspan=3>Estado de salud: <b>" + estado + "</b></td></tr></table>";
                    return info;
                  })

            x.domain(data.map(function(d) { return d.id; })); 
            y.domain([0, 70]);

            x.invert = (function(){
                var domain = x.domain()
                var range = x.range()
                var scale = d3.scaleQuantize().domain(range).range(domain)

                return function(x){
                    return scale(x)
                }
            })()

            svgChart.append("g")
              .attr("transform", "translate(0," + (height) + ")")
              .call(d3.axisBottom(x))
              .selectAll("text")
                .attr("y", +7)
                .attr("x", -33)
                .attr("dy", ".35em")
                .attr("transform", "rotate(305)")
                .style("text-anchor", "start")
                .attr("font-size", 8)
                .attr("font-family", "Helvetica")
                .style("fill", "black");

            svgChart.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
              .selectAll("text")
                .style("text-anchor", "start")
                .attr("font-size", 10)
                .attr("font-family", "Helvetica")
                .style("fill", "black");

            svgChart.append("path")
              .datum(matrix)
              .attr("class", "line")
              .attr("d", line) 

            svgChart.append("path")
              .datum(matrix)
              .attr("class", "line2")
              .attr("d", line2);

            svgChart.append("path")
              .datum(matrix)
              .attr("class", "line3")
              .attr("d", line3) ;

              // Slide it to the left.
            d3.select(".line")
              .attr("transform", null)
              .transition()
              .duration(300);
// console.log(`........ `,matrix);

            svgChart.append("text")
              .attr("transform", "translate(" + (width-22) + "," + y(matrix[matrix.length-1].per_protein) + ")")
              .attr("dy", ".35em")
              .attr("text-anchor", "start")
              .attr("font-size", 10)
              .style("fill", "984ea3")
              .text("Proteina");
            svgChart.append("text")
              .attr("transform", "translate(" + (width-22) + "," + y(matrix[matrix.length-1].per_total_fat) + ")")
              .attr("dy", ".35em")
              .attr("text-anchor", "start")
              .attr("font-size", 10)
              .style("fill", "#ff7f00")
              .text("Grasas");
            svgChart.append("text")
              .attr("transform", "translate(" + (width-37) + "," + y(matrix[matrix.length-1].per_carbohydrates+70) + ")")
              .attr("dy", ".35em")
              .attr("text-anchor", "start")
              .attr("font-size", 10)
              .style("fill", "#377eb8")
              .text("Carbohidratos");

            svgChart
              .on("mouseover", function(){ 
                
                   var xy = d3.mouse(eventCapture.node())
                   var d = x.invert(xy[0]) 
                   var nx = x(d) + (x.bandwidth()/2)
                   
                  guideLine.transition().duration(100).attr("x1", nx).attr("x2", nx);
                  return tooltip.style("visibility", "visible");  
              })
              .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
              .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        //-----------------------------colrgb(238, 167, 136)
         }
        });
    
      function getEstado(p,g,c){
          return (p=="Normal" && gr=="Normal" && c=="Normal")?"<span style='color: green;font-weight:bold;'>Bueno</span>":"<span style='color: red;font-weight:bold;'>Malo</span>";
      }
      function setNutriEstado(d){      
          p=nutriCat(d.per_protein,"prot");
          gr=nutriCat(d.per_total_fat,"gras");
          c=nutriCat(d.per_carbohydrates,"carb");

        console.log("Grasas: ",gr);
      }
      function nutriCat(val,nut){
      // console.log(`Val: `+val+` Nut: `+nut) 
        result="";
        switch(nut){
          case "prot":{
                if(val <14){
                   result="Baja";
                }else if(val >=14 && val <=20){
                  result="Normal";  
                }else if(val >20){
                   result="Alta";
                }
          }break;
          case "gras":{

                if(val <20){
                   result="Baja";
                }else if(val >=20 && val <=35){
                  result="Normal";  
                }else if(val >35){
                   result="Alta";
                }
          }break;
          case "carb":{
                if(val <50){
                   result="Alta";
                }else if(val >=50 && val <=65){
                  result="Normal";  
                }else if(val >65){
                   result="Alta";
                }
          }break;
        }
        // console.log("Result: ",result+` Nut: `+nut)
        return result;
      }

}