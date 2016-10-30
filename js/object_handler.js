// Class to represent a row in the seat reservations grid
function Table(name, values) {
    var self = this;
    self.name = name;
    self.values = ko.observableArray(values);

    self.removeValue = function(value){
        self.values.remove(value);
    }

    // self.values().forEach(function(item){
    //     item.isPrimary.subscribe(function(newData){

    //     });
    // });

    // self.values.subscribe(function(newData){
    //     console.log('chagned');
    // });
}

function Value(name, type, isPrimary){
    var self = this;
    self.name = name;
    self.type = ko.observable(type);
    if(type.startingLength){
        self.length = ko.observable(type.startingLength);
    }
    self.isPrimary = ko.observable(isPrimary);

    self.togglePrimary = function(){
        if(self.isPrimary() === true){
            self.isPrimary(false);
        } else {
            self.isPrimary(true);
        }
    }
}

// Overall viewmodel for this screen, along with initial state
function SqlBuildModel() {
    var self = this;
    self.userPasswords = ko.observable(false);


    self.dataTypes = [
        {
            name: "smallint"
        },
        {
            name: "integer"
        },
        {
            name: "bigint"
        },
        {
            name:"decimal"
        },
        {
            name:"numeric"
        },
        {
            name:"real"
        },
        {
            name:"double"
        },
        {
            name:"smallserial"
        },
        {
            name:"serial"
        },
        {
            name:"bigserial"
        },
        {
            name:"money"
        },
        {
            name:"varchar",
            startingLength:80
        },
        {
            name:"char",
        },
        {
            name:"text"
        },
        {
            name:"timestamp without time zone"
        },
        {
            name:"timestramp with time zone"
        },

        {
            name:"date"
        },
        {
            name:"time without time zone",
        },
        {
            name:"time with time zone"
        },
        {
            name:"interval"
        },
        {
            name:"boolean",
            values: [ 
            true,
            false
            ]
        },
        {
            name:"Custom (enum)"
        }
    ];    

    self.userPasswordTemplates = [
        new Table("Users", [ 
            new Value("UserID", self.dataTypes[8], true),
            new Value("User", self.dataTypes[11], false)
            ]),
        new Table("Passwords", [
            new Value("PasswordID",self.dataTypes[8], true),
            new Value("Password", self.dataTypes[11], false)
            ])
    ];



    // Editable data
    self.architecture = ko.observableArray();

    self.userPasswords.subscribe(function(newData){
        if(newData === true){
            self.userPasswordTemplates.forEach(function(template){
                if(self.architecture().indexOf(template) === -1){
                    self.architecture.push(template);
                }
            });
            $('.chosen-select').chosen();
        }
        if(newData === false){
            self.userPasswordTemplates.forEach(function(template){
                if(self.architecture().indexOf(template) != -1){
                    self.architecture.remove(template);
                }
            });

        }
    });
    



    // Operations
    self.addTable = function() {
        self.architecture.push(
            new Table("", [new Value("ID", self.dataTypes[8], true)
                ])
            );
        $('.chosen-select').chosen();
    }
    self.removeTable = function(table) { 
        self.architecture.remove(table);
    }
}



$(document).ready(function(){
    var test = new SqlBuildModel();

    ko.applyBindings(test);
    $('.chosen-select').chosen();
    console.log($('#test'));


});
