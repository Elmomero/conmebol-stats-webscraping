const {countriesStats} = require('./search/statsSearch')
const {generateExcelReport} = require('./data_manage/genetateReport')  
const main = async()=>{
  const countries = await countriesStats()
  generateExcelReport(countries)
}
main()



