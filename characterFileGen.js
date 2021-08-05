const fs = require('fs');
const charFile = require('./src/app/character-service/characters.json');

const mapped = charFile.reduce((acc, char) => {
  acc[char.name] = {
    name: char.name,
    alias: char.aliases
  };
  return acc;
}, {})

fs.writeFileSync('./src/app/language-service/translations/characters_en.json', JSON.stringify(mapped, null, 2));

