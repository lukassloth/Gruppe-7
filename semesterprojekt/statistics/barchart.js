/* Først skaber vi en funktion der tager data som parameter og sætter størrelsen på vores barchart. 
Dette er funktionen for barcharten der viser strømforbrug */
function barChart(data) {
  const width = 1000;
  const height = 500;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 200;
  const marginLeft = 40;

// Tager og vælger country som x-akse og sørger for at der er lidt padding imellem
  const x = d3.scaleBand()
      .domain(data.map(d => d.country)) 
      .range([marginLeft, width - marginRight])
      .padding(0.1);

/* Tager consumption_twh som vores y-akse og sætter makshøjden til 50.000
da dette passer bedst på vores data */
  const y = d3.scaleLinear()
      .domain([0, 50000]) 
      .range([height - marginBottom, marginTop]);

// Her laves et svg element
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

/* Her laves bars hvor højden er lavet ud fra consumption_twh.
Farven har vi sørget for passer til vores farveskema. */
  svg.append("g")
      .attr("fill", "#4d7327")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.country))
      .attr("y", d => y(d.consumption_twh)) // Sætter consumption til at være y-aksen
      .attr("height", d => y(0) - y(d.consumption_twh)) // Vælger højde ud fra værdien fra consumption_twh
      .attr("width", x.bandwidth());

/* Her laves sørger vi for at teksten står en smule på skrå på x-aksen
og justeret teksten så det er til at læse */
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")  
      .style("font-size", "15px")
      .style("text-anchor", "end")
      .attr("dx", "-12px")
      .attr("dy", "1.5px")
      .attr("transform", "rotate(-65)"); 

// Her smider vi noget styling på y-aksen så den er til at se
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Energy consumption (tWh)"));

  return svg.node();
}

/* Her laver vi en funktion der så henter vores funktion ind.
På linje 71 sletter vi det der allerede er i vores container, så der ikke kommer
flere barcharts på samme tid, så charten hele tiden vil være det samme sted .*/
function createLandPercentageChart() {
document.getElementById("chartContainer").innerHTML = '';
  fetch('/api/barchart-land-data')
    .then(response => response.json())
    .then(data => {
      console.log("Loaded land percentage data:", data); 
      const chart = barChartLandPercentage(data);
      document.getElementById("chartContainer").appendChild(chart); // Her vælger vi at det er i containeren at charten vises
    })
    .catch(function(error) {
      console.log("Error loading the land percentage data:", error);
    });
}

/* Her skabes funktionen for mængden af plads det ville kræve i solceller.
Den skabes på samme måde hvor vores data er en parameter og vi sætter en størrelse
på barcharten */
function barChartLandPercentage(data) {
  const width = 1000;
  const height = 500;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 200;
  const marginLeft = 40;

// Igen country på x-aksen med padding imellem
  const x = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

// En y-akse med 30 som maks højde
  const y = d3.scaleLinear()
      .domain([0, 30])
      .range([height - marginBottom, marginTop]);

// Her laves svg element
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

// Her laves bars til charten
  svg.append("g")
      .attr("fill", "#4d7327")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.country))
      .attr("y", d => y(d.avg_land_i_procent)) // Vælger avg_land_i_procent til y-aksen
      .attr("height", d => y(0) - y(d.avg_land_i_procent)) // Vælger højde på y-aksen ud fra værdien af y
      .attr("width", x.bandwidth());

// Her fikser vi igen teksten og styler x-aksen
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")  
      .style("font-size", "15px")
      .style("text-anchor", "end")
      .attr("dx", "-12px")
      .attr("dy", "1.5px")
      .attr("transform", "rotate(-65)"); 

// Her laves y-aksen og skriver hvad man ser
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Average Land (%)"));

  return svg.node();
}

// Funktion der finder barcharten frem, vælger vores chartcontainer og henter dataen ind
function createBarChartConsumption() {
document.getElementById("chartContainer").innerHTML = '';
fetch('/api/barchart-data')
  .then(response => response.json())
  .then(data => {
    console.log("Loaded data:", data);
    const chart = barChart(data);
    document.getElementById("chartContainer").appendChild(chart);
  })
  .catch(function(error) {
    console.log("Error loading the data:", error);
  });
}

// Tilføjer eventlisteners med knapper som gør at man kan kalde chartsne frem og skifte mellem dem
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('consumptionButton').addEventListener('click', createBarChartConsumption);
  document.getElementById('landPercentageButton').addEventListener('click', createLandPercentageChart);
  
// Til slut sørger vi for at der er en chart når siden starter op så der ikke er tomt
  createBarChartConsumption();
});
