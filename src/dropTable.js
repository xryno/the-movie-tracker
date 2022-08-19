const db = require("../db")  //as is index, dont need to refer.

async function main (){

await db.query('DROP TABLE owners')

console.log("table delete")
}

main ()