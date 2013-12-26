/*
  dbp.js
  JavaScript Framework for HTML5 Dashboards and widgets
  Created by Erhan Gundogan <erhan.gundogan@gmail.com>
  MIT License
 */

var DBP, Dashboard, Widget;
(function(global) {

    DBP = function() {
        this.options = {};
        return this;
    };
    
    Dashboard = function(module) {
        this.module = module;
        this.options = {};
        this.container = $('body'),
        this.widgets = [];
        return this;
    };
    Dashboard.prototype.module = typeof DBP;
    Dashboard.prototype.init = function(_options) {
        var self = this;
        _.extend(self.options, _options);

        var DOMLoadCheck = setInterval(function() {
            var body = $('body');
            if (body && body.length > 0) {
                clearInterval(DOMLoadCheck);
                self.domReady(self);
            }
        }, 100);
    }    
    Dashboard.prototype.createDummy = function(module) {

        var wrapper = $('<div class="gridster" />'),
            list = $('<ul />'),
            self = this;
        debugger;
        self.container.append(wrapper.append(list));

        var gridsterOptions = {
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140]
        };
        
        var gridster = $('.gridster ul').gridster(gridsterOptions).data('gridster');

        /*
        for (var i = 0; i < 3; i++) {
            var item = $('<li />'),
                dataRow = Math.floor(Math.random() * 3) + 1,
                dataColumn = Math.floor(Math.random() * 3) + 1,
                dataSizeX = Math.floor(Math.random() * 3) + 1,
                dataSizeY = Math.floor(Math.random() * 3) + 1;

            item.attr('data-row', dataRow)
                .attr('data-col', dataColumn)
                .attr('data-sizex', dataSizeX)
                .attr('data-sizey', dataSizeY);

            list.append(item);
        }

        list.append($('<li />').attr('data-row', 1).attr('data-col', 1).attr('data-sizex', 1).attr('data-sizey', 3))
            .append($('<li />').attr('data-row', 1).attr('data-col', 2).attr('data-sizex', 2).attr('data-sizey', 1))
            .append($('<li />').attr('data-row', 2).attr('data-col', 2).attr('data-sizex', 1).attr('data-sizey', 1))
            .append($('<li />').attr('data-row', 2).attr('data-col', 3).attr('data-sizex', 1).attr('data-sizey', 1))
            .append($('<li />').attr('data-row', 3).attr('data-col', 2).attr('data-sizex', 1).attr('data-sizey', 1))
            .append($('<li />').attr('data-row', 3).attr('data-col', 3).attr('data-sizex', 1).attr('data-sizey', 1));*/

        
        
        var widgets = [
            ['<li>0</li>', 1, 2],
            ['<li>1</li>', 3, 2],
            ['<li>2</li>', 3, 2],
            ['<li>3</li>', 2, 1],
            ['<li>4</li>', 4, 1],
            ['<li>5</li>', 1, 2],
            ['<li>6</li>', 2, 1]
        ];

        _.each(widgets, function(widget, i) {
            gridster.add_widget.apply(gridster, widget);
        });

        /*
        $.each(widgets, function(i, widget){
            gridster.add_widget.apply(gridster, widget)
        });
        */  
    }

    Widget = function(dashboard) {
        this.dashboard = dashboard;
        return this;
    }
    Widget.prototype.dashboard = typeof Dashboard;

    DBP.prototype.init = function(_options, _dashboardOptions) {
        var self = this,
            req = [_,$,$.fn.gridster];        

        for (var r in req) {
            if (typeof req[r] === 'undefined') return callback('dbp prerequisites not met!');
        }

        _.extend(self.options, _options);

        self.dashboard = new Dashboard(self);
                
        return self;
    };    

} (this));

/*
Dashboard
	id
	name
	style
	class
	width
	minWidth
	maxWidth
	height
	minHeight
	maxHeight
	cellWidth
	cellHeight
	cellPadding
	rows
	columns
	widgets: array
	parent: Dashboard
	state: Changed
	container: jQuery object
	readonly: true/false
	save: function
	delete: function
	render: function
	responsive: true/false
	header
	footer
	events
	animation
	print
	export

Widget
	id
	name
	style
	class
	width
	minWidth
	maxWidth
	height
	minHeight
	maxHeight
	parent
	header
	data
	footer
	state
	save
	delete
	render
	header
	footer
	events
	animation
	print
	export

Chart
	id
	name
	style
	class
	width
	minWidth
	maxWidth
	height
	minHeight
	maxHeight
	data
	type
	series
	values
	options
	legend
	events
	animation

renderLibrary
getConfig
getData
async kullan
dashboarder
*/