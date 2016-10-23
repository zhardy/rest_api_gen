function SqlBuildModel(){
	var self = this;
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
	]

	self.architecture = [
		new Table("placeholder")
	];

	var selected = ko.observable(self.architecture[0]);
}

function Table(name, length, values){
	var self = this;
	self.name = name;
	self.length != undefined ? self.length = length : true;
	self.values != undefined ? self.values = values : true;
}


$(document).ready(function(){
	ko.applyBindings(new SqlBuildModel());
	$('.chosen-select').chosen();
});