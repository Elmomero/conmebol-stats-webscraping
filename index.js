const puppeteer = require("puppeteer");
const xl = require("excel4node");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.365scores.com/es-mx/football/south-america/conmebol-wc-qualification/league/613/standings"
  );

  await page.waitForSelector(".standings-widget_competitor_name_text__1xvY3");
  await page.screenshot({ path: "./images/pantalla-posiciones.jpg" });
  const countries = await page.evaluate(() => {
    let countries = [],
      statsCountries = [],
      objectCountries = {};

    const countriesNames = document.querySelectorAll(
      "div[class*='ellipsis standings-widget_competitor_name_text__1xvY3']"
    );
    const stats = document.querySelectorAll(
      'td[class*="standings-widget_table_text_cell__VSn44"]'
    );

    stats.forEach((el) => countries.push(el.innerText));
    for (let i = 0; i < countries.length; i += 8) {
      statsCountries.push(countries.slice(i, i + 8));
    }
    countriesNames.forEach((pais, i) => {
      objectCountries[pais.innerText] = {
        name: pais.innerText,
        stats: {
          resultado_actual: statsCountries[i][0],
          partidos_jugados: statsCountries[i][1],
          goles_ratio: statsCountries[i][2],
          gol_diferencia: statsCountries[i][3],
          puntos: statsCountries[i][4],
          ganados: statsCountries[i][5],
          empatados: statsCountries[i][6],
          perdidos: statsCountries[i][7],
        },
      };
    });

    return objectCountries;
  });
  await browser.close();
  //obtener arreglo para facilidad de iteracion
  let arrCountries = [];
  Object.keys(countries).forEach((countryName) => {
    arrCountries.push(countries[countryName]);
  });
  //libro de trabajo
  const wb = new xl.Workbook();
  //hoja de trabajo
  const ws = wb.addWorksheet("Tabla_Posiciones_Conmebol");
  //Titulo de la tabla
  ws.cell(1, 4).string("Tabla de posiciones");
  //primera columna
  ws.cell(2, 1).string("Pais");
  //resto de columnas
  const table_entries = Object.keys(arrCountries[0].stats);
  //llenado de los paises
  Object.keys(countries).forEach((country, i) => {
    ws.cell(i + 3, 1).string(country);
  });
  //llenado de las categorias
  table_entries.forEach((category, i) => ws.cell(2, i + 2).string(category));
  //llenado de los puntajes
  arrCountries.forEach(({ stats }, i) => {
    let idx = i + 3;
    let arrStats = Object.values(stats);
    arrStats.forEach((stat, i) => {
      ws.cell(idx, i + 2).string(stat);
    });
  });
  //escritura del archivo
  wb.write("./docs/Excel.xlsx");
})();
