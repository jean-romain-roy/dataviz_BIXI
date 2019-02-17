"use strict";

/**
 * Fichier permettant de dessiner le diagramme à cordes.
 */


/**
 * Crée les groupes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param arc             Fonction permettant de dessiner les arcs.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://bl.ocks.org/mbostock/4062006
 */
function createGroups(g, data, layout, arc, color, total, formatPercent) {
  /* TODO:
     - Créer les groupes du diagramme qui sont associés aux stations de BIXI fournies.
     - Utiliser un "textPath" pour que les nom de stations suivent la forme des groupes.
     - Tronquer les noms des stations de BIXI qui sont trop longs (Pontiac et Métro Mont-Royal).
     - Afficher un élément "title" lorsqu'un groupe est survolé par la souris.
  */

  var group = g.append("g")
              .selectAll("g")
              .data(layout.groups)
              .enter();
  
              
  // We add he groups on the outer part of the circle
  group.append("g")
    .append("path")
    .style("fill", function(d,i){ 
      return color(data[i].name)
    })
    .attr("d",arc)
    .attr("class","groups")
    .attr("id", function(d,i) { 
      return "stationId_" + i;  //Unique id for each slice
    });       
  
  // We append the title
  var fontSize = 12;

  group.append("g")
    .append("text")
    .attr("x", 5)   //Move the text from the start angle of the arc
    .attr("dy", 16)
    .append("textPath")
    .style("font-size", fontSize +"px")
    .style("fill", "white")
    .attr("class","groups")
    .attr("xlink:href",function(d,i){
      return "#stationId_" + i;
    })
    .text(function(d,i){
      
      var label = data[i].name;

      if(label.includes("Pontiac")){        
        return label.substring(0,7);

      }else if(label.includes("Mont-Royal")){
        return label.substring(0,16);

      }else{
        return label;
      }
    });

  // Define the div for the tooltip
  var div = d3.select("body").append("div")	
                  .attr("class", "tooltip")				
                  .style("opacity", 0);

  function titleMessage(i){
    return data[(i % 10)].name + ": " + formatPercent(getTotal(data[(i % 10)])/total) + " des departs";
  }

  group.selectAll("g")
    .on("mouseover", function(d,i){
      div.transition()		
          .duration(200)		
          .style("opacity", 1);
          
      div.html(titleMessage(i))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d){
      div.transition()		
          .duration(200)		
          .style("opacity", .0);
    });
}

/**
 * Crée les cordes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param path            Fonction permettant de dessiner les cordes.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://beta.observablehq.com/@mbostock/d3-chord-dependency-diagram
 */
function createChords(g, data, layout, path, color, total, formatPercent) {
  /* TODO:
     - Créer les cordes du diagramme avec une opacité de 80%.
     - Afficher un élément "title" lorsqu'une corde est survolée par la souris.
  */

  var group = g.append("g")
    .selectAll("g")
    .data(layout)
    .enter();

  // We add the links between groups
  group.append("g")
    .append("path")
    .attr("class","links")
    .style("fill", function(d,i){ 
      return color(data[d.source.index].name);
    })
    .attr("id", function(d,i) { 
      return "linkId_" + i;  //Unique id for each slice
    })
    .attr("d", path)
    .style("opacity", 0.8);

    // Define the div for the tooltip
  var div = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

  function titleMessage(d){
    return data[(d.source.index % 10)].name + " -> " + data[(d.target.index % 10)].name 
                + ": " + formatPercent(d.source.value/total) + "<br>" +
           data[(d.target.index % 10)].name + " -> " + data[(d.source.index % 10)].name 
                + ": " + formatPercent(d.target.value/total);
  }

  group.selectAll("g")
  .on("mouseover", function(d,i){

    div.transition()		
    .duration(200)		
    .style("opacity", 1);

    div.html(titleMessage(d))
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
    })
  .on("mouseout", function(d){
    div.transition()		
    .duration(200)		
    .style("opacity", .0);
  });
}

/**
 * Initialise la logique qui doit être réalisée lorsqu'un groupe du diagramme est survolé par la souris.
 *
 * @param g     Le groupe SVG dans lequel le diagramme à cordes est dessiné.
 */
function initializeGroupsHovered(g) {
  /* TODO:
     - Lorsqu'un groupe est survolé par la souris, afficher les cordes entrant et sortant de ce groupe avec une
       opacité de 80%. Toutes les autres cordes doivent être affichées avec une opacité de 10%.
     - Rétablir l'affichage du diagramme par défaut lorsque la souris sort du cercle du diagramme.
  */


  function sameGroup(input,other){

    if(other.source.index == input.index){
      return true;
    }

    if(other.target.index == input.index){
      return true;
    }

    return false;
  }

  
  g.selectAll(".groups")
    .on("mouseover", function(d) {

      var links = g.selectAll(".links");
      links.filter(function(x){
        return !sameGroup(d,x);
      }).transition()
      .duration(300)
      .style("opacity",0.1);
    })
    .on("mouseout", function(d) {
      var links = g.selectAll(".links");
      links.filter(function(x){
        return !sameGroup(d,x);
      }).transition()
      .duration(300)
      .style("opacity",0.8);
      
    });

  g.selectAll(".links")
    .on("mouseover", function(d) {
      var links = g.selectAll(".links");
      links.filter(function(x){
        return !sameGroup(d.source,x);
      }).transition()
      .duration(300)
      .style("opacity",0.1);
      
    })
    .on("mouseout", function(d) {
      var links = g.selectAll(".links");
      links.filter(function(x){
        return !sameGroup(d.source,x);
      }).transition()
      .duration(300)
      .style("opacity",0.8);
    });
    
}
