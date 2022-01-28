const xl = require("excel4node");
const {countriesStats} = require('./search/statsSearch')
  
const main = async()=>{
  const countries = await countriesStats()
  let arrCountries = [];
  //obtener arreglo para facilidad de iteracion
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
  wb.write("./docs/conmebol-stats.xlsx");
}
main()



