var hbs = require('hbs');

hbs.registerHelper('suma', (n1, n2) => {
    let result = n1+ n2;
    return result;
})

module.exports = hbs;