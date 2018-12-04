// cityTarget="Medellin";
		//var svg = d3.select("svg"),svg2 = d3.select("svg2"),svg3 = d3.select("svg3"),svg4 = d3.select("svg4"),
	
    function loadBars(cityTarget){	
    console.log(`City: `+ cityTarget)	
			var margin = ({top: 10, right: 20, bottom: 80, left: 0}),
			 width = 300,
			 height = 100;
		// ---------------svg creations ---------------------------------
		      var svg = d3.select(".bar1")
		        .append("svg")
		        .attr("width", width)
		        .attr("height", 150)
	
		      svg.append('text')
		      .attr('class', 'nutriLabel')
		      .attr('x', width / 2 )
		      .attr('y', 10)
		      .attr('text-anchor', 'middle')
		      .text('Datos nutricionales para la ciudad de '+cityTarget)
   //---------------Legends ----------------------------------------
   				// legEstados=["Bueno","Malo"]
			    // var leg = svg.selectAll(".barLeg")
			    //  .data(legEstados) // Select nested data and append to new svg group elements
			    //  .enter()
  			    //   var legendSpace = 100 / 2; 
			    // leg.append("rect")
			    //   .attr("width", 10)
			    //   .attr("height", 10)           
			    //   .attr("x", width /30 ) 
			    //   .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
			    //   .attr("fill",function(d,i) { return  color(d[i]);  })
			    //   .attr("class", "legend-box")


		      var svg2 = d3.select(".bar2")
		        .append("svg")
		        .attr("width", width)
		        .attr("height", 150)
		    
		      var svg3 = d3.select(".bar3")
		        .append("svg")
		        .attr("width", width)
		        .attr("height", 150)
		    
		      var svg4 = d3.select(".bar4")
		        .append("svg")
		        .attr("width", width)
		        .attr("height", 150) 
		  
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			var x = d3.scaleBand()
			.rangeRound([0, width])
			.padding(2);

			var y = d3.scaleLinear()
					.rangeRound([height, 0]);


		d3.csv("data/microbio_meta.csv").then(function (data) {

		    var mov=0;
		    barNum=0;
			data = eval(data);
			lastAdded="";
			estado="";
			p="";
			g="";
			c="";
		    nutri_data=[];
		    nutri_data2=[];
		    nutri_data3=[];
		    nutri_data4=[];


		    data =data.filter(function(d){  return d.city == cityTarget;});
	    	// console.log(`Data Filtrada: `+data + ` city: `+cityTarget);

			    render(svg, splitData(data,nutri_data, 1));
			    render(svg2,splitData(data,nutri_data4,2));
			    render(svg3,splitData(data,nutri_data3,3));
			    render(svg4,splitData(data,nutri_data4,4));	
			// }
		//});
		//-----------------------------
		//
			function render(svgChart,matrix){
				x.domain(matrix.map(function (d) {
				// console.log("ids: "+d[0]);	
						return d[0];
					}));
				y.domain([0, d3.max(matrix, function (d) {
							return Number(d[5])+9;
						})]);

				var d3tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-4, 0])
				  .html(function(d) {
				  	setNutriEstado(d);
				  	estado=getEstado(p,g,c);
				  	info="<table><tr> <td colspan=3>Muestra: <b>"+d[0]+"</b>, " + d[2] + " de <b>" + d[3] + "</b> años</td></tr><tr> <td>%Proteina:</td>	<td>["+d[5]+"]</td>	<td><b>"+p+"</b></td> </tr><tr> <td> %Grasa: </td>	<td>["+d[6]+"]</td>	<td><b>"+g+"</b></td> </tr><tr> <td>%Carbohidratos:</td>	<td>["+d[7]+"]</td>	<td><b>"+c+"</b></td> </tr><tr> <td  colspan=3>Estado de salud: <b>" + estado + "</b></td></tr></table>";
				  	return info;
				  });

			var color = d3.scaleLinear()
		          .range(["#f4a582","#92c5de","#0571b0"])
		          .domain([0,14,21]);


				mov=0;    


				svgChart.append("g")
					.attr("transform", "translate(0," + (height-1) + ")")
					.call(d3.axisBottom(x))
					.selectAll("text")
				    .attr("y", 9)
				    .attr("x", 7)
				    .attr("dy", ".35em")
				    .attr("transform", "rotate(90)")
				    .style("text-anchor", "start");

				svgChart.append("g")
					.call(d3.axisLeft(y))
				    .attr("y", 9)
				    .attr("x", 7)
					//.append("text")
					/*.attr("fill", "#000")
					.attr("transform", "rotate(-90)")
					.attr("x", 0)
					.attr("y", 6)
					.attr("dy", "0.71em")
					.attr("text-anchor", "end")*/
					//.text("Dieta");

				svgChart.selectAll(".bar")
					.data(matrix)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function (d) {
						return (x(d[0])-17 <0)?0:x(d[0])-17;
						//startPos=( (x(d[0])-barNum) < 0)?0:x(d[0])-barNum;
						/*startPos =x(d[0])-barNum;
						console.log("START "+ startPos+" - "+x(d[0])+ " barNum: "+barNum)
						startPos=(barNum==0)?0:mov+14;
						//console.log("START "+ startPos+" - "+x(d[0]))
						//mov = (mov==0)?startPos:mov+14;// Ajustando la posiscion de las barras
						mov = (mov==0)?0:startPos;// Ajustando la posiscion de las barras
						return mov;*/
					})
					.attr("y", function (d) {
						return y(Number(d[5]));
					})
					.attr("width", x.bandwidth()+9.5)
					.attr("height", function (d) {
						return height - y(Number(d[5]));
					})
      				.attr("fill", function(d) {
      					setNutriEstado(d)
						clr=(getEstado(p,g,c)=="Malo")?1:15;

// console.log("col"+color(clr) +` clr: `+clr)
      					return color(clr)})
					.on('mouseover', d3tip.show)
			      	.on('mouseout', d3tip.hide);

				svgChart.call(d3tip);

			}//render

		});
	}//loadBars
		//-----------------------------colrgb(238, 167, 136)
		//
		  function splitData(Datos,matrix,indx){
		      matrix=[];
		      // console.log("Last: "+lastAdded);
		      Datos.forEach(function(d, i) {
		          var temp=[];
		          bot=25*(indx-1);
		          ceil=(indx*25)+1
		          barNum=bot;
		          if (i>=bot&& i < ceil && d.id!= lastAdded){
		          // console.log("Bot: "+bot+"  ceil: "+ceil+" - i: "+i+" - barNum: "+barNum);
		            temp.push(d.id);
		            temp.push(d.city);
		            temp.push(d.sex);
		            temp.push(d.age);
		            temp.push(d.fiber);
		            temp.push(d.per_protein);
		            temp.push(d.per_total_fat);
		            temp.push(d.per_carbohydrates);

		            matrix.push(temp);  
		          lastAdded=d.id;
		          }       
		      });
		      // console.log("Result Matrix: "+matrix);
		      return matrix;
		  }
		  function getEstado(p,g,c){
		  		return (p!="Normal" || g!="Normal" || c!="Normal")?"Malo":"Bueno";
		  }
		  function setNutriEstado(d){		  	
			  	p=nutriCat(d[5],"prot");
			  	g=nutriCat(d[6],"gras");
			  	c=nutriCat(d[7],"carb");
		  }
		function nutriCat(val,nut){
			result="";
			switch(nut){
				case "prot":{
							if(val <14){
								 result="Alta";
							}else if(val >=14 && val <=20){
								result="Normal";	
							}else if(val >20){
								 result="Baja";
							}
				}break;
				case "gras":{

							if(val <20){
								 result="Alta";
							}else if(val >=20 && val <=35){
								result="Normal";	
							}else if(val >35){
								 result="Baja";
							}
				}break;
				case "carb":{
							if(val <50){
								 result="Alta";
							}else if(val >=50 && val <=65){
								result="Normal";	
							}else if(val >65){
								 result="Baja";
							}
				}break;
			}
			//console.log("Result: "+result)
			return result;
		}