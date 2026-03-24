import fs from 'fs';

const filePath = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\61f34520-7638-48c9-9891-d119dbf9a527\\import_data.sql';
let sql = fs.readFileSync(filePath, 'utf8');

let counter = 1;
sql = sql.replace(/'sin-t-tulo'/g, (match) => {
    return `'sin-t-tulo-${counter++}'`;
});

// We should also perhaps make the titles slightly unique?
let titleCounter = 1;
sql = sql.replace(/'Sin Título'/g, (match) => {
    return `'Tour ${titleCounter++} (Por editar)'`;
});

fs.writeFileSync(filePath, sql);
console.log("Fixed slugs in import_data.sql!");
