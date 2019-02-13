"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier JSON.
 */


/**
 * Précise le domaine de l'échelle de couleurs qui est utilisée pour distinguer chacune des stations de BIXI.
 *
 * @param color   Échelle de couleurs.
 * @param data    Données provenant du fichier JSON.
 */
function domainColor(color, data) {
  // TODO: Préciser le domaine de l'échelle de couleurs en y associant les stations de BIXI utilisées.
  var stations = [];
  data.forEach(function(d) {
    stations.push(d.name);
  });
  color.domain(stations);
}

/**
 * Précise le domaine de l'échelle utilisée pour l'axe X du diagramme à bandes.
 *
 * @param x       Échelle X à utiliser.
 * @param data    Données provenant du fichier JSON.
 */
function domainX(x, data) {
  // TODO: Préciser le domaine pour la variable "x" en y associant les stations de BIXI utilisées.
  var stations = [];
  data.forEach(function(d) {
    stations.push(d.name);
  });
  x.domain(stations)
}

/**
 * Précise le domaine de l'échelle utilisée pour l'axe Y du diagramme à bandes.
 *
 * @param y             Échelle Y à
 * @param currentData   Les données qui sont actuellement utilisées par le diagramme.
 */
function domainY(y, currentData) {
  // TODO: Préciser le domaine pour la variable "y" en prenant comme minimum et maximum le nombre de trajets vers une station de BIXI.
  var counts = [];
  currentData.destinations.forEach(function(d){
    counts.push(+d.count);
  });
  y.domain([d3.min(counts),d3.max(counts)]);
}

/**
 * Obtient la matrice d'adjacence à partir des données spécifiées pour créer le diagramme à cordes.
 *
 * @param data        Données provenant du fichier JSON.
 * @return {Array}    Une matrice de 10 x 10 indiquant le nombre de trajets partant et se dirigeant vers une station précise.
 */
function getMatrix(data) {
  // TODO: Calculer la matrice d'adjacence pour créer le diagramme à cordes.

  // Station Names
  var stations = [];
  data.forEach(function(d) {
    stations.push(d.name);
  });

  var adjMatrix = new Array(stations.length);
  for (var i = 0; i < stations.length; i++) {
    adjMatrix[i] = new Array(stations.length).fill(0);
  }

  data.forEach(function(source_station){

    var xIndex = stations.indexOf(source_station.name);

    source_station.destinations.forEach(function(dest_station){

      var yIndex = stations.indexOf(dest_station.name);

      //console.log(source_station.name + " -> " + dest_station.name + " = " + dest_station.count);
      adjMatrix[xIndex][yIndex] = dest_station.count;
    });
  });

  return adjMatrix;
}

/**
 * Obtient le nombre total de trajets réalisés pour le mois d'août 2015.
 *
 * @param data    Données provenant du fichier JSON.
 */
function getTotal(data) {
  // TODO: Calculer le nombre total de trajets réalisés pour le mois d'août 2015.

  function functor(d){
    var subTotal = 0;
    d.destinations.forEach(function(dest_station){
      subTotal += dest_station.count;
    });
    return subTotal;
  }

  var total = 0;

  if(data.length > 1){
    data.forEach(function(source_station){
      total += functor(source_station);
    });
  }else{
    total = functor(data);
  }  

  return total;
}
