// Class to represent a row in the seat reservations grid
function Table(name, initialType) {
    var self = this;
    self.name = name;
    self.type = ko.observable(initialType);
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
        new Table("Users", self.dataTypes[1]),
        new Table("Passwords", self.dataTypes[1])
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
        self.architecture.push(new Table("", self.dataTypes[0]));
        $('.chosen-select').chosen();
    }
    self.removeTable = function(table) { 
        self.architecture.remove(table);
    }
}
$(document).ready(function(){
    ko.applyBindings(new SqlBuildModel());
    $('.chosen-select').chosen();
});
