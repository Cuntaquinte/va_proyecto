 function renderPie(item){    
    const qwidth = 270;
    const qheight = 270;
    const qradius = Math.min(qwidth, qheight) / 3;

    const qsvg = d3.select(".pieChart")
        .append("svg")
            .attr("width", qwidth)
            .attr("height", qheight)
        .append("g")
            .attr("transform", `translate(${qwidth / 2}, ${qheight / 2})`);
// alert(`aqui`)
    const qcolor = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
         "#e78ac3","#a6d854","#ffd92f"]);

    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(qradius);

    function arcTween(a) {
        const i = d3.interpolate(this._current, a);
        this._current = i(1);
        return (t) => arc(i(t));
    }


      qsvg.append('text')
        .attr('class', 'pieLabel')
        .attr('x', -135)
        .attr('y', -105)
        // .attr('text-anchor', 'middle')
        .style("text-anchor", "start")
        .attr("font-size", 11)
        .attr("font-family", "Helvetica")
        .attr("font-weight", "bold")
        .text('Cómo es la calidad de la dieta en  '+item+'?')

cityTarget=item;

    d3.json("data/estado.json").then(data => {  
        qupdate(cityTarget);

        function qupdate(val = this.value) {
            // alert(val)
            // Join new data
            const path = qsvg.selectAll("path")
                .data(pie(data[val]));

            // Update existing arcs
            path.transition().duration(200).attrTween("d", arcTween);

            // Enter new arcs
            path.enter().append("path")
                .attr("fill", (d, i) => qcolor(i))
                .attr("d", arc)
                .attr("stroke", "white")
                .attr("stroke-qwidth", "6px")
                .each(function(d) { this._current = d; })

            const g = qsvg.selectAll('.arc')
                .data(pie(data[val]))
                .enter()
            .append('g')
                .attr('class', 'arc');

            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                // .attr("transform", function(d) { return "translate(-50,-43)"; })
                .attr("dy", ".35em")
                .attr('x', -46 )
                .attr("font-size", 10)
                .text(function(d,i) { 
                    return d.data.region+" ["+d.data.count+"%]";
                })
        }

    });
}