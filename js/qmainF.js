	// ------declaracion de variables 1-------
	hljs.initHighlightingOnLoad();
	var width = 500;
	var height = 550;
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var clickedNode = 0;
	var svg = d3.select("#viz")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	var cola = cola.d3adaptor(d3)
		.size([width-50, height]);
	    // Use a timeout to allow the rest of the page to load first.
	//--------------recuperacion de datos ----
	function update(selection) {		
	    console.log("Let´s agrupate by " + selection)
	    if (selection=="otu"){
			prepareInfoH(); // limpio el espacio para mostrar el heatmap
			//-----Heatmap totales
            $.getScript("js/qheatmap.js", function(d) {
                	loadChart() ;
            });
            selection="ciudad";
	    }
	    // Use a timeout to allow the rest of the page to load first.
	    var loading = svg.append("text")	
	    	.attr("y", height / 2)
	    	.attr("x", width / 2 - 10)
	    	.attr("text-anchor", "middle")
	    	.attr("font-family", "sans-serif")
	    	.attr("font-size", 14)
	    		.style("font-style", "italic")		      
	        .attr('text-anchor', 'middle')
	        .text("Cargando visualización de agrupamiento por " + selection + ". Por favor espere . . .");
	    //----------------------------------------------------------------
	    d3.json("data/notriData.json")
	    	.then(function(netData) {
	        var groupMap = {};
	        netData.nodes.forEach(function(v, i) {
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
	        // fuerzas para los nodos
	        var netLayout = d3.forceSimulation(netData.nodes)
    			// .force("charge", d3.forceManyBodyReuse())
	        	.force("link", d3.forceLink(getLinkSelected(selection)).id((d) => d.ID)
	        	.strength(100));

	        d3.timeout(function() {
	            loading.remove();
	            for (var i = 0; i < 50; ++i) {
	                netLayout.stop();
	                netLayout.tick();
	            }
	            cola.nodes(netData.nodes)
	                .links(getLinkSelected(selection))
	                .groups(groups)
	                .jaccardLinkLengths(27, 0.5)
	                .avoidOverlaps(true)
        			.size([width, height])
					.start(10, 0, 20);

	            var group = svg.selectAll('.group')
	            	.data(groups)
	            	.enter()
	            	.append('rect')
	            	.classed('group', true)
	            	.attr('rx', 17)
	            	.attr('ry', 8)
	            	.style("fill", function(d) { return color(d.id); });

	            // var link = svg.selectAll(".link")
	            //     .data(getLinkSelected(selection))
	            //     	.enter()
	            //     	.append("line")
	            //     	.attr("class", "link")
	            //     	.style("stroke-width", function(d) {  return Math.sqrt(8); });

	            var node = svg.selectAll(".node")
	            	.data(netData.nodes)
	            	.enter()
	            	.append("circle")
        			.attr("xlink:href", "img/genderF1")
	            	.attr("class", "node")
	            	.attr("r", 3.5)
	            	.style("fill", function(d) {  return color(getSelector(d, selection)); })
	            	.call(cola.drag);
	            node.append("title")
	            	.text(function(d) {
	                		return "muestra: " + d.ID + " - "+ d.sexo+" de "+d.edad+" años, en  " + getSelector(d, selection)+". ";
	            });
			//---------------------interacción------------------------------
	            group.on('mouseover', function(d) {
	            		cleanInfoHeat();
	            		cleanInfoSBars();
	              	    d3.selectAll('.info').html("");
	            		item = d.id
		                // alert( 'Hola  vas a ampliar informacion de ' + item);
            			getInfo(netData.nodes,selection,item);
            			 $.getScript("js/smallBars.js", function(d) {
			            	console.log(`get in`)
			                	loadBars(item);
			            });

	            });
	            // group.on('mouseout', function(d) {	            	
	            //   	    d3.selectAll('.info').html("");
	            // 		cleanInfoHeat();
	            // 		cleanInfoSBars();	            	
	            // });
	            group.on("click",function(d) {
	            		cleanInfoHeat();
	            		cleanInfoSBars();
	            		prepareInfoB();
	              	    d3.selectAll('.info').html("");	              	    
            			// getInfo(netData.nodes,selection,item);
	            		item = d.id;
			            $.getScript("js/smallLines.js", function(d) {
			                	loadLines(item);
			            });
			            // $.getScript("js/smallBars.js", function(d) {
			            //     	loadBars(item);
			            // });

	            });

	            group.append("title")
	            	.text(function(d) {  return selection + ": " + d.id });
	            //---------------Legends ----------------------------------------
			    var issue = svg.selectAll(".issue")
			     .data(groups) // Select nested data and append to new svg group elements
			     .enter()
  			    var legendSpace = 100 / groups.length; 
			    issue.append("rect")
			      .attr("width", 10)
			      .attr("height", 10)           
			      .attr("x", (width /70)-5 ) 
			      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
			      .attr("fill",function(d) { return  color(d.id);  })
			      .attr("class", "legend-box")

			    issue.append("text")
		    	  // .attr("text-anchor", "middle")
		    	  .attr("font-family", "sans-serif")
		    	  .attr("font-size", 10)
			      .attr("x", (width /50)+3) 
			      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
			      .text(function(d) { return d.id; }); 

	            //--------------end -Legends ---------------------------------------
	            node.call(d3.drag()
	            	.on("start", dragstarted)
	            	.on("drag", dragged)
	            	.on("end", dragended));

	            cola.stop()
	            	.start();
	            for (var i = 0; i < 10; ++i) {
	                // link.attr("x1", function(d) { return d.source.x; })
	                // 	.attr("y1", function(d) { return d.source.y; })
	                // 	.attr("x2", function(d) { return d.target.x; })
	                // 	.attr("y2", function(d) { return d.target.y; });

				    node.attr("cx", function(d) { return d.x = Math.max(3, Math.min(width - 3, d.x)); })
				        .attr("cy", function(d) { return d.y = Math.max(3, Math.min(height - 3, d.y)); });

			            // node.attr("cx", function (d) { return d.x; })
			            //     .attr("cy", function (d) { return d.y; });
	                group.attr('x', function(d) { return d.bounds.x}).attr('y', function(d) {return d.bounds.y })
	                	.attr('width', function(d) { return d.bounds.width() })
	                	.attr('height', function(d) { return d.bounds.height() });
	            };
	            cola.stop();
//-----------------------------------------

 

			//--------------------------Funciones--------------------------------
	            function tick() {
	                node.call(updateNode) //constrains/fixes x-position
	                // link.call(updateLink)
	                netLayout.stop();
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
							                                result += "<tr><td colspan=4>En la ciudad de: <b>" + Ciudad + "</b> </td></tr>";
		                                	console.log(`>>` + key, info[key], )
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
		                                	console.log(`>>` + key, info[key], )
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
	                    case "bmi":
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
		                                	console.log(`>>` + key, info[key], )
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
	                        result = netData.links;
	                }
	                
	                 d3.selectAll('.info')
	                 		.html("").append('tr')
			            	.style("font-family", "Arial")
			            	.style("font-size", 10)
	                    	.html(result);
	            }
	        }); //timeout
	        //************************************
	        function fixna(x) {
	            if (isFinite(x)) return x;
	            return 0;
	        }
	        // funcion para actualizar los nodos
	        function updateNode(node) {
	        	    // transition
		      	var t = d3.transition()
		          .duration(750);

	            node.attr("transform", function(d) {
	                return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
	            });
              	node
		          .transition(t)
		          .style("fill", "#3a403d")
		          .attr("r", function(d){ return d.size; });
	        }
	        // funcion para actualizar los enlaces
	        function updateLink(link) {
	            link.attr("x1", function(d) {
	                return fixna(d.source.x);
	            })
	            	.attr("y1", function(d) {
	                return fixna(d.source.y);
	            })
	            	.attr("x2", function(d) {
	                return fixna(d.target.x);
	            })
	            	.attr("y2", function(d) {
	                return fixna(d.target.y);
	            });
	        }

	        function getSelector(v, selection) {
	            switch (selection) {
	                case "ciudad":
	                    result = v.ciudad;
	                    break;
	                case "sexo":
	                    result = v.sexo;
	                    break;
	                case "bmi":
	                    result = v.estado_nutricional;
	                    break;
	                default:
	                    result = v.ciudad;
	            }
	            return result;
	        }

	        function getLinkSelected(selection) {
	            switch (selection) {
	                case "ciudad":
	                    result = netData.links;
	                    break;
	                case "sexo":
	                    result = netData.links_sexo;
	                    break;
	                case "bmi":
	                    result = netData.links_bmi;
	                    break;
	                default:
	                    result = netData.links;
	            }
	            return result;
	        }
	        // fun
	    }) //fin recuperacion datos
	    //----------------------------------------------------------------	
	    // Juego de funciones para manejar el Drga and Drop (start, run and end of the event)
	    function dragstarted(d) {
	        d3.event.sourceEvent.stopPropagation();
	        // d.fx = d.x;
	        // d.fy = d.y;
	        netLayout.velocityDecay(0);
	    }

	    function dragged(d) {
	        d.fx = d3.event.x;
	        d.fy = d3.event.y;
	    }

	    function dragended(d) {
	        // if (!d3.event.active) netLayout.alphaTarget(0);
	        // d.fx = null;
	        // d.fy = null;
	        netLayout.alphaTarget(0);
	        netLayout.velocityDecay(0);
	    }
	    //----------------------------------------------------------------				
	} // update
	function prepareInfoH(){
			cleanInfoHeat();			
       	    d3.select('td').remove();
       	    d3.select('.panel_2').append("div").attr("class", "heat1");
       	    d3.select('.panel_2').append("div").attr("class", "heat2");
       	    d3.select('.panel_2').append("div").attr("class", "heat3");
       	    d3.select('.panel_2').append("div").attr("class", "heat4");
       	    d3.select('.panel_2').append("div").attr("class", "heatmaps");
	}
	function prepareInfoB(){
			cleanInfoHeat();			
       	    d3.select('td').remove();
       	    d3.select('.panel_2').append("div").attr("class", "chart1");
       	    d3.select('.panel_2').append("div").attr("class", "chart2");
       	    d3.select('.panel_2').append("div").attr("class", "chart3");
       	    d3.select('.panel_2').append("div").attr("class", "chart4");
	}
	function cleanInfoHeat(){	
	        d3.selectAll('.info').html("");	
	    	d3.select('.heat1').remove();
       	    d3.select('.heat2').remove();
       	    d3.select('.heat3').remove();
       	    d3.select('.heat4').remove();
       	    d3.select('.heatmaps').remove();
	}
	function cleanInfoSBars(){	
	        d3.selectAll('.info').html("");	
	    	d3.select('.chart1').remove();
       	    d3.select('.chart2').remove();
       	    d3.select('.chart3').remove();
       	    d3.select('.chart4').remove();
	}

	d3.selectAll("button")
		.on("click", function(d, i, arr) {
		cleanInfoHeat();
       	    
	    d3.select("svg")
	    	.selectAll("*")
	    	.remove();
	    update(arr[i].id);
	});
	update("ciudad");