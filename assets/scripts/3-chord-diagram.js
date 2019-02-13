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
    .attr("id", function(d,i) { 
      return "stationId_" + i;  //Unique id for each slice
    });

  // Append the title
  var fontSize = 14;
  var fontWidth = fontSize/2;
  var chartRadius = (arc.innerRadius()(layout.groups[0]));

  group.append("g")
    .append("text")
    .attr("x", 5)   //Move the text from the start angle of the arc
    .attr("dy", 16)
    .append("textPath")
    .style("font-size", fontSize +"px")
    .style("fill", "white")
    .attr("xlink:href",function(d,i){
      return "#stationId_" + i;
    })
    .text(function(d,i){
      var segmentLength = chartRadius*(d.endAngle - d.startAngle); // in px
      
      var label = data[i].name;
      var labelLength = label.length*fontWidth; // in px
      
      var diffLength = segmentLength - labelLength;

      if(diffLength < 0){
        
        var truncateNbrOfChar = -Math.floor(diffLength/fontWidth);
        return label.substring(0,label.length - truncateNbrOfChar);

      }else{
        return label;
      }
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

  // We add the links between groups
  g.selectAll()
  .data(layout)
  .enter()
  .append("path")
  .attr("d", path)
  .style("fill", function(d){
    return color(data[d.source.index].name);
  })
  .style("opacity", 0.8);
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

}
