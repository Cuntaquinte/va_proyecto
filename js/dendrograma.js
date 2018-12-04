
// Crea el espacio para el svg
var margin = {top: 20, right: 90, bottom: 30, left: 190},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Crea las variables para la transicion
var i = 0,
    duration = 750,
    root;

// Crea el DOM dentro del svg
var svg = d3.select(".dendro_chart").append("g")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// console.log("I created a template");


//..................................... VARIABLES GENERAÑES................................................
//*********************************************************************************************************
//Variables para identificar los atributos en mis datos
    var spendField = "Normal";
    var sumFields = ["Normal", "Sobrepeso", "Obesidad", "Bogota", "Medellin", "Bucaramanga", "Barranquilla", "Cali", "Hombre", "Mujer"];//Nombre de mis items en los datos con los valores de abundancias - serán los botones

//Variables para usar los Botones de la barra de navegacíon
    var botonNormal = d3.select(document.getElementById("normalButton"));
    var botonSobrepeso = d3.select(document.getElementById("sobrepesoButton"));
    var botonObesidad = d3.select(document.getElementById("obesidadButton"));
    var botonBogota = d3.select(document.getElementById("bogotaButton"));
    var botonMedellin = d3.select(document.getElementById("medellinButton"));
    var botonBucaramanga = d3.select(document.getElementById("bucaramangaButton"));
    var botonBarranquilla = d3.select(document.getElementById("barranquillaButton"));
    var botonCali = d3.select(document.getElementById("caliButton"));
    var botonHombre = d3.select(document.getElementById("hombreButton"));
    var botonMujer = d3.select(document.getElementById("mujerButton"));

//Variables para generar los datos dinámicos del tooltip
    var normalSpend = d3.select(document.getElementById("normalSpend"));
    var sobrepesoSpend = d3.select(document.getElementById("sobrepesoSpend"));
    var obesidasdSpend = d3.select(document.getElementById("obesidadSpend"));

//Variables para el tooltip
    var toolTip = d3.select(document.getElementById("toolTip"));
    var header = d3.select(document.getElementById("head"));
    var header1 = d3.select(document.getElementById("header1"));
    var header2 = d3.select(document.getElementById("header2"));
    var formatNumber = d3.format(",.2f");
    var formatCurrency = function (d) {
        return formatNumber(d) + " abundancia relativa"
    };


// Funcion para cambiar el estado de selección del boton
    function toggleButtons(index) {
        d3.selectAll(".button").attr("class",function (d,i) { return (i==index) ? "button selected" : "button"; });
    }

// Función para inicializar la visualizacion
        function initialize() {
//Botones estado nutricional
            botonNormal.on("click", function (d) {
                toggleButtons(0);
                spendField = "Normal";
                dupdate(root);
            });

            botonSobrepeso.on("click", function (d) {
                toggleButtons(1);
                spendField = "Sobrepeso";
                dupdate(root);
            });

            botonObesidad.on("click", function (d) {
                toggleButtons(2);
                spendField = "Obesidad";
                dupdate(root);
            });
//Botones para cada ciudad
            botonBogota.on("click", function (d) {
                toggleButtons(3);
                spendField = "Bogota";
                dupdate(root);
            });

            botonMedellin.on("click", function (d) {
                toggleButtons(4);
                spendField = "Medellin";
                dupdate(root);
            });

            botonBucaramanga.on("click", function (d) {
                toggleButtons(5);
                spendField = "Bucaramanga";
                dupdate(root);
            });

            botonBarranquilla.on("click", function (d) {
                toggleButtons(6);
                spendField = "Barranquilla";
                dupdate(root);
            });

            botonCali.on("click", function (d) {
                toggleButtons(7);
                spendField = "Cali";
                dupdate(root);
            });

//Botones ṕara el sexo
            botonHombre.on("click", function (d) {
                toggleButtons(8);
                spendField = "Hombre";
                dupdate(root);
            });

            botonMujer.on("click", function (d) {
                toggleButtons(9);
                spendField = "Mujer";
                dupdate(root);
            });

        }


// Cargando los datos a partir de un archivo .json
d3.json("data/tree_data_manual.json").then(function(treeData) {

    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = 0;
    root.y0 = 0;

  /// Collapsar todos los nodos excepto los hijos del root
    root.children.forEach(collapse);

    dupdate(root);
    initialize();

}); //Fin.json 

//+++++++++++++++Algunas funciones antes de ingresar los datos al svg +++++++++++++++++++++++++++

//Funcion para colapsar los nodos
function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

// Declarando el layout del arbol
var treemap = d3.tree().size([height, width]);

//Funcion para actualizar los datos
function dupdate(source) {
   var newHeight = Math.max(d3.tree()(root).descendants().length * 35, 0)
   console.log('newHeight', newHeight)
   console.log('root', root)
  
// Declarando el layout del arbol
    var treemap = d3.tree().size([newHeight, width]);
  
  // Asigna los valores para las posiciones x y y de cada uno de los nodos
  var treeData = treemap(root);
  
  // Declarando el arreglo de nodos y de links.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalizar datos a una profundidad determinada.
  nodes.forEach(function(d){ d.y = d.depth * 100});

  // Funcion para determinar el tamaño de los nodos 
  var  nodeRadius = d3.scaleSqrt()
            .domain([0, 1]) // Datos son abundancia relativa con valores entre 0 y 1
            .range([1, 60]);

  // Creando una escala de colores secuenciales desde un tono verde palido a un azul oscuro
  var z = d3.scaleSequential(d3.interpolateRgb("#a8ddb5","#0868ac"))
            .domain([0, 1]); //Valores originales corresponden a abundancia relativa maximo valor = 1

  // Redimensionando el svg
  d3.select('svg').attr("width", width + margin.right + margin.left)
    .attr("height", newHeight + margin.top + margin.bottom)


  // ***************************** NODOS ********************************

  // Actualiando los nodos
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Ingresando nuevos nodos en la posicón anterior de los padres (efecto de transicion)
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  // Circulo alrededor de los nodos
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      })
      .append("title").text(function(d) { return formatCurrency(d.data[spendField]);}); // Mini tooltip


  // Agregando el nombre de cada nodo
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("y", -10) 
      .style("fill","black") 
      .attr("x", function(d) {
          return d.children || d._children ? -10 : 10;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { 
    return d.data.name || d.data.type; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transición del nodo a la posicion correcta en su correspondiente nivel del arbol
  nodeUpdate.transition()
    .duration(duration)
    .attr('r', function(d) { return isNaN(nodeRadius(d.data[spendField]))  ? 30 : nodeRadius(d.data[spendField])/2;})
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Actualizando caracteristicas graficas del circulo
  nodeUpdate.select('circle.node')
//    .attr('r', 10)
      .attr('r', function(d) { return isNaN(nodeRadius(d.data[spendField]))  ? 30 : nodeRadius(d.data[spendField])/2;})
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  // Remover nodos previos
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // Al ocultar un nodo vuelve su nodo de tamaño mínimo
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // Al ocultar un nodo se reduce la opacidad de los labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

 
  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Ingresando nuevos links en la posicón anterior de los padres (efecto de transicion)
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      })
      .style("stroke-width", function(d){ return nodeRadius(d.data[spendField]);})
      .style("stroke", d => z(d.data[spendField]));

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition hacia la posicion del padre
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) })
      .style("stroke-width", function(d){ return nodeRadius(d.data[spendField]);});

  // Remover links previos
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Almacenar nodos anteriores para la transición.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Crea una diagonal desde el nodo padre al nodo hijo
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Funcion para colapsar o abrir los nodos despues del click
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    dupdate(d);
  }

}
//********** Barrita del Color scale ********* 


    var data2 = [];
    for (var i=0; i<10; i++) { data2.push(i) }
    
    var x = d3.scalePoint() 
        .range([0,300])
        .domain(data2.map(d => d))
        .padding(0.5);
    
    var rainbow = d3.scaleSequential(d3.interpolateRgb("#a8ddb5","#0868ac"))
        .domain(d3.extent(data2,d=>d));
    
    svg.selectAll('rect')
      .data(data2)
      .enter().append('rect')
      .attr('x', d => x(d))
      .attr('y', 0)
      .attr('width', x.step())
      .attr('height', 10)
      .attr('fill', d => rainbow(d))

    svg.selectAll("text")
        .data(data2)
        .enter()
        .append("text")
        .text(d => (d/10))
        .attr("x", d => x(d))
        .attr("y", 0)
        .attr("font-size", "5pt")
        .attr("font-family", "sans-serif")
        .attr("fill", "black");  

    svg.append('text')
        .attr('class', 'otuLabel')
        .attr('x', 5 )
        .attr('y', 5)
        .attr('text-anchor', 'end')
        .attr("font-size", "10pt")
        .attr("font-family", "sans-serif")
        .text('Abundancia relativa');

//****************************
