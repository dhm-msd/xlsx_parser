var XLSX = require('xlsx');
var fs = require('fs');

var persons = []
var error_persons = []
const sourceFolder = './sources/';
console.time("Parse XLSX to JSON Objects");
fs.readdirSync(sourceFolder).forEach(file => {

    console.log(file);
    var workbook = XLSX.readFile(sourceFolder+file);
    var sheet_name_list = workbook.SheetNames;

    var data_objects = workbook.Sheets[sheet_name_list[0]]
    persons = []
    error_persons = []
    proc_town_data(data_objects,file,function(persons,error_persons){
        save_town_object(file,persons,error_persons)
    })
	
})
console.timeEnd("Parse XLSX to JSON Objects");
console.log("Done");
function save_town_object(file_name,persons,error_persons){
    file_name = file_name.replace('.xlsx', '')
    console.log("Saving file: "+file_name)
    fs.writeFileSync('./output/'+file_name+'-ok.json',JSON.stringify(persons))
    fs.writeFileSync('./output/'+file_name+'-bad.json',JSON.stringify(error_persons))

}
function proc_town_data(data_objects,file,callback){
    var total_cells = Object.keys(data_objects).length - 2;
    var cells_per_row = 7
    var total_rows = total_cells / cells_per_row

    console.log(total_rows)

    var current_row = 1;
    var last_row = -1;
    var perioxi_loaded = "";//"PERIOXI"
    var poli_loaded    = "";//"POLI"
    var nomos_loaded   = "";//"NOMOS"
    while(current_row < total_rows){
        try {
            if(last_row == current_row){
                //wait for callback to be triggered
                continue;
            }else {
                last_row = current_row
                //at start of each row, check if
                // values at F exist. If yes, this is a data row
                // else, this is a heading row. We should reset the Area var

                if (data_objects["F" + current_row].v == " ") {
                    //proccess new Region Rows (2 rows, heading+data)
                    perioxi_loaded = data_objects["C" + (current_row + 1)].v
                    poli_loaded = data_objects["B" + (current_row + 1)].v
                    nomos_loaded = data_objects["A" + (current_row + 1)].v

                    current_row += 3;
                } else {
                    //proccess person row

                    var Person = {}
                    var check_data = data_objects["A" + current_row];
                    if (check_data) {
                        Person.surname = data_objects["A" + current_row].w
                        Person.name = data_objects["B" + current_row].v
                        Person.fathers_name = data_objects["C" + current_row].v
                        Person.mothers_name = data_objects["D" + current_row].v
                        Person.date_of_birth = data_objects["E" + current_row].w
                        Person.fam_num = data_objects["F" + current_row].v
                        Person.religion = data_objects["G" + current_row].v
                        Person.nomos = nomos_loaded;
                        Person.poli = poli_loaded;
                        Person.perioxi = perioxi_loaded;
                        persons.push(Person)
                        current_row+=1;
                    } else {
                        var hmm = true;
                        var error_Person = {}
                        error_Person.file_name = file
                        error_Person.row_num = current_row
                        error_persons.push(error_Person)
                        current_row += 1;
                    }
                }
            }
        }catch(e){
            if(e.message == "Cannot read property 'v' of undefined"){
                var error_Person = {}
                error_Person.file_name = file
                error_Person.row_num = current_row
                error_persons.push(error_Person)
                current_row += 1;
            }else {
                console.log(e)
            }
        }

    }
    callback(persons,error_persons)

}


