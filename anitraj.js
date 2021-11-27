function IMPiViewModel() {
	var self = this;
	
	self.topology_anitraj = ko.observable();	
  self.retrieve_top = ko.observable([]);

  self.trajectory_option = ko.observable("invis");
	self.trajectories = ko.observableArray([])
  
	self.topologies = ko.observableArray([]);
	self.topology_option = ko.observable("upload");

	self.traj_url_anitraj = ko.observable();
	self.trajectory_anitraj = ko.observable();

	self.selectedOption_top = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_top(); 
    });	

	self.selectedOption = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption(); 
    });
    self.disable_upload_traj = ko.observable(true);
    self.disable_select_traj = ko.observable(true);
    self.disable_upload_top = ko.observable(false);
    self.disable_select_top = ko.observable(true);
    
    self.trajComp = ko.observable();
    var cartoonRepr, backboneRepr, labelRepr;
    self.start_job_anitraj = function() {
		if(site.User())
		{
    	    try
            {
                document.getElementById("viewport").innerHTML = "";
                //var cartoonRepr, backboneRepr, labelRepr
                //var sidechainAttached = false
                
    			$("#anitraj_input").hide();
    			$("#anitraj_viewer").show();
    			var form = $("form#anitraj-form")
    			
        		var formData = new FormData(form[0]);

            if(self.topology_option() == "select")
    		    {
                console.log("CHECKING1")
    		        formData.append('topology_anitraj', self.selectedOption_top());
    		    }
    		    else
    		    {
					      formData.append('topology_anitraj', ko.toJSON(self.topology_anitraj()));
    		    }

    		    if(self.trajectory_option() == "select")
    		    {
    		        formData.append('trajectory_anitraj', self.selectedOption());
    		    }
    		    else
    		    {	
            if(self.trajectory_option() == "upload"){
              traj_file = document.getElementById('check_trajsize_anitraj');
              if(traj_file.files[0].size/ 1024 / 1024 > 250) {
                throw "Trajectory is larger than 250Mb. Please decrease the file size.";
              }	
              formData.append('trajectory_anitraj', ko.toJSON(self.trajectory_anitraj()));
            }              
    		    }
    		    
            
            $.ajax({
        		    url: "/api/mdtask/jobs/visualise",
        		    type: "POST",
        		    data: formData,					
        		    success: function(id) {									
        				//checking inputs are mdtraj compatiable 
                var stage = new NGL.Stage( "viewport", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage.handleResize();
                }, false );
                
                function addElement (el) {
                  Object.assign(el.style, {
                    position: "absolute",
                    zIndex: 10
                  })
                  stage.viewer.container.appendChild(el)
                }
                
                function createElement (name, properties, style) {
                  var el = document.createElement(name)
                  Object.assign(el, properties)
                  Object.assign(el.style, style)
                  return el
                }
                
                var topPosition = 150

                function getTopPosition (increment) {
                  if (increment) topPosition += increment
                  return topPosition + "px"
                }

                stage.loadFile(formData.get("topology_anitraj"), {
                  asTrajectory: true
              }).then(function (o) {
                  struc = o
                  cartoonCheckbox.checked = true
                  backboneCheckbox.checked = false
                  hydrogenCheckbox.checked = true
                  
                  o.addTrajectory()
                  //o.addRepresentation("cartoon")
                  
                  cartoonRepr = o.addRepresentation("cartoon", {
                    visible: true,
          quality: "high"
                  })
                  backboneRepr = o.addRepresentation("backbone", {
                    visible: false,
                    colorValue: "lightgrey",
                    radiusScale: 2
                  })
                  
                  /*labelRepr = o.addRepresentation("label", {
                    sele: "(not (water or ion) or (name ca)",
                    color: "#333333",
                    yOffset: 0.2,
                    zOffset: 2.0,
                    attachment: "bottom-center",
                    showBorder: true,
                    borderColor: "lightgrey",
                    borderWidth: 0.25,
                    disablePicking: true,
                    radiusType: "size",
                    radiusSize: 2.8,
                    labelType: "residue",
                    labelGrouping: "residue"
                  })*/
                  o.addRepresentation("ball+stick", {
                      sele: "not protein"
                  })
                  stage.autoView()
                  if(self.trajectory_option() !== "invis"){
                    NGL.autoLoad(formData.get("trajectory_anitraj")).then(function (frames) {
                        self.trajComp = o.addTrajectory(frames)
                        //trajComp.trajectory.player.play()
                    })
                  }
              })

              stage.setParameters( { backgroundColor: "white", hoverTimeout: -1 } );
                
              var cartoonCheckbox = createElement("input", {
                type: "checkbox",
                checked: true,
                onchange: function (e) {
                  cartoonRepr.setVisibility(e.target.checked)
                }
              }, { top: getTopPosition(30), left: "140px" })
              addElement(cartoonCheckbox)
              addElement(createElement("span", {
                innerText: "Cartoon"
              }, { top: getTopPosition(), left: "160px", color: "grey" }))
              
              var backboneCheckbox = createElement("input", {
                type: "checkbox",
                checked: false,
                onchange: function (e) {
                  backboneRepr.setVisibility(e.target.checked)
                }
              }, { top: getTopPosition(20), left: "140px" })
              addElement(backboneCheckbox)
              addElement(createElement("span", {
                innerText: "Backbone"
              }, { top: getTopPosition(), left: "160px", color: "grey" }))
              
              var hydrogenCheckbox = createElement("input", {
                type: "checkbox",
                checked: true,
                onchange: function (e) {
                  if (e.target.checked) {
                    struc.setSelection("*")
                  } else {
                    struc.setSelection("not _H")
                  }
                }
              }, { top: getTopPosition(20), left: "140px" })
              addElement(hydrogenCheckbox)
              addElement(createElement("span", {
                innerText: "Hydrogen"
              }, { top: getTopPosition(), left: "160px", color: "grey" }))

              var screenshotButton = createElement("input", {
                type: "button",
                value: "Screenshot",
                onclick: function () {
                  stage.makeImage({
                    factor: "6",
                    antialias: false,
                    trim: true,
                    transparent: false
                  }).then(function (blob) {
                    NGL.download(blob, "screenshot.png")
                  })
                }
              }, { top: getTopPosition(20), left: "140px" })
              addElement(screenshotButton)
              
              var toggleFSButton = createElement("input", {
                type: "button",
                value: "Toggle fullscreen",
                onclick: function () {
                  stage.toggleFullscreen();
                }
              }, { top: getTopPosition(30), left: "140px" })
              addElement(toggleFSButton)
        			},
        			error: function(http) {		
        				$("#error_heading").html("Error running MD-TASK");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again.");
        				}
        				
        				$("#errorModal").modal('show');
        				$("#cp_input").show();
        				$("#loading_cp").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
            

    		    // Visualiser here
    		    //var trajComp = ""
                // Create NGL Stage object
                
                
                
                
               
                
                /*var sidechainAttachedCheckbox = createElement("input", {
                  type: "checkbox",
                  checked: false,
                  onchange: function (e) {
                    sidechainAttached = e.target.checked
                    neighborRepr.setSelection(
                      sidechainAttached ? "(" + neighborSele + ") and (sidechainAttached or not polymer)" : neighborSele
                    )
                  }
                }, { top: getTopPosition(20), left: "140px" })
                addElement(sidechainAttachedCheckbox)
                addElement(createElement("span", {
                  innerText: "sidechainAttached"
                }, { top: getTopPosition(), left: "160px", color: "grey" }))*/
                /*
                var labelCheckbox = createElement("input", {
                  type: "checkbox",
                  checked: true,
                  onchange: function (e) {
                    labelRepr.setVisibility(e.target.checked)
                  }
                }, { top: getTopPosition(20), left: "140px" })
                addElement(labelCheckbox)
                addElement(createElement("span", {
                  innerText: "label"
                }, { top: getTopPosition(), left: "160px", color: "grey" }))
                */
               
                
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#anitraj_input").show();
				$("#loading_anitraj").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	


	self.topology_option.subscribe(function() {		
      if(self.topology_option() == "upload")
	    {
	        self.disable_upload_top(false);
          self.disable_select_top(true);
	    }      
      else
	    {
            $.ajax({
    		    url: "/api/datastore/topologies/",
    		    type: "POST",
    		    success: function(data) {    		        
    				var array = [];
                    $.each(data, function (index, value) {
                        array.push(value);
                    });
                    self.topologies(array);
    			},
    			error: function(http) {	
    				$("#error_heading").html("Error loading topologies");
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
    		self.disable_upload_top(true);
            self.disable_select_top(false);
	    }
    });
    

	self.trajectory_option.subscribe(function() {
      if(self.trajectory_option() == "upload")
	    {
	        self.disable_upload_traj(false);
          self.disable_select_traj(true);
	    }
      else if (self.trajectory_option() == "invis"){
        self.disable_upload_traj(true);
        self.disable_select_traj(true);
      }
      else
	    {
            $.ajax({
    		    url: "/api/datastore/trajectories/",
    		    type: "POST",
    		    //data: formData,
    		    success: function(data) {
    				var array = [];
                    $.each(data, function (index, value) {
                        array.push(value);
                    });
                    self.trajectories(array);
    			},
    			error: function(http) {
    				$("#error_heading").html("Error loading trajectories");
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
    		  self.disable_upload_traj(true);
          self.disable_select_traj(false);
	    }
    });
    
    self.play = function() {
        self.trajComp.trajectory.player.play()
    }
    self.pause = function() {
        self.trajComp.trajectory.player.stop()
    }
    
    self.toggle_play = function() {
        if (self.trajComp.trajectory.player.isRunning == false) {
            self.trajComp.trajectory.player.play()
        }
        else {
            self.trajComp.trajectory.player.stop()
        }
    }
    
    self.new_struc = function() {
        $("#anitraj_viewer").hide();
        $("#anitraj_input").show();
    }
    
    self.new_test = function() {
        console.log("new_test");
        backboneRepr.setVisibility("true");
    }
    
	/*function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }*/
}

/*var showAnitrajTrajectoryDiv = function(div) {
				
	if(div == "upload") {
		$("#upload_trajectory_anitraj").show(500);
		$("#select_trajectory_anitraj").hide(500);
	}
	else if(div == "select") {
		$("#upload_trajectory_anitraj").hide(500);
		$("#select_trajectory_anitraj").show(500);	
	}
}*/


var changeTopologyDiv_anitraj = function(div) {
	if(div == "upload") {
		$("#upload_topology_anitraj").addClass('panel-info');
		$("#select_topology_anitraj").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_anitraj").removeClass('panel-info');
		$("#select_topology_anitraj").addClass('panel-info');
	}
}

var changeTrajectoryDiv_anitraj = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_anitraj").addClass('panel-info');
		$("#select_trajectory_anitraj").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_anitraj").removeClass('panel-info');
		$("#select_trajectory_anitraj").addClass('panel-info');
	}
  else if(div == "invis") {
		$("#upload_trajectory_anitraj").removeClass('panel-info');
		$("#select_trajectory_anitraj").removeClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

/*
function clearAutoModel() {
	autoModelViewModel.clearAutoModel();
}*/

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("anitraj"));
