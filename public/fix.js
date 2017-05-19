const fs = require('fs')

const data = require('./data/moreData.json')
/*
const genres = data.map(x => x.genres)

for (let i = 0; i < genres.length; i++) {
  let splitString = genres[i].split('|')
  for (let j = 0; j < splitString.length; j++) {
    if (splitString[j] === 'War') {
      splitString.splice(j, 1)
      j--
    }
  }
  data[i].genres = splitString.join('|')
}
*/
fs.writeFileSync('data/moreData2.json', JSON.stringify(data))
