

// Class to represent a row in the seat reservations grid
function Table(name, values, dataTypes) {
    var self = this;
    self.name = name;
    self.dataTypes = dataTypes;
    self.values = ko.observableArray(values);
    self.removeValue = function(value){
        self.values.remove(value);
    }

    self.addValue = function(){
        self.values.push(new Value("", 8, false, self.dataTypes));
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

function CustomValue(name, values){
    var self = this;
    self.name = ko.observable(name);
    self.valueText = ko.observable(values);
}

function Value(name, value, isPrimary, dataTypes){
    var self = this;
    self.name = name;
    self.dataTypes = dataTypes;
    self.type = value != undefined ? ko.observable(self.dataTypes()[value]) : ko.observable(self.dataTypes()[1]);
    self.isPrimary = ko.observable(isPrimary);
	self.foreignReference = ko.observable(false);
    self.table = ko.observable();
    self.referenceValueOptions = ko.computed( function(){
        return this.table() != undefined ? this.table().values() : undefined;
    }, self);

    self.foreignType = ko.observable();

    self.architecture = function(referenceArchitecture, parentTable){
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
    self.dataTypes = ko.observableArray([
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
        }
    ]);

    self.createUserPasswords = ko.observable(false);
    self.allowCustom = ko.observable(false);
    self.architecture = ko.observableArray();
    self.customValues = ko.observableArray();
    self.currentCustom = ko.observable(new CustomValue("Name", "Put some text here separated by commas for custom values"));



    self.userPasswordTemplates = [
        new Table("Users", [ 
            new Value("UserID", 8, true, self.dataTypes),
            new Value("User", 11, false, self.dataTypes)
            ], self.dataTypes),
        new Table("Passwords", [
            new Value("PasswordID", 8, true, self.dataTypes),
            new Value("Password", 11, false, self.dataTypes)
            ], self.dataTypes)
    ];

    // Editable data

    self.createUserPasswords.subscribe(function(newData){
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
            new Table("", [
                new Value("ID", 8, true, self.dataTypes)
                ], self.dataTypes)
            );
    }

    self.removeTable = function(table) { 
        self.architecture.remove(table);
    }

    self.generateCustom = function(){
        var custom = self.currentCustom();
        self.dataTypes.push({ name: custom.name()});
        self.customValues.push({
            name: custom.name(),
            values: custom.valueText().split(','),
            type: "Custom"
            })
        self.currentCustom().name("Name");
        self.currentCustom().valueText("Put some text here separated by commas for custom values");
    }

    self.generateExport = function(){
        var array = [];
        self.customValues().forEach(function(customValueObject){
            array.push(customValueObject);
        });

        self.architecture().forEach(function(table){
            var valueArray = [];
            table.values().forEach(function(value){
                var valObj = {name: value.name};
                valObj.type = value.type();

                valObj.isPrimary = value.isPrimary(); 
                valObj.isReference = value.foreignReference();
                if(valObj.isReference){
                    valObj.foreignTable = value.table().name;
                    valObj.foreignValue = value.foreignType().name;
                    valObj.type = value.foreignType().type();
                    valObj.name = value.foreignType().name;
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
