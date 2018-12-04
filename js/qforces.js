
update("ciudad");	
//	graph data store
var graph;

var svg = d3.select("svg")
			// .append("svg")
			.attr("width", 500)
			.attr("height", 400);
var width = 500,
    height = 500;

var radius = 10;
var svgL = d3.select(".legend")
			.append("svg").attr("class", "issue")
			.attr("y", 20)
			.attr("width", 100)
			.attr("height", 200);
//	d3 color scheme
var color = d3.scaleOrdinal(d3.schemeCategory10);


//-----------------------------------------------------------
var info = svg.append("text")
    .attr('class', 'infoLabel')
    .attr('x', (width / 5)-50 )
    .attr('y', 10)
    .attr('text-anchor', 'start')
	.attr("font-size", 12)
    .text("");

var label= svg.append("text")
	.attr("class","qselection")
    .attr("text-anchor", "end")
    .attr("y", height -2)
    .attr("x", width - 500)
    .attr("transform", "rotate(-90)")
	.attr("font-family", "Helvetica")
	.attr("font-weight", "bold")
	.attr("fill","#ddd")
	.attr("font-size", 129)
    .text("");
//--------------------------------------------------------    
// elements for data join
var link = svg.append("g").selectAll(".link"),
	node = svg.append("g").selectAll(".node");

//	simulation initialization
var simulation = d3.forceSimulation()
    .velocityDecay(0.6)
	.force("link", d3.forceLink().id(function(d) { return d.ID; }))
	.force("charge", d3.forceManyBody().strength(-1))
    .force("collide", d3.forceCollide().radius(9))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

var selected="ciudad";

//	follow v4 general update pattern
function update(selection) {

		prepareInfoH();
    if (selection=="otu"){
  	    d3.selectAll('.qMain').style("visibility","visible");
  	    d3.selectAll('.aux').style("visibility","visible");
  	    d3.selectAll('.frc').style("visibility","visible");
  	    d3.selectAll('.info').html("");
		d3.selectAll('.force').html("");	
		prepareInfoH();  
        $.getScript("js/qheatmap.js", function(d) {
            	loadChart() ;
        });
        selection="ciudad";
    }else{  
		prepareInfoH();
	  	    d3.selectAll('.info').style("visibility","visible");
	  	    d3.selectAll('.qMain').style("visibility","visible");
	  	    d3.selectAll('.aux').style("visibility","visible");
	  	    d3.selectAll('.frc').style("visibility","visible");

	  	// }
    }
//	load and save data
	d3.json("data/notriData.json").then(function(g) {
		graph = g;
		// update("ciudad");
		selected=selection;
		// Add the year label; the value is set on transition.
		var infoLabel= (selection=="imc")?"Indice de Masa Corporal":selection;
		if (selection!="otu"){ info.text("Muestras agrupadas por "+infoLabel) }
		label.text((selection=="imc")?"I.M.C.":selection);
		// console.log(`graph: `,graph,` selection: `,selection)
		// DATA JOIN
		switch (selection) {
	        case "ciudad":
	            link = link.data(graph.links);
	            break;
	        case "sexo":
	            link = link.data(graph.links_sexo);
	            break;
	        case "imc":
	            link = link.data(graph.links_bmi);
	            break;
	        default:
	            link = link.data(graph.links);
	    }

		// link = link.data(firstLinks ? graph.links : graph.links_sexo);
		//var selection =(firstLinks ?"ciudad" :"sexo");

	// console.log(selection)
	  	// Remove old links  -EXIT links
		link.exit().remove();
		// ENTER links
		link = link.enter().append("line")
			.attr("class", "link")
			.merge(link);
		// DATA JOIN  nodes
		node = node.data(graph.nodes);
		// EXIT  nodes
		node.exit().remove();
		// ENTER nodes
		node = node.enter().append("circle")
			.attr("class", "qnode")
			.attr("r", 6)
      		.style("cursor", "pointer")
			.attr("fill", function(d) {
				// item=(firstLinks ?d.ciudad:d.sexo)
				switch (selection) {
			        case "ciudad":
			            item = d.ciudad;
			            break;
			        case "sexo":
			            item = d.sexo;
			            break;
			        case "imc":
			            item = d.estado_nutricional;
			            break;
			        default:
			            item = d.ciudad;
			    }
				// console.log(`item: `+item)
				return color(item);
			})
			.call(d3.drag()
	          .on("start", dragstarted)
	          .on("drag", dragged)
	          .on("end", dragended)
	        )
			.merge(node);


            node.append("title")
            	.text(function(d) {
                		return "muestra: " + d.ID + " - "+ d.sexo+" de "+d.edad+" años, en  " + getSelector(d, selection)+". ";
            });
		//	Set nodes, links, and alpha target for simulation
		simulation
			.nodes(graph.nodes)
			.on("tick", ticked);

	  	simulation.force("link")
	  		.links((selection=="ciudad") ? graph.links :(selection=="sexo") ? graph.links_sexo:graph.links_bmi);

	  	simulation.alphaTarget(0.3).restart();
	  	//--------------------------Legend---------------------------
	    var groupMap = {};
	    graph.nodes.forEach(function(v, i) {
	        var g = getSelector(v, selection);
	        if (typeof groupMap[g] == 'undefined') {
	            groupMap[g] = [];
	        }
	        groupMap[g].push(i);
	        v.width = v.height = 10;
	    });
	    var groups = [];
	    for (var g in groupMap) {
	        groups.push({
	            id: g,
	            leaves: groupMap[g]
	        });
	    }
	  	var issue = svgL.selectAll(".issue")
	     .data(groups) // Select nested data and append to new svg group elements
	     .enter();
		var legendSpace = 100 / groups.length; 
	    box =issue.append("rect")
	      .attr("width", 20)
	      .attr("height", 20)           
	      .attr("x", (width /70)-5 ) 
	      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) +50; })  // spacing
	      .attr("fill",function(d) { return  color(d.id);  })
	      .attr("class", "legend-box")

	    issue.append("text")
		  // .attr("text-anchor", "middle")
		  .attr("font-family", "sans-serif")
		  .attr("font-size", 12)
	      .attr("x", (width /50)+15) 
	      .attr("y", function (d, i) { return ((legendSpace)+i*(legendSpace))+65; })  // (return (11.25/2 =) 5.625) + i * (5.625) 
	      .text(function(d) { return d.id; }); 

			box.append("title")
            	.text(function(d) {
                		return d.id;
            });
			//---------------------interacción------------------------------
			box.on('mouseover', function(d) {
			  	    d3.selectAll('.vizSex').html("");
					prepareInfoB();
					prepareSB();
					// cleanInfoHeat();
					cleanInfoSLines()
					 prepareInfoH();
					// d3.select('.columns').remove();
			  	    d3.selectAll('.stackB').html("");
			  	    d3.selectAll('.info').html("");
					var qItem = d.id
					console.log('id: ',d.id)
					getInfo(graph.nodes,selection,qItem);

	                 d3.selectAll('.info')
                 		.append('tr')
                 		.append('td')
                 		.append('div')
                 		.attr("class", "pieChart");
					if(selection=="ciudad"){
			             $.getScript("js/pie.js", function(d) {
					            	renderPie(qItem);
					        });
			        }

			});
			box.on("click",function(d) {
			  	    d3.selectAll('.vizSex').html("");
					prepareInfoB();
					prepareSB();
					cleanInfoSLines();
					prepareInfoH();
			  	    d3.selectAll('.info').html("");
			  	    d3.selectAll('.stackB').html("");	                      			
					var qTarget = d.id;

					if(selection=="ciudad"){
			            $.getScript("js/smallLines.js", function(d) {
			                	loadLines(qTarget);
			            });
			        }else if(selection=="sexo"){
			            $.getScript("js/pyramid.js", function(d) { });
			        }else if(selection=="imc"){
			            $.getScript("js/stackBars.js", function(d) {
							 	loadStackBars();
			            });
			        }
			});

		});//getting data
}//update

//	drag event handlers
function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}

//	tick event handler (nodes bound to container)
function ticked() {
	// console.log(`width: `,width-radius,` height: `,height-radius)
	    node
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(400, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(400, d.y)); });
        // .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        // .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

        node
		.attr("fill", function(d) {
			// item=(firstLinks ?d.ciudad:d.sexo);
			item=((selected=="ciudad") ? d.ciudad :(selected=="sexo") ? d.sexo:d.estado_nutricional);
			// console.log(`item: `+item)
			return color(item);
		})
        
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
}

function getSelector(v, selection) {
    switch (selection) {
        case "ciudad":
            result = v.ciudad;
            break;
        case "sexo":
            result = v.sexo;
            break;
        case "imc":
            result = v.estado_nutricional;
            break;
        default:
            result = v.ciudad;
    }
    return result;
}
	function getInfo(node, selection,item) {
	                var result = "";
	                var Ciudad= "";
	                var Sexo= "";
	                var Bmi= "";
	                var info = "";
	                switch (selection) {
	                    case "ciudad":
	                        {
	               				$("#otu").removeClass('btnselected');
	                        	$("#ciudad").addClass('btnselected');
								cleanInfoHeat();
	                            var totCiudad = d3.nest()
	                            	.key(function(d) {  return d.ciudad;  })
  									.key(function(d) { return d.sexo; })
  									.key(function(d) { return d.estado_nutricional; })
	                            	.rollup(function(v) { return v.length;  })
	                            	.entries(node);
	                            info = totCiudad;
	                            // console.log(`Info: `+item);
	                            Object.keys(info)
	                            	.forEach(function(key) {
	                            			// console.log(`Entré Key: `+info[key].key + `Item: `+item);
	                            		if (info[key].key == item){
		                            		result += "<td><table style='margin-top: 0'>";
		                            		Ciudad= info[key].key;//nombre de la ciudad
							                                result += "<tr><td colspan=4>En la ciudad de: <strong>" + Ciudad + "</strong> </td></tr>";
		                                	// console.log(`>>` + key, info[key], )
		                                	sex=info[key].values;//arreglo de datos por sexo
		                                	Object.keys(sex)
		                                		.forEach(function(keyCiudad) {
		                            				Sexo= sex[keyCiudad].key;//nombre del sexo
							                                result += "<tr><td colspan=4>para el sexo <b><i>" + Sexo + "</i></b> se registraron:</td></tr>";
							                                // result += "<tr><td><i>personas</i></td><td><i>con peso</i></td></tr>";

		                                			bmi=sex[keyCiudad].values;//arreglo de valores de bmi por sexo
				                                	Object.keys(bmi)
				                                		.forEach(function(keyBmi) {
		                            						Bmi= bmi[keyBmi].key;//nombre del bmi
							                                result += "<tr><td>" + bmi[keyBmi].value + " <i>personas</i> </td><td> con " +Bmi+" </td></tr>";
				                                		});
		                                		});
							        		result += "</td></tr>\n</table></td>";
							        	}
	                            })
	                        }
	                        break;
	                    case "sexo":
	                        {
								cleanInfoHeat();
	                            var totCiudad = d3.nest()
	                            	.key(function(d) {  return d.sexo;  })
  									.key(function(d) { return d.ciudad; })
  									.key(function(d) { return d.estado_nutricional; })
	                            	.rollup(function(v) { return v.length;  })
	                            	.entries(node);
	                            info = totCiudad;
	                            console.log(`Info: `+info);
	                            Object.keys(info)
	                            	.forEach(function(key) {
	                            		if (info[key].key == item){
		                            		result += "<td><table style='margin-top: 0;'>";
		                            		Sexo= info[key].key;//nombre de la ciudad
							                                result += "<tr><td colspan=4>En la categoria de: <b>" + Sexo + "</b> </td></tr>";
		                                	// console.log(`>>` + key, info[key], )
		                                	ciud=info[key].values;//arreglo de datos por sexo
		                                	Object.keys(ciud)
		                                		.forEach(function(keyCiudad) {
		                            				Ciudad= ciud[keyCiudad].key;//nombre del sexo
							                                result += "<tr><td colspan=4>para la ciudad <b><i>" + Ciudad + "</i></b> se registraron:</td></tr>";
							                                // result += "<tr><td><i>personas</i></td><td><i>con peso</i></td></tr>";

		                                			bmi=ciud[keyCiudad].values;//arreglo de valores de bmi por sexo
				                                	Object.keys(bmi)
				                                		.forEach(function(keyBmi) {
		                            						Bmi= bmi[keyBmi].key;//nombre del sexo
							                                result += "<tr><td>" + bmi[keyBmi].value + " <i>personas</i> </td><td> con " +Bmi+" </td></tr>";
				                                		});
		                                		});
							        		result += "</td></tr>\n</table></td>";
							        	}
	                            })
	                        }
	                        break;
	                    case "imc":
	                        {
								cleanInfoHeat();	                            
	                            var totCiudad = d3.nest()
	                            	.key(function(d) {  return d.estado_nutricional;  })
  									.key(function(d) { return d.ciudad; })
  									.key(function(d) { return d.sexo; })
	                            	.rollup(function(v) { return v.length;  })
	                            	.entries(node);
	                            info = totCiudad;
	                            console.log(`Info: `+info);
	                            Object.keys(info)
	                            	.forEach(function(key) {
	                            		if (info[key].key == item){
		                            		result += "<td><table style='margin-top: 0;'>";
		                            		Bmi= info[key].key;//nombre de la ciudad
							                result += "<tr><td colspan=4>En la categoria de: <b>" + Bmi + "</b> </td></tr>";
		                                	// console.log(`>>` + key, info[key], )
		                                	ciud=info[key].values;//arreglo de datos por sexo
		                                	Object.keys(ciud)
		                                		.forEach(function(keyCiudad) {
		                            				Ciudad= ciud[keyCiudad].key;//nombre del sexo
							                                result += "<tr><td colspan=4>para la ciudad <b><i>" + Ciudad + "</i></b> se registraron:</td></tr>";
							                                // result += "<tr><td><i>sexo</i></td><td><i>cantidad</i></td></tr>";

		                                			sex=ciud[keyCiudad].values;//arreglo de valores de bmi por sexo
				                                	Object.keys(sex)
				                                		.forEach(function(keySex) {
		                            						Sexo= sex[keySex].key;//nombre del sexo
							                                result += "<tr><td>" + sex[keySex].value + " </td><td> " +Sexo+" </td></tr>";
				                                		});
		                                		});
							       			 result += "</td></tr>\n</table></td>";
							       		}
	                            })
	                        }
	                        break;
	                    default:
	                        // result = netData.links;
	                }
	                
	                 d3.selectAll('.info')
	                 		.html("").append('tr')
			            	.style("font-family", "Arial")
			            	.style("font-size", 10)
	                    	.html(result);
	}

	function prepareInfoH(){
			cleanInfoHeat();			
       	    // d3.select('td').remove();

	        d3.selectAll('.heatmaps').html("");
	        d3.selectAll('.hmLegend').html("");
       	    // d3.select('.aux').append("div").attr("class", "hmLegend");
       	    d3.select('.heatmaps').append("div").attr("class", "heat1 column");
       	    d3.select('.heatmaps').append("div").attr("class", "heat2 column");
       	    d3.select('.heatmaps').append("div").attr("class", "heat3 column");
       	    d3.select('.heatmaps').append("div").attr("class", "heat4 column");
       	    d3.select('.heatmaps').append("div").attr("class", "heat5 column");
       	    d3.select('.heatmaps').append("div").attr("class", "heat6 column");
       	    // d3.select('.heatmaps').append("div").attr("class", "heatmaps");
	}
	function prepareInfoB(){
			cleanInfoHeat();			
	        d3.selectAll('.info').html("");	

	    	d3.select('.chart1').remove();
       	    d3.select('.chart2').remove();
       	    d3.select('.chart3').remove();
       	    d3.select('.chart4').remove();

       	    d3.select('.lineChart').append("div").attr("class", "chart1");
	}
	function prepareSB(){
			cleanInfoHeat();			
	        d3.selectAll('.info').html("");	

	    	d3.select('.stackB').remove();	    	
       	    d3.select('.stackBarChart').append("div").attr("class", "stackB");
	}
	function cleanInfoHeat(){	
	    	d3.select('.heat1').remove();
       	    d3.select('.heat2').remove();
       	    d3.select('.heat3').remove();
       	    d3.select('.heat4').remove();
       	    d3.select('.heat5').remove();
       	    d3.select('.heat6').remove();
       	    // d3.select('.hmLegend').remove();
	}

	function cleanInfoSLines(){	

	        d3.selectAll('.dend').html("");
	        d3.selectAll('.info').html("");	
	    	d3.select('.visP').remove();
       	    d3.select('.visG').remove();
       	    d3.select('.visC').remove();

       	    d3.select('.vizSex').append("div").attr("class", "visP");
       	    d3.select('.vizSex').append("div").attr("class", "visG");
       	    d3.select('.vizSex').append("div").attr("class", "visC");

	}

//---------------------

d3.selectAll(".butCtrl")
	.on("click", function(d, i, arr) {		       	    
	    d3.selectAll('.issue').html("");
	    update(arr[i].id);
	    console.log(`selection: `+arr[i].id)
	});
