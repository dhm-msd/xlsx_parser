var fs = require("fs")

const sourceFolder = './output/';

fs.readdirSync(sourceFolder).forEach(file => {
    var obj = JSON.parse(fs.readFileSync(sourceFolder+file, 'utf8'));
    var query = ""
	obj.forEach(person =>{
	    query += "INSERT INTO Person(Surname,Name,Fathers_Name,Mothers_Name,Date_Of_Birth,Fam_Num,Rel,Nomos,City,Region) " +
        "VALUES(";
        query += "'"+person.surname+"',";
        query += "'"+person.name+"',";
        query += "'"+person.fathers_name+"',";
        query += "'"+person.mothers_name+"',";
        query += "'"+person.date_of_birth+"',";
        query += "'"+person.fam_num+"',";
        query += "'"+person.religion+"',";
        query += "'"+person.nomos+"',";
        query += "'"+person.poli+"',";
        query += "'"+person.perioxi+"');\r\n";
    })
    fs.writeFileSync('./sql-ok/'+file+'.sql',query)
	console.log("File:"+file+" done")
})
console.log("all done")
