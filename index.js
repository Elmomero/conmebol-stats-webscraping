const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.365scores.com/es-mx/football/south-america/conmebol-wc-qualification/league/613/standings"
  );

  await page.waitForSelector(".standings-widget_competitor_name_text__1xvY3");
  await page.screenshot({ path: "pantalla-busqueda-3.jpg" });
  const paises = await page.evaluate(() => {
    let countries = [],
      statsPaises = [],
      objectCountries={};

    const paises = document.querySelectorAll(
      "div[class*='ellipsis standings-widget_competitor_name_text__1xvY3']"
    );
    const stats = document.querySelectorAll(
      'td[class*="standings-widget_table_text_cell__VSn44"]'
    );

    stats.forEach((el) => countries.push(el.innerText));
    for (let i = 0; i < countries.length; i += 8) {
      statsPaises.push(countries.slice(i, i + 8));
    }
    paises.forEach((pais, i) => {
      objectCountries[pais.innerText] = {
        nombre: pais.innerText,
        stats: {
          resultado_actual: statsPaises[i][0],
          partidos_jugados: statsPaises[i][1],
          goles: statsPaises[i][2],
          gol_diferencia: statsPaises[i][3],
          puntos: statsPaises[i][4],
          ganados: statsPaises[i][5],
          empatados: statsPaises[i][6],
          perdidos: statsPaises[i][7],
        },
      };
    });

    return objectCountries;
  });
  await browser.close();
  console.log(paises);
})();
