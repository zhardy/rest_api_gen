// Class to represent a row in the seat reservations grid
function Table(name, values) {
    var self = this;
    self.name = name;
    self.values = ko.observableArray(values);

    self.removeValue = function(value){
        self.values.remove(value);
    }

    self.addValue = function(){
        self.values.push(new Value("", {}, false));
        $('.chosen-select').chosen();
    }
}

function Value(name, type, isPrimary){
    var self = this;
    self.name = name;
    self.type = ko.observable(type);
    self.isPrimary = ko.observable(isPrimary);
	self.foreignReference = ko.observable(false);
    self.table = ko.observable();
    self.referenceOptions = ko.computed( function(){
        return this.table() != undefined ? this.table().values() : undefined;
    }, self);

    self.value = ko.observable();

    self.togglePrimary = function(){
        self.isPrimary() === true ? self.isPrimary(false) : self.isPrimary(true);
    }
    self.foreignReference.subscribe(function(newData){
        setTimeout(function(){
            $('.chosen-select').chosen();
        }, 3);
    });
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
            length:80
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
            name:"boolean"
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
            $('.chosen-select').chosen({width:'85%'});
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

    self.generateExport = function(){
        var array = [];
        self.architecture().forEach(function(table){
            var valueArray = [];
            table.values().forEach(function(value){
                var valObj = {name: value.name};
                valObj.type = value.type();

                valObj.isPrimary = value.isPrimary(); 
                valObj.isReference = value.foreignReference();
                if(valObj.isReference){
                    valObj.foreignTable = value.table().name;
                    valObj.foreignValue = value.value().name;
                    valObj.type = value.value().type();
                    valObj.name = value.value().name;
                }
                valueArray.push(valObj);
            });
            var tableObj = {name: table.name, values: valueArray}
            array.push(tableObj);
        });
        console.save(JSON.stringify(array), "data.json");
    }
}



$(document).ready(function(){
    var SQLBuild = new SqlBuildModel();
    ko.applyBindings(SQLBuild);

});
