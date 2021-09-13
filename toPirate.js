const axios = require('axios');
const enText = require('./src/app/language-service/translations/en.json');
const fs = require('fs');

// async function translate(lables)  {
//   const translated = Object.keys(lables).reduce(async (acc, key) => {
//     const label = lables[key];
//     const res = await axios.get('https://pirate.monkeyness.com/api/translate?english=' + label, {});
//     //console.log(res)
//     acc[key] = res.data;
//     return acc;
//   }, {});
//   return translated;
// }

async function translate(lables)  {
  return Promise.all(
    Object.keys(lables).map((key) => {
      const label = lables[key];
      return axios.get('https://pirate.monkeyness.com/api/translate?english=' + label, {}).then((res) => res.data);
    })
  ).then((translated) => {
    const mapped =  Object.keys(lables).reduce((acc, key, i) => {
      acc[key] = translated[i];
      return acc;
    }, {});
    return mapped;
  });
}

const translatedTextPromise = translate(enText);
translatedTextPromise.then((translatedText) => {
  console.log(translatedText);
  translatedText.langName = "Pirate"
  fs.writeFileSync('./src/app/language-service/translations/characters_pirate.json', '{}');
  fs.writeFileSync('./src/app/language-service/translations/pirate.json', JSON.stringify(translatedText, '', 2));

});