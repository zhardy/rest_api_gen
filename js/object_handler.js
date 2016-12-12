

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
    }

    self.primary = ko.observable(values[0]);

    self.togglePrimary = function(newValue){
        self.primary(newValue);
        self.values().forEach(function(val){
            if(val === newValue){
                val.isPrimary(true);
            } else {
                val.isPrimary(false);
            }
        });
    }


}

function Value(name, value, isPrimary){
    var self = this;
    self.name = name;
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
    self.type = value != undefined ? ko.observable(self.dataTypes[value]) : ko.observable(self.dataTypes[1]);
    self.isPrimary = ko.observable(isPrimary);
	self.foreignReference = ko.observable(false);
    self.table = ko.observable();
    self.referenceValueOptions = ko.computed( function(){
        return this.table() != undefined ? this.table().values() : undefined;
    }, self);

    self.foreignType = ko.observable();

    self.architecture = function(referenceArchitecture){
        var returnArray = [];
        referenceArchitecture().forEach(function(table){
            if(table.values.indexOf(self) < 0){
                returnArray.push(table);
            }
        });
        return returnArray;
    }

}

// Overall viewmodel for this screen, along with initial state
function SqlBuildModel() {
    var self = this;
    self.userPasswords = ko.observable(false);
    self.userPasswordTemplates = [
        new Table("Users", [ 
            new Value("UserID", 8, true),
            new Value("User", 11, false)
            ]),
        new Table("Passwords", [
            new Value("PasswordID", 8, true),
            new Value("Password", 11, false)
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
            new Table("", [new Value("ID", 8, true)
                ])
            );
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
