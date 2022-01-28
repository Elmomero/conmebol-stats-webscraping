const puppeteer = require("puppeteer");
const countriesStats = async () => {
  try {
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
    return countries
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports = {
  countriesStats
}
