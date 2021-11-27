//var viewer;

//var colors = ['#6B527D', 'darkgreen', 'darkred', 'darkblue', 'darkyellow', 'cyan', 'magenta', 'darkorange', 'darkgrey', 'darkcyan'];
//var color_count = 0;

// This will contain all jobs that are in the user job history
var job_list = [];


function Display_LastJob(){
  // This function will display the first job in the job history if no job is selected
    if($('#job_details')){
      if(job_list.length  > 0){
     	 window.location = "/#jobs/" + job_list[0].JobID();
     }
     else{
	document.getElementById("Job_empty").innerHTML = "Job history is empty";
  } 
}
}

function CalcNetworkStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();

    self.Topology = ko.observable();
    self.Trajectory = ko.observable();
    self.Step = ko.observable();
    self.Drnstat = ko.observable();
    self.Threshold = ko.observable();

    self.Drawing = ko.observable("cartoon");
    // self.cartoon = ko.observable(true);
    // self.spacefill = ko.observable(false);
    // self.licorice = ko.observable(false);
    // self.surface = ko.observable(false);
    
    self.BC = ko.observable();
    self.L = ko.observable();
    self.Katz = ko.observable();
    self.DC = ko.observable();
    self.CC = ko.observable();
    self.ECC = ko.observable();
    self.EC = ko.observable();
    self.PR = ko.observable();

   	self.MetricSelection = ko.observable() 

    self.netmetrics = ko.observableArray([])
    
    self.StageType = ko.observable("Dynamic Residue Networks");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});   
    self.MetricSelection.subscribe(function(MetricSelection) {
    	var MetricSelection = job.selected_job().MetricSelection();
	});   
/*
  self.show_spheres = function(){
    if(self.selected_Spheres(false)){
      self.selected_Spheres(true);
      sphereRepr.visible = true;
      console.log(self.selected_Spheres());
    }
    else{
      self.selected_Spheres(false);
      console.log("Checking 2");
      sphereRepr.visible = true;
    }
  }            
*/    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Topology(stage.Topology.split(":")[0]);
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Step(stage.Step.split(":")[0]);
        self.Drnstat(stage.Drnstat.split(":")[0]);
        self.Threshold(stage.Threshold.split(":")[0]);
        
        if (stage.BC.split(":")[0] == null || stage.BC.split(":")[0] == ""){
            stage.BC = "false:" + stage.BC.split(":")[1]
        }
        if (stage.L.split(":")[0] == null || stage.L.split(":")[0] == ""){
            stage.L = "false:" + stage.L.split(":")[1]
        }
        if (stage.Katz.split(":")[0] == null || stage.Katz.split(":")[0] == ""){
            stage.Katz = "false:" + stage.Katz.split(":")[1]
        }
        if (stage.DC.split(":")[0] == null || stage.DC.split(":")[0] == ""){
            stage.DC = "false:" + stage.DC.split(":")[1]
        }
        if (stage.CC.split(":")[0] == null || stage.CC.split(":")[0] == ""){
            stage.CC = "false:" + stage.CC.split(":")[1]
        }
        if (stage.ECC.split(":")[0] == null || stage.ECC.split(":")[0] == ""){
            stage.ECC = "false:" + stage.ECC.split(":")[1]
        }
        if (stage.EC.split(":")[0] == null || stage.EC.split(":")[0] == ""){
            stage.EC = "false:" + stage.EC.split(":")[1]
        }
        if (stage.PR.split(":")[0] == null || stage.PR.split(":")[0] == ""){
            stage.PR = "false:" + stage.PR.split(":")[1]
        }
        
        self.BC(stage.BC.split(":")[0]);
        self.L(stage.L.split(":")[0]);
        self.Katz(stage.Katz.split(":")[0]);
        self.DC(stage.DC.split(":")[0]);
        self.CC(stage.CC.split(":")[0]);
        self.ECC(stage.ECC.split(":")[0]);
        self.EC(stage.EC.split(":")[0]);
        self.PR(stage.PR.split(":")[0]);
       	
        $.ajax(
		{url: "/api/mdtask/jobs",
		 success: function(data) {
		 var array = [];
         $.each(data, function (index, job) {
         	if(job.Status_ID == "8" || job.Status_ID == "10") {
				array.push(
    			           {name: job.Job_Name,
    			            iden: job.Job_ID}
    			    	  );
			}
                    
         });
                self.netmetrics(array);
		},
		error: function(http) {
			$("#error_heading").html("Error loading jobs");
		},
		cache: false,
		contentType: false,
		processData: false
		});
		
        self.selectedMetric = ko.observable();
        self.selectedMetric.subscribe(function(newValue) {
         // compare stage 
        	$.ajax({
				url: "/api/mdtask/jobs/" + newValue.iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                   	self.MetricSelection("BC")
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage( "viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + newValue.iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                          
                        ]).then(function (ol) {
                            var proteinBetween = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][0]);
                        	}
                            
			   				// Start minmax 
	                    	job.selected_job().setRightArray(tempArray)		
							var leftTempArray = job.selected_job().arrayLeft()
                            var min_leftIndex = Math.min.apply(Math, leftTempArray)
                            var max_leftIndex = Math.max.apply(Math, leftTempArray)
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)

							var rightTempArray = job.selected_job().arrayRight()
                            var min_rightIndex = Math.min.apply(Math, rightTempArray)
                            var max_rightIndex = Math.max.apply(Math, rightTempArray)

							console.log("leftmp");
							console.log(leftTempArray);
							console.log("righttmp");
							console.log(rightTempArray);
							console.log("left minmax");
							console.log(min_leftIndex, max_leftIndex);
							console.log("right minmax");
							console.log(min_rightIndex, max_rightIndex);

							
                            var min_index = Math.min(min_leftIndex, min_rightIndex)
                            var max_index = Math.max(max_leftIndex, max_rightIndex)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
							
							console.log("new minmax");
							console.log(min_index, max_index);

			   				// End minmax 

//                            var min_index = Math.min.apply(Math, tempArray)
//                            var max_index = Math.max.apply(Math, tempArray)
//                            var diff_index = max_index - min_index
//                            var increment_index = diff_index/10
                            
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC;  // light yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;  // 
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;  // 
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;  // 
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;  // 
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900;  // yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;  // 
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;  // 
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;  // 
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;  // 
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000;  // red
                                    }
                                    else {
                                      return 0x0000FF;  // blue
                                    }
                              };
                            });
                            
                            //ol[0].addRepresentation("cartoon", { color: "sstruc" })
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;
			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
				representation = new Boolean(true)
                cartoon = ol[0].addRepresentation("cartoon", { 
                color: schemeId,
                visible: representation }) 
			} else {
                cartoon = ol[0].addRepresentation("cartoon", { 
                color: schemeId,
                visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
				representation = new Boolean(true)
                spacefill = ol[0].addRepresentation("spacefill", { 
                color: schemeId,
                visible: representation}) 
			} else {
                spacefill = ol[0].addRepresentation("spacefill", { 
                color: schemeId,
                visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			    representation = new Boolean(true)
                licorice = ol[0].addRepresentation("licorice", { 
                color: schemeId,
                visible: representation}) 
			} else {
                licorice = ol[0].addRepresentation("licorice", { 
                color: schemeId,
                visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			    representation = new Boolean(true)
                surface = ol[0].addRepresentation("surface", { 
                color: schemeId,
                visible: representation}) 
			} else {
                surface = ol[0].addRepresentation("surface", { 
                color: schemeId,
                visible: Boolean(false) })
			}
			// end set representation
			  self.Drawing.subscribe( function(newValue){
			//Start selection
			 if(newValue === "cartoon"){
			 	job.selected_job().setSelectedViewOption(1);
                cartoon = ol[0].addRepresentation("cartoon", { 
                color: schemeId,
                visible: true }) 
			 }
			 if(newValue === "spacefill"){
			 	job.selected_job().setSelectedViewOption(2);
                spacefill = ol[0].addRepresentation("spacefill", { 
                color: schemeId,
                visible: true}) 
			 }
			 if(newValue === "licorice"){
			 	job.selected_job().setSelectedViewOption(3);
                licorice = ol[0].addRepresentation("licorice", { 
                color: schemeId,
                visible: true}) 
			 }
			 if(newValue === "surface"){
			    job.selected_job().setSelectedViewOption(4);
                surface = ol[0].addRepresentation("surface", { 
                color: schemeId,
                visible: true}) 
			 }
			//End selection

                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })

                                                      
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
						self.redrawLeftView();
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
        });
    };

    self.drawStructure = function() {
        $( document ).ready(function() {
            setTimeout(function() {
                
              if (self.BC() == "true"){
            	    self.viewCN();
            	}
            	else if (self.L() == "true"){
            	    self.viewCNCloseness();
            	}
        	    else if (self.Katz() == "true"){
            	    self.viewCNKatz();
            	}
            	else if (self.DC() == "true"){
            	    self.viewCNDegree();
            	}
            	else if (self.CC() == "true"){
            	    self.viewCNCc();
            	}
            	else if (self.ECC() == "true"){
            	    self.viewCNEcc();
            	}
            	else if (self.EC() == "true"){
            	    self.viewCNEccentricity();
            	}
            	else if (self.PR() == "true"){
            	    self.viewCNPr();
            	}
            	else{
            	    console.log("drawStructure");
            	}
            	
            }, 1000);
        });
    };
    
    // start stage sync logic 
    sync_right = true
    
    function sync_controller () {
        if (sync_right == true) {
            sync_stage_right()
        }
        else {
            sync_stage_left()
        }
        setTimeout(function() { sync_controller(); }, 50);
    }
    
    function sync_stage_left() {
        var m = stage_cn_comp.viewerControls.getOrientation()
        stage_cn.viewerControls.orient(m.elements)
    }
    
    function sync_stage_right() {
        var m = stage_cn.viewerControls.getOrientation()
        stage_cn_comp.viewerControls.orient(m.elements)
    }
    // end stage sync logic   

    self.downloadInputCN = function() {
        var form = $("form#input_cn");
        form.submit();
    };
    self.downloadResultsCN = function() {
        var form = $("form#results_cn");
        form.submit();
    };
    self.genView = function() {
        window.location = "#genview?id=" + job.selected_job().JobID() + "&type=" + job.selected_job().Status();
        var form = $("form#genview_cn");
        form.submit();
    };

	//Needs to be redone
   	self.redrawLeftView = function() {
		// Clear div
		document.getElementById("viewport_cn_out").innerHTML = "";
		// Create NGL Stage object
		stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
		// Handle window resizing
		window.addEventListener( "resize", function( event ){
			stage_cn.handleResize();
		}, false );
		topoCNResponse = job.selected_job().topoCNResponse();
		densityCNResponse = job.selected_job().densityCNResponse();
		// Code for visualization
		var pdbBlob = new Blob( [ topoCNResponse ], { type: 'text/plain'} );
		var csvBlob = new Blob( [ densityCNResponse ], { type: 'text/plain'} );
		Promise.all([
		  
		  stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
		  NGL.autoLoad(csvBlob, {
			ext: "csv",
			delimiter: " ",
			comment: "#",
			columnNames: true
		  })
		  
		]).then(function (ol) {
			var proteinBetween = ol[ 0 ]
			var qmean = ol[ 1 ].data
			
			var tempArray = []
			
			for (i = 0; i < qmean.length; i++) {
				tempArray.push(qmean[i][0]);
			}                         

//			var min_index = Math.min.apply(Math, tempArray)
//			var max_index = Math.max.apply(Math, tempArray)
//			var diff_index = max_index - min_index
//			var increment_index = diff_index/10
			// Start minmax 
//			job.selected_job().setRightArray(tempArray)		
			var leftTempArray = job.selected_job().arrayLeft()
			var min_leftIndex = Math.min.apply(Math, leftTempArray)
			var max_leftIndex = Math.max.apply(Math, leftTempArray)
			
			var min_index = Math.min.apply(Math, tempArray)
			var max_index = Math.max.apply(Math, tempArray)

			var rightTempArray = job.selected_job().arrayRight()
			var min_rightIndex = Math.min.apply(Math, rightTempArray)
			var max_rightIndex = Math.max.apply(Math, rightTempArray)

			console.log("leftmp");
			console.log(leftTempArray);
			console.log("righttmp");
			console.log(rightTempArray);
			console.log("left minmax");
			console.log(min_leftIndex, max_leftIndex);
			console.log("right minmax");
			console.log(min_rightIndex, max_rightIndex);
			
			var min_index = Math.min(min_leftIndex, min_rightIndex)
			var max_index = Math.max(max_leftIndex, max_rightIndex)
			var diff_index = max_index - min_index
			var increment_index = diff_index/10
			
			console.log("new minmax");
			console.log(min_index, max_index);

			// End minmax 
			
			var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
			  this.atomColor = function (atom) {

					if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
					  return 0xFFFFAC; // light yellow
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
					  return 0xFFFF5A;
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
					  return 0xFFFF03;
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
					  return 0xFFCA00;
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
					  return 0xFF9300;
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
					  return 0xFF5900; // yellow
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
					  return 0xFF2200;
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
					  return 0xEA0000;
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
					  return 0xB00000;
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
					  return 0x790000;
					}
					else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
					  return 0x420000; // red
					}
					else {
					  return 0x0000FF; // blue
					}
			  };
			});
			
			var cartoon;
			var spacefill;
			var licorice;
			var surface;

//Set representation
var representation = new Boolean(false);
if (job.selected_job().SelectedViewOption() === "Cartoon") {
   representation = new Boolean(true)
			   cartoon = ol[0].addRepresentation("cartoon", { 
			   color: schemeId,
			   visible: representation }) 
} else {
			   cartoon = ol[0].addRepresentation("cartoon", { 
			   color: schemeId,
			   visible: Boolean(false) }) 
}

if (job.selected_job().SelectedViewOption() === "Spacefill") {
   representation = new Boolean(true)
			   spacefill = ol[0].addRepresentation("spacefill", { 
			   color: schemeId,
			   visible: representation}) 
} else {
			   spacefill = ol[0].addRepresentation("spacefill", { 
			   color: schemeId,
			   visible: Boolean(false) })
}

if (job.selected_job().SelectedViewOption() === "Licorice") {
   representation = new Boolean(true)
			   licorice = ol[0].addRepresentation("licorice", { 
			   color: schemeId,
			   visible: representation}) 
} else {
			   licorice = ol[0].addRepresentation("licorice", { 
			   color: schemeId,
			   visible: Boolean(false) })
	}
if (job.selected_job().SelectedViewOption() === "Surface") {
   representation = new Boolean(true)
			   surface = ol[0].addRepresentation("surface", { 
			   color: schemeId,
			   visible: representation}) 
} else {
			   surface = ol[0].addRepresentation("surface", { 
			   color: schemeId,
			   visible: Boolean(false) })
}
			self.Drawing.subscribe( function(newValue){
//Set representation
 if(newValue === "cartoon"){
   job.selected_job().setSelectedViewOption(1);
			   cartoon = ol[0].addRepresentation("cartoon", { 
			   color: schemeId,
			   visible: true }) 
 }
 if(newValue === "spacefill"){
   job.selected_job().setSelectedViewOption(2);
			   spacefill = ol[0].addRepresentation("spacefill", { 
			   color: schemeId,
			   visible: true}) 
 }
 if(newValue === "licorice"){
   job.selected_job().setSelectedViewOption(3);
			   licorice = ol[0].addRepresentation("licorice", { 
			   color: schemeId,
			   visible: true}) 
 }
 if(newValue === "surface"){
   job.selected_job().setSelectedViewOption(4);
			   surface = ol[0].addRepresentation("surface", { 
			   color: schemeId,
			   visible: true}) 
 }
				if(newValue == "cartoon"){
				  cartoon.setVisibility(true);
				  spacefill.setVisibility(false);
				  licorice.setVisibility(false);
				  surface.setVisibility(false);
				  
				  // self.spacefill = ko.observable(false);
				  // self.licorice = ko.observable(false);
				  // self.surface =ko.observable(false);
				}
				else if(newValue == "spacefill"){
				  cartoon.setVisibility(false);
				  spacefill.setVisibility(true);
				  licorice.setVisibility(false);
				  surface.setVisibility(false);

				  // self.cartoon = ko.observable(false);
				  // self.licorice = ko.observable(false);
				  // self.surface =ko.observable(false);
				}
				else if (newValue =="licorice"){
				  cartoon.setVisibility(false);
				  spacefill.setVisibility(false);
				  licorice.setVisibility(true);
				  surface.setVisibility(false);

				  // self.cartoon = ko.observable(false);
				  // self.spacefill = ko.observable(false);
				  // self.surface =ko.observable(false);
				}
				else if (newValue =="surface"){
				  cartoon.setVisibility(false);
				  spacefill.setVisibility(false);
				  licorice.setVisibility(false);
				  surface.setVisibility(true);

				  // self.cartoon = ko.observable(false);
				  // self.spacefill = ko.observable(false);
				  // self.licorice = ko.observable(false);
				}
			  })

			stage_cn.autoView()
			stage_cn.setParameters( { backgroundColor: "white" } );
			})
		//end redraw
	
	}; 
    self.viewCN = function() {
        // Two ajax calls, one for each view
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocn",
		    type: "POST",
		    success: function(response) {
				self.MetricSelection("BC")
		        // Clear div
                document.getElementById("viewport_cn_out").innerHTML = "";
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                job.selected_job().setTopoCNResponse(response)
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {

                	job.selected_job().setDensityCNResponse(response)
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                      
                      stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var proteinBetween = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][0]);
                    	}                         
						job.selected_job().setLeftArray(tempArray)		

                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                  return 0xFFFFAC; // light yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0xFFFF5A;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0xFFFF03;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0xFFCA00;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xFF9300;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFF5900; // yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFF2200;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xEA0000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xB00000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0x790000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0x420000; // red
                                }
                                else {
                                  return 0x0000FF; // blue
                                }
                          };
                        });
                        
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			//Set representation
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })

                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white" } );
                        })
                    
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
		// This is called on page load, check if structure has been selected    
		if(typeof ko.unwrap(self.selectedMetric()) !== "undefined")
        {
    		// Comparison view  
    		$.ajax({
    		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage("viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {                        
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                          
                        ]).then(function (ol) {
                            var protein = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][0]);
                        	}
			    
	                    	job.selected_job().setRightArray(tempArray)		
							var leftTempArray = job.selected_job().arrayLeft()
                            var min_leftIndex = Math.min.apply(Math, leftTempArray)
                            var max_leftIndex = Math.max.apply(Math, leftTempArray)
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)
							var rightTempArray = job.selected_job().arrayRight()
                            var min_rightIndex = Math.min.apply(Math, rightTempArray)
                            var max_rightIndex = Math.max.apply(Math, rightTempArray)
							
                            var min_index = Math.min(min_leftIndex, min_rightIndex)
                            var max_index = Math.max(max_rightIndex, max_rightIndex)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
							
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC; // green
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900; // yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000; // red
                                    }
                                    else {
                                      return 0x0000FF; // blue
                                    }
                              };
                            });
                            
                            //ol[0].addRepresentation("cartoon", { color: "sstruc" })
                            var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 // end representation

                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
        }
    };
    
    self.viewCNCc = function() {
        // Two ajax calls, one for each view
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn_out").innerHTML = "";
				self.MetricSelection("CC")
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                    
                      stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][1]);
                    	}
                        
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                  return 0xFFFFAC; // light yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0xFFFF5A;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0xFFFF03;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0xFFCA00;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xFF9300;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFF5900; // yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFF2200;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xEA0000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xB00000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0x790000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0x420000; // red
                                }
                                else {
                                  return 0x0000FF; // blue
                                }
                          };
                        });
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		        var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
			// end set representation
                          
                          self.Drawing.subscribe( function(newValue){
			//Start selection
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			//End selection
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })
                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white" } );
                    })
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
		
		// Comparison view
		if(typeof ko.unwrap(self.selectedMetric()) !== "undefined")
        {
        
    		$.ajax({
    		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage( "viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                          
                        ]).then(function (ol) {
                            var protein = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][1]);
                        	}
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
                            
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC; // light yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900; // yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000; // red
                                    }
                                    else {
                                      return 0x0000FF; // blue
                                    }
                              };
                            });
                            
                            var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

//                        cartoon = ol[0].addRepresentation("cartoon", { 
//                          color: schemeId,
//                          visible: true }) 
//                        
//                        spacefill = ol[0].addRepresentation("spacefill", { 
//                          color: schemeId,
//                          visible: false }) 
//                        licorice = ol[0].addRepresentation("licorice", { 
//                          color: schemeId,
//                          visible: false }) 
//                        surface = ol[0].addRepresentation("surface", { 
//                          color: schemeId,
//                          visible: false }) 
//                          
//                          self.Drawing.subscribe( function(newValue){
			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 // end representation
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
        }
    };
    
    self.viewCNDegree = function() {
        // Two ajax calls, one for each view
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn_out").innerHTML = "";
				self.MetricSelection("DC")
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                    
                      stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][2]);
                    	}
                        
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                  return 0xFFFFAC; // green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0xFFFF5A;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0xFFFF03;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0xFFCA00;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xFF9300;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFF5900; // yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFF2200;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xEA0000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xB00000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0x790000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0x420000; // red
                                }
                                else {
                                  return 0x0000FF; // blue
                                }
                          };
                        });
                        
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		        var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
			// end set representation
                          
                          self.Drawing.subscribe( function(newValue){
			//Start selection
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			//End selection
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })

                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white" } );
                    })
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
		
		// Comparison view
		if(typeof ko.unwrap(self.selectedMetric()) !== "undefined")
        {
    		$.ajax({
    		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                    
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage( "viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                        ]).then(function (ol) {
                            var protein = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][2]);
                        	}
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
                            
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC; // green
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900; // yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000; // red
                                    }
                                    else {
                                      return 0x0000FF; // blue
                                    }
                              };
                            });
                            
                            var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;
//
//                        cartoon = ol[0].addRepresentation("cartoon", { 
//                          color: schemeId,
//                          visible: true }) 
//                        
//                        spacefill = ol[0].addRepresentation("spacefill", { 
//                          color: schemeId,
//                          visible: false }) 
//                        licorice = ol[0].addRepresentation("licorice", { 
//                          color: schemeId,
//                          visible: false }) 
//                        surface = ol[0].addRepresentation("surface", { 
//                          color: schemeId,
//                          visible: false }) 
//                          
//                          self.Drawing.subscribe( function(newValue){
			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 // end representation
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
                     
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
        }
    };
    
    self.viewCNEccentricity = function() {
        // Two ajax calls, one for each view
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn_out").innerHTML = "";
				self.MetricSelection("EC")
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                    
                      stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][3]);
                    	}
                        
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                  return 0xFFFFAC;// green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0xFFFF5A;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0xFFFF03;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0xFFCA00;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xFF9300;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFF5900;// yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFF2200;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xEA0000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xB00000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0x790000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0x420000;// red
                                }
                                else {
                                  return 0x0000FF;// blue
                                }
                          };
                        });
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		        var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
			// end set representation
                          
                          self.Drawing.subscribe( function(newValue){
			//Start selection
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			//End selection
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })

                          stage_cn.autoView()
                          stage_cn.setParameters( { backgroundColor: "white" } );
                        
                      })
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
		
		// Comparison view
		if(typeof ko.unwrap(self.selectedMetric()) !== "undefined")
        {
    		$.ajax({
    		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                    
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage( "viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                          
                        ]).then(function (ol) {
                            var protein = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][3]);
                        	}
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
                            
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC;// green
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900;// yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000;// red
                                    }
                                    else {
                                      return 0x0000FF;// blue
                                    }
                              };
                            });
                            
                            var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 // end representation
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
                     
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
        }
    };
    
    self.viewCNEcc = function() {
        // Two ajax calls, one for each view
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn_out").innerHTML = "";
				self.MetricSelection("ECC")
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                    
                      stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][4]);
                    	}
                        
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                  return 0xFFFFAC;// green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0xFFFF5A;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0xFFFF03;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0xFFCA00;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xFF9300;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFF5900;// yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFF2200;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xEA0000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xB00000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0x790000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0x420000;// red
                                }
                                else {
                                  return 0x0000FF;// blue
                                }
                          };
                        });
                        
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		        var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
			// end set representation
                          
                          self.Drawing.subscribe( function(newValue){
			//Start selection
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			//End selection
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })

                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white" } );
                    })
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
		
		// Comparison view
		if(typeof ko.unwrap(self.selectedMetric()) !== "undefined")
        {
    		$.ajax({
    		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                    
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage( "viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                          
                        ]).then(function (ol) {
                            var protein = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][4]);
                        	}
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
                            
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC;// green
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900;// yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000;// red
                                    }
                                    else {
                                      return 0x0000FF;// blue
                                    }
                              };
                            });
                            
                            var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 // end representation
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
                     
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
        }
    };
    
    self.viewCNCloseness = function() {
        // Two ajax calls, one for each view
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocn",
		    type: "POST",
		    success: function(response) {
				self.MetricSelection("L")
				// Clear div
                document.getElementById("viewport_cn_out").innerHTML = "";
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                    
                      stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][5]);
                    	}
                        
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                  return 0xFFFFAC;// green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0xFFFF5A;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0xFFFF03;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0xFFCA00;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xFF9300;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFF5900;// yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFF2200;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xEA0000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xB00000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0x790000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0x420000;// red
                                }
                                else {
                                  return 0x0000FF;// blue
                                }
                          };
                        });
                        
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		        var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
			// end set representation
                          
                          self.Drawing.subscribe( function(newValue){
			//Start selection
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			//End selection
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })

                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white" } );
                    })
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
		
		// Comparison view
		if(typeof ko.unwrap(self.selectedMetric()) !== "undefined")
        {
    		$.ajax({
    		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                    
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage( "viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                          
                        ]).then(function (ol) {
                            var protein = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][5]);
                        	}
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
                            
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC;// green
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900;// yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000;// red
                                    }
                                    else {
                                      return 0x0000FF;// blue
                                    }
                              };
                            });
                            
                            var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 // end representation
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
                     
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
		}
    };
    
    self.viewCNPr = function() {
        // Two ajax calls, one for each view
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn_out").innerHTML = "";
				self.MetricSelection("PR")
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                    
                      stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][6]);
                    	}
                    	
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                  return 0xFFFFAC;// green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0xFFFF5A;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0xFFFF03;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0xFFCA00;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xFF9300;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFF5900;// yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFF2200;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xEA0000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xB00000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0x790000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0x420000;// red
                                }
                                else {
                                  return 0x0000FF;// blue
                                }
                          };
                        });
                        
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		        var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
			// end set representation
                            
                            self.Drawing.subscribe( function(newValue){
			//Start selection
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			//End selection
                              if(newValue == "cartoon"){
                                cartoon.setVisibility(true);
                                spacefill.setVisibility(false);
                                licorice.setVisibility(false);
                                surface.setVisibility(false);
                                
                                // self.spacefill = ko.observable(false);
                                // self.licorice = ko.observable(false);
                                // self.surface =ko.observable(false);
                              }
                              else if(newValue == "spacefill"){
                                cartoon.setVisibility(false);
                                spacefill.setVisibility(true);
                                licorice.setVisibility(false);
                                surface.setVisibility(false);
  
                                // self.cartoon = ko.observable(false);
                                // self.licorice = ko.observable(false);
                                // self.surface =ko.observable(false);
                              }
                              else if (newValue =="licorice"){
                                cartoon.setVisibility(false);
                                spacefill.setVisibility(false);
                                licorice.setVisibility(true);
                                surface.setVisibility(false);
  
                                // self.cartoon = ko.observable(false);
                                // self.spacefill = ko.observable(false);
                                // self.surface =ko.observable(false);
                              }
                              else if (newValue =="surface"){
                                cartoon.setVisibility(false);
                                spacefill.setVisibility(false);
                                licorice.setVisibility(false);
                                surface.setVisibility(true);
  
                                // self.cartoon = ko.observable(false);
                                // self.spacefill = ko.observable(false);
                                // self.licorice = ko.observable(false);
                              }
                            })

                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white" } );
                    })
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
		
		// Comparison view
		if(typeof ko.unwrap(self.selectedMetric()) !== "undefined")
        {
    		$.ajax({
    		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                    
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage( "viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                          
                        ]).then(function (ol) {
                            var protein = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][6]);
                        	}
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
                            
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC;// green
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900;// yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000;// red
                                    }
                                    else {
                                      return 0x0000FF;// blue
                                    }
                              };
                            });
                            
                            var cartoon;
                            var spacefill;
                            var licorice;
                            var surface;
    
			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 // end representation
                                if(newValue == "cartoon"){
                                  cartoon.setVisibility(true);
                                  spacefill.setVisibility(false);
                                  licorice.setVisibility(false);
                                  surface.setVisibility(false);
                                  
                                  // self.spacefill = ko.observable(false);
                                  // self.licorice = ko.observable(false);
                                  // self.surface =ko.observable(false);
                                }
                                else if(newValue == "spacefill"){
                                  cartoon.setVisibility(false);
                                  spacefill.setVisibility(true);
                                  licorice.setVisibility(false);
                                  surface.setVisibility(false);
    
                                  // self.cartoon = ko.observable(false);
                                  // self.licorice = ko.observable(false);
                                  // self.surface =ko.observable(false);
                                }
                                else if (newValue =="licorice"){
                                  cartoon.setVisibility(false);
                                  spacefill.setVisibility(false);
                                  licorice.setVisibility(true);
                                  surface.setVisibility(false);
    
                                  // self.cartoon = ko.observable(false);
                                  // self.spacefill = ko.observable(false);
                                  // self.surface =ko.observable(false);
                                }
                                else if (newValue =="surface"){
                                  cartoon.setVisibility(false);
                                  spacefill.setVisibility(false);
                                  licorice.setVisibility(false);
                                  surface.setVisibility(true);
    
                                  // self.cartoon = ko.observable(false);
                                  // self.spacefill = ko.observable(false);
                                  // self.licorice = ko.observable(false);
                                }
                              })
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
                     
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
        }
    };
    
    self.viewCNKatz = function() {
        // Two ajax calls, one for each view
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
				self.MetricSelection("KC")
                document.getElementById("viewport_cn_out").innerHTML = "";
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn_out", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                    
                      stage_cn.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][7]);
                    	}
                        
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10

                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                  return 0xFFFFAC;// green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0xFFFF5A;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0xFFFF03;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0xFFCA00;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xFF9300;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFF5900;// yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFF2200;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xEA0000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xB00000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0x790000;
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0x420000;// red
                                }
                                else {
                                  return 0x0000FF;// blue
                                }
                          };
                        });
                        
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

			//Set representation
		        var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
			// end set representation
                          
                          self.Drawing.subscribe( function(newValue){
			//Start selection
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			//End selection
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })
                        
                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white" } );
                        
                    })
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
		
		// Comparison view
		if(typeof ko.unwrap(self.selectedMetric()) !== "undefined")
        {
    		$.ajax({
    		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/topocn",
    		    type: "POST",
    		    success: function(response) {
    		        // Clear div
                    document.getElementById("viewport_compare_cn").innerHTML = "";
                    
                    // Create NGL Stage object
                    stage_cn_comp = new NGL.Stage( "viewport_compare_cn", {sampleLevel: -1} );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage_cn_comp.handleResize();
                    }, false );
                    
                    // Code for visualization
                    var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                    $.ajax({
        		    url: "/api/mdtask/jobs/" + self.selectedMetric().iden + "/densitycn",
        		    type: "POST",
        		    success: function(response) {
                        var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                        Promise.all([
                        
                          stage_cn_comp.loadFile(pdbBlob, { ext: "pdb" }),
                          NGL.autoLoad(csvBlob, {
                            ext: "csv",
                            delimiter: " ",
                            comment: "#",
                            columnNames: true
                          })
                          
                        ]).then(function (ol) {
                            var protein = ol[ 0 ]
                            var qmean = ol[ 1 ].data
                            
                            var tempArray = []
                            
                            for (i = 0; i < qmean.length; i++) {
                        		tempArray.push(qmean[i][7]);
                        	}
                            
                            var min_index = Math.min.apply(Math, tempArray)
                            var max_index = Math.max.apply(Math, tempArray)
                            var diff_index = max_index - min_index
                            var increment_index = diff_index/10
                            
                            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                              this.atomColor = function (atom) {
                                    if (parseFloat(tempArray[ atom.residueIndex ]) <= min_index ) {
                                      return 0xFFFFAC;// green
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                      return 0xFFFF5A;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                      return 0xFFFF03;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                      return 0xFFCA00;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                      return 0xFF9300;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                      return 0xFF5900;// yellow
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                      return 0xFF2200;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                      return 0xEA0000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                      return 0xB00000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                      return 0x790000;
                                    }
                                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                      return 0x420000;// red
                                    }
                                    else {
                                      return 0x0000FF;// blue
                                    }
                              };
                            });
                            
                            var cartoon;
                            var spacefill;
                            var licorice;
                            var surface;
    
//                            cartoon = ol[0].addRepresentation("cartoon", { 
//                              color: schemeId,
//                              visible: true }) 
//                            
//                            spacefill = ol[0].addRepresentation("spacefill", { 
//                              color: schemeId,
//                              visible: false }) 
//                            licorice = ol[0].addRepresentation("licorice", { 
//                              color: schemeId,
//                              visible: false }) 
//                            surface = ol[0].addRepresentation("surface", { 
//                              color: schemeId,
//                              visible: false }) 
//                              
//                              self.Drawing.subscribe( function(newValue){
			//Set representation
		    var representation = new Boolean(false);
			if (job.selected_job().SelectedViewOption() === "Cartoon") {
			   representation = new Boolean(true)
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: representation }) 
			} else {
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: Boolean(false) }) 
			}

			if (job.selected_job().SelectedViewOption() === "Spacefill") {
			   representation = new Boolean(true)
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}

			if (job.selected_job().SelectedViewOption() === "Licorice") {
			   representation = new Boolean(true)
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: Boolean(false) })
		        }
			if (job.selected_job().SelectedViewOption() === "Surface") {
			   representation = new Boolean(true)
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: representation}) 
			} else {
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: Boolean(false) })
			}
                        self.Drawing.subscribe( function(newValue){
			 if(newValue === "cartoon"){
			   job.selected_job().setSelectedViewOption(1);
                           cartoon = ol[0].addRepresentation("cartoon", { 
                           color: schemeId,
                           visible: true }) 
			 }
			 if(newValue === "spacefill"){
			   job.selected_job().setSelectedViewOption(2);
                           spacefill = ol[0].addRepresentation("spacefill", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "licorice"){
			   job.selected_job().setSelectedViewOption(3);
                           licorice = ol[0].addRepresentation("licorice", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 if(newValue === "surface"){
			   job.selected_job().setSelectedViewOption(4);
                           surface = ol[0].addRepresentation("surface", { 
                           color: schemeId,
                           visible: true}) 
			 }
			 // end representation
                                if(newValue == "cartoon"){
                                  cartoon.setVisibility(true);
                                  spacefill.setVisibility(false);
                                  licorice.setVisibility(false);
                                  surface.setVisibility(false);
                                  
                                  // self.spacefill = ko.observable(false);
                                  // self.licorice = ko.observable(false);
                                  // self.surface =ko.observable(false);
                                }
                                else if(newValue == "spacefill"){
                                  cartoon.setVisibility(false);
                                  spacefill.setVisibility(true);
                                  licorice.setVisibility(false);
                                  surface.setVisibility(false);
    
                                  // self.cartoon = ko.observable(false);
                                  // self.licorice = ko.observable(false);
                                  // self.surface =ko.observable(false);
                                }
                                else if (newValue =="licorice"){
                                  cartoon.setVisibility(false);
                                  spacefill.setVisibility(false);
                                  licorice.setVisibility(true);
                                  surface.setVisibility(false);
    
                                  // self.cartoon = ko.observable(false);
                                  // self.spacefill = ko.observable(false);
                                  // self.surface =ko.observable(false);
                                }
                                else if (newValue =="surface"){
                                  cartoon.setVisibility(false);
                                  spacefill.setVisibility(false);
                                  licorice.setVisibility(false);
                                  surface.setVisibility(true);
    
                                  // self.cartoon = ko.observable(false);
                                  // self.spacefill = ko.observable(false);
                                  // self.licorice = ko.observable(false);
                                }
                              })
                            stage_cn_comp.autoView()
                            stage_cn_comp.setParameters( { backgroundColor: "white" } );
                            
                            // asign events and call stage sync
                            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
                            stage_cn_comp.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
                            sync_controller();
                        })
        			},
        			error: function(http) {
        				$("#error_heading").html("Error displaying output");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when fetching the output data of the job");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
                     
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
        }
    };
}

function RCMStage() {
    var self = this;
    
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Topology = ko.observable();
    self.Trajectory = ko.observable();
    self.Residue = ko.observable();
    self.Chain = ko.observable();
    self.Cutoff = ko.observable();
    self.Step = ko.observable();
    
    self.StageType = ko.observable("Residue Contact Map");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.show_evaluation = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("rcm-frame");
        frame.src = "/api/visualization/rcm/" + job_id;
	}
	
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Topology(stage.Topology.split(":")[0]);
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Residue(stage.Residue.split(":")[0]);
        self.Chain(stage.Chain.split(":")[0]);
        self.Cutoff(stage.Cutoff.split(":")[0]);
        self.Step(stage.Step.split(":")[0]);
    };
    self.downloadNetwRCM = function() {
        var form = $("form#netw_rcm");
        form.submit();
    };
    self.downloadTopoRCM = function() {
        var form = $("form#topo_rcm");
        form.submit();
    };
    self.downloadTrajRCM = function() {
        var form = $("form#traj_rcm");
        form.submit();
    };
}

function RCHStage() {
    var self = this;
    
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.StageType = ko.observable("Residue Contact Heatmap");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.show_evaluation = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("rch-frame");
        frame.src = "/api/visualization/rch/" + job_id;
	}
        
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
    };
    self.downloadNetwRCH = function() {
        var form = $("form#netw_rch");
        form.submit();
    };
}

function DCCStage() {
    var self = this;
    
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Topology = ko.observable();
    self.Trajectory = ko.observable();
    self.Step = ko.observable();
    self.Select = ko.observable();
    
    self.StageType = ko.observable("Dynamic Cross Correlation");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.show_evaluation = function(data) {
	    var job_id = job.selected_job().JobID();
            
        var frame = document.getElementById("dcc-frame");
        frame.src = "/api/visualization/dcc/" + job_id;
	}
        
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Topology(stage.Topology.split(":")[0]);
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Step(stage.Step.split(":")[0]);
        self.Select(stage.Select.split(":")[0]);
    };
    self.downloadTopoDCC = function() {
        var form = $("form#topo_dcc");
        form.submit();
    };
    self.downloadTrajDCC = function() {
        var form = $("form#traj_dcc");
        form.submit();
    };
    self.downloadCorrDCC = function() {
        var form = $("form#corr_dcc");
        form.submit();
    };
}

function PRSStage() {
    var self = this;
    
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.TopoFinal = ko.observable();
    self.Topology = ko.observable();
    self.Trajectory = ko.observable();
    self.Step = ko.observable();
    self.Perturbations = ko.observable();

    self.Drawing = ko.observable("cartoon");
    // self.cartoon = ko.observable(true);
    // self.spacefill = ko.observable(false);
    // self.licorice = ko.observable(false);
    // self.surface = ko.observable(false);
    
    self.StageType = ko.observable("Perturbation Response Scanning");
    self.strucMin = ko.observable();
    self.strucMax = ko.observable();
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.TopoFinal(stage.TopoFinal.split(":")[0]);
        self.Topology(stage.Topology.split(":")[0]);
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Step(stage.Step.split(":")[0]);
        self.Perturbations(stage.Perturbations.split(":")[0]);
        
        self.strucMin(0);
        self.strucMax(1);
    };
    
    self.viewPRS = function() {
        // Full scaling
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topoprs",
		    type: "POST",
		    success: function(response) {
		        
                $( document ).ready(function() {
                    setTimeout(function() {
                        // Clear div
                        document.getElementById("viewport_prs_out").innerHTML = "";
                        
                        // Create NGL Stage object
                        var stage = new NGL.Stage( "viewport_prs_out", {sampleLevel: -1} );
                        stage.setParameters( { backgroundColor: "white" } );
                        
                        // Handle window resizing
                        window.addEventListener( "resize", function( event ){
                            stage.handleResize();
                        }, false );
                        
                        // Code for visualization
                        var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                        
                        
                        $.ajax({
                		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/outcsvprs",
                		    type: "POST",
                    		    success: function(response) {
                                var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                                Promise.all([
                                
                                    stage.loadFile(pdbBlob, { ext: "pdb" }),
                                    NGL.autoLoad(csvBlob, {
                                        ext: "csv",
                                    })
                                  
                                ]).then(function (ol) {
                                    var protein = ol[ 0 ]
                                    var coefficients = ol[ 1 ].data
                                    
                                    self.strucMin(0);
                                    //var min_index = self.strucMin()//Math.min.apply(Math, coefficients) //change to 0 for corr
                                    self.strucMax(1);
                                    //var max_index = 1//Math.max.apply(Math, coefficients) //change to 1 for corr
                                    var diff_index = (self.strucMax() - self.strucMin())
                                    var increment_index = (diff_index/256)//diff_index/10
                                    var increments = [];
                                    var hex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
                                    var allhexcomb = [];
                                    var hexcolor;
                                    var counter =0;
                                    
                                    for (i=15;i>0;i--){
                                        for (j=15;j>0;j--){
                                            allhexcomb.push(hex[i]+hex[j]);
                                            increments.push(counter*increment_index)
                                            counter += 1;
                                        }   
                                    }
                                    
                                    var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                                      this.atomColor = function (atom) {
                                            for (i=0;i<256;i++){
                                                if (parseFloat(coefficients[ atom.residueIndex ]) < (self.strucMin()+increment_index*i)) {
                                                    hexcolor = "0xFF" + allhexcomb[i] + "00";
                                                    return hexcolor
                                                }
                                            }
                                        };
                                    });
                                    
                                    //ol[0].addRepresentation("cartoon", { color: schemeId, radiusScale: 1, opacity: 1 })

                                    var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

                        cartoon = ol[0].addRepresentation("cartoon", { 
                          color: schemeId,
                          visible: true, radiusScale: 1, opacity: 1  }) 
                        
                        spacefill = ol[0].addRepresentation("spacefill", { 
                          color: schemeId, 
                          sele:".CA",
                          visible: false, radiusScale: 1, opacity: 1 }) 
                        licorice = ol[0].addRepresentation("licorice", { 
                          color: schemeId,
                          visible: false, radiusScale: 1, opacity: 1  }) 
                        surface = ol[0].addRepresentation("surface", { 
                          color: schemeId,
                          visible: false, radiusScale: 1, opacity: 1  }) 
                          
                          self.Drawing.subscribe( function(newValue){
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })

                          // self.spacefill.subscribe( function(newValue){
                          //   if(newValue == true){
                          //     cartoon.setVisibility(false);
                          //     spacefill.setVisibility(true);
                          //     licorice.setVisibility(false);
                          //     surface.setVisibility(false);

                          //     // self.cartoon = ko.observable(false);
                          //     // self.licorice = ko.observable(false);
                          //     // self.surface =ko.observable(false);
                          //   }
                          //   else{
                          //     spacefill.setVisibility(false);
                          //   }
                          // })

                          // self.licorice.subscribe( function(newValue){
                          //   if(newValue == true){
                          //     cartoon.setVisibility(false);
                          //     spacefill.setVisibility(false);
                          //     licorice.setVisibility(true);
                          //     surface.setVisibility(false);

                          //     // self.cartoon = ko.observable(false);
                          //     // self.spacefill = ko.observable(false);
                          //     // self.surface =ko.observable(false);
                          //   }
                          //   else{
                          //     licorice.setVisibility(false);
                          //   }
                          // })

                          // self.surface.subscribe( function(newValue){
                          //   if(newValue == true){
                          //     cartoon.setVisibility(false);
                          //     spacefill.setVisibility(false);
                          //     licorice.setVisibility(false);
                          //     surface.setVisibility(true);

                          //     // self.cartoon = ko.observable(false);
                          //     // self.spacefill = ko.observable(false);
                          //     // self.licorice = ko.observable(false);
                          //   }
                          //   else{
                          //     surface.setVisibility(false);
                          //   }
                          // }) 
                                    ol[0].autoView()
                                    ol[0].setScale(1.6)
                                  
                      		stage.setRock(true)
        					stage.signals.clicked.add(function () { stage.toggleRock(false) });
                                    
                                    //stage.setParameters( { backgroundColor: "white" } );
                                })
                			},
                			error: function(http) {
                				$("#error_heading").html("Error displaying output");
                				if(http.status == 400) {
                				    $("#error_content").text(http.responseText);
                				} else {
                				    $("#error_content").text("An error occured when fetching the output data of the job");
                				}
                				$("#errorModal").modal('show');
                			},
                            cache: false,
                            contentType: false,
                            processData: false
                		});
                		
                    }, 1000);
                });
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
    };
    
    self.viewPRSDyn = function() {
        // Min-max scaling
        $.ajax({
		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topoprs",
		    type: "POST",
		    success: function(response) {
		        // Clear div
		        document.getElementById("viewport_prs_out").innerHTML = "";
                
                // Create NGL Stage object
                var stage = new NGL.Stage( "viewport_prs_out", {sampleLevel: -1} );
                stage.setParameters( { backgroundColor: "white" } );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                
                
                
                $.ajax({
    		    url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/outcsvprs",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                    
                      stage.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var coefficients = ol[ 1 ].data
                        
                        self.strucMin(Math.min.apply(Math, coefficients));
                        //var min_index = Math.min.apply(Math, coefficients) //change to 0 for corr
                        self.strucMax(Math.max.apply(Math, coefficients));
                        //var max_index = Math.max.apply(Math, coefficients) //change to 1 for corr
                        var diff_index = (self.strucMax() - self.strucMin())
                        var increment_index = diff_index/10// (diff_index/256)
                        /*var increments = [];
                        var hex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
                        var allhexcomb = [];
                        var hexcolor;
                        var counter =0;*/
                        
                        /*for (i=15;i>0;i--){
                            for (j=15;j>0;j--){
                                allhexcomb.push(hex[i]+hex[j]);
                                increments.push(counter*increment_index)
                                counter += 1;
                            }
                        }*/
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                            this.atomColor = function (atom) {
                                /*for (i=0;i<256;i++){
                                    if (parseFloat(coefficients[ atom.residueIndex ]) < (min_index+increment_index*i)) {
                                        hexcolor = "0xFF" + allhexcomb[i] + "00";
                                        return hexcolor
                                    }
                                }*/
                                if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin() ) {
                                  return 0xFF5900;  // yellow
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index ) {
                                  return 0xFFE500;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index*2 ) {
                                  return 0xFF2200;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index*3 ) {
                                  return 0xFFB200;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index*4 ) {
                                  return 0xEA0000;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index*5 ) {
                                  return 0xFF7F00;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index*6 ) {
                                  return 0xB00000;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index*7 ) {
                                  return 0xFF4C00;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index*8 ) {
                                  return 0x790000;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) < self.strucMin()+increment_index*9 ) {
                                  return 0xFF1900;  // 
                                }
                                else if (parseFloat(coefficients[ atom.residueIndex ]) <= self.strucMax() ) {
                                  return 0x420000;  // red
                                }
                                else {
                                  return 0x0000FF;  // blue
                                }
                            };
                        });
                        
                        //ol[0].addRepresentation("cartoon", { color: "sstruc" })
                        var cartoon;
                        var spacefill;
                        var licorice;
                        var surface;

                        cartoon = ol[0].addRepresentation("cartoon", { 
                          color: schemeId,
                          visible: true, radiusScale: 1, opacity: 1  }) 
                        
                        spacefill = ol[0].addRepresentation("spacefill", { 
                          color: schemeId, 
                          sele:".CA",
                          visible: false, radiusScale: 1, opacity: 1 }) 
                        licorice = ol[0].addRepresentation("licorice", { 
                          color: schemeId,
                          visible: false, radiusScale: 1, opacity: 1  }) 
                        surface = ol[0].addRepresentation("surface", { 
                          color: schemeId,
                          visible: false, radiusScale: 1, opacity: 1  }) 
                          
                          self.Drawing.subscribe( function(newValue){
                            if(newValue == "cartoon"){
                              cartoon.setVisibility(true);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);
                              
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if(newValue == "spacefill"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(true);
                              licorice.setVisibility(false);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.licorice = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="licorice"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(true);
                              surface.setVisibility(false);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.surface =ko.observable(false);
                            }
                            else if (newValue =="surface"){
                              cartoon.setVisibility(false);
                              spacefill.setVisibility(false);
                              licorice.setVisibility(false);
                              surface.setVisibility(true);

                              // self.cartoon = ko.observable(false);
                              // self.spacefill = ko.observable(false);
                              // self.licorice = ko.observable(false);
                            }
                          })

                       	ol[0].autoView() 
                        ol[0].setScale(1.6)

						stage.setRock(true)
						stage.signals.clicked.add(function () { stage.toggleRock(false) });
						//ol[0].addRepresentation("cartoon", { color: schemeId })
                        //stage.setParameters( { backgroundColor: "white" } );
                    })
    			},
    			error: function(http) {
    				$("#error_heading").html("Error displaying output");
    				if(http.status == 400) {
    				    $("#error_content").text(http.responseText);
    				} else {
    				    $("#error_content").text("An error occured when fetching the output data of the job");
    				}
    				$("#errorModal").modal('show');
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
                 
			},
			error: function(http) {
				$("#error_heading").html("Error displaying output");
				if(http.status == 400) {
				    $("#error_content").text(http.responseText);
				} else {
				    $("#error_content").text("An error occured when fetching the output data of the job");
				}
				$("#errorModal").modal('show');
			},
            cache: false,
            contentType: false,
            processData: false
		});
    };
    
    self.downloadInputPRS = function() {
        var form = $("form#input_prs");
        form.submit();
    };
    self.downloadOutCsvPRS = function() {
        var form = $("form#out_csv_prs");
        form.submit();
    };
}

function CGStage() {
    var self = this;
    
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Topology = ko.observable();
    self.Grain = ko.observable();
    self.Atom = ko.observable();
    
    self.CG_start_job = ko.observable();
    
    self.cutoff_anm_next = ko.observable(24);
    
    self.StageType = ko.observable("Coarse Grain");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Topology(stage.Topology.split(":")[0]);
        self.Grain(stage.Grain.split(":")[0]);
        self.Atom(stage.Atom.split(":")[0].toUpperCase());
        
        self.CG_start_job(stage.Atom.split(":")[0].toUpperCase());
    };
    
    self.viewCG = function() {
        $( document ).ready(function() {
            setTimeout(function() {
                
                $.when(
                  $.get("/api/mdtask/jobs/" + job.selected_job().JobID() + "/outcg", function(responseCG) { }),
                  $.get("/api/mdtask/jobs/" + job.selected_job().JobID() + "/topocg", function(responseOrig) { }),
                ).then(function(responseCG, responseOrig) {
                    // Create NGL Stage object
                    var stage = new NGL.Stage( "viewport_cg_out" );
                    
                    // Handle window resizing
                    window.addEventListener( "resize", function( event ){
                        stage.handleResize();
                    }, false );
                    
                    // Load PDB entry 1CRN
                    var stringBlobCG = new Blob( [ responseCG ], { type: 'text/plain'} );
                    stage.loadFile( stringBlobCG, { ext: "pdb" }).then(function (o) {
                        o.addRepresentation("hyperball", { color: "element", radiusScale: "1" })
                    	o.autoView(500)
                    })
                    
                    var stringBlobOrig = new Blob( [ responseOrig ], { type: 'text/plain'} );
                    stage.loadFile( stringBlobOrig, { ext: "pdb" }).then(function (o) {
                        o.addRepresentation("backbone", { color: "element", radiusScale: "0.5" })
                    	o.autoView(500)
                    })
                    
        			stage.setRock(true)
        			stage.signals.clicked.add(function () { stage.toggleRock(false) });
                    stage.setParameters( { backgroundColor: "white" } );
                });
                
            }, 1000);
        });
    };
    
    self.downloadTopoCG = function() {
        var form = $("form#topo_cg");
        form.submit();
    };
    
    self.downloadOutputCG = function() {
        var form = $("form#output_cg");
        form.submit();
    };
    
    self.start_job_anm_next = function() {
		if(site.User())
		{
    	    try
            {
    			var form = $("form#anm-form")
        		var formData = new FormData(form[0]);
        		
    		    formData.append('jobname', job.selected_job().JobName());
    		    formData.append('topology_anm', job.selected_job().JobID().toString());
    		    formData.append('cutoff_anm', self.cutoff_anm_next());
    		    formData.append('atom_anm', self.Atom());
    		    
    		    formData.append('cg_start_job', job.selected_job().JobID().toString());
    		    
    		    formData.append('description_anm', job.selected_job().JobDescription());
    		    formData.append('email_anm', 'no');
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/anm",
        		    type: "POST",
        		    data: formData,
        		    success: function(id) {
        				job.getJobs()
        			    window.location = "/#jobs/" + id
        			},
        			error: function(http) {
        				$("#error_heading").html("Error running MD-TASK");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again.");
        				}
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
}

function ANMStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Topology = ko.observable();
    self.Cutoff = ko.observable();
    self.Atom = ko.observable();
    
    self.CG_start_job = ko.observable();
    
    self.mode_gentraj_next = ko.observable(7);
    
    self.StageType = ko.observable("Anisotropic Network Model");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
	
	// to uploda file for next job (independently)
	self.change_conform_nmaa = ko.observable();
	
	self.show_evaluation = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("anm-frame");
        frame.src = "/api/visualization/anm/" + job_id;
	}
	
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Topology(stage.Topology.split(":")[0]);
        self.Cutoff(stage.Cutoff.split(":")[0]);
        self.Atom(stage.Atom.split(":")[0].toUpperCase());
        
        self.CG_start_job(stage.CG_start_job.split(":")[0]);
    };
    
    self.downloadTopoANM = function() {
        var form = $("form#topo_anm");
        form.submit();
    };
    
    self.downloadWANM = function() {
        var form = $("form#w_anm");
        form.submit();
    };
    self.downloadVTANM = function() {
        var form = $("form#vt_anm");
        form.submit();
    };
    self.downloadUANM = function() {
        var form = $("form#u_anm");
        form.submit();
    };
    self.start_job_nmaa_next = function() {
		if(site.User())
		{
    	    try
            {
    			var form = $("form#nmaa_next-form")
        		var formData = new FormData(form[0]);
        		
    		    formData.append('jobname', job.selected_job().JobName());
    		    
    		    formData.append('complex_nmaa', job.selected_job().JobID().toString());
    		    //formData.append('change_conform_nmaa', ko.toJSON(self.change_conform_nmaa()));
    		    formData.append('atom_nmaa', self.Atom());
    		    
    		    formData.append('cg_start_job', self.CG_start_job());
    		    formData.append('anm_start_job', job.selected_job().JobID().toString());
    		    
    		    formData.append('mode_number_nmaa', self.mode_gentraj_next());
    		    
    		    formData.append('description_nmaa', job.selected_job().JobDescription());
    		    formData.append('email_nmaa', 'no');
                
                $.ajax({
        		    url: "/api/mdtask/jobs/nmaa",
        		    type: "POST",
        		    data: formData,
        		    success: function(id) {
        				job.getJobs()
        			    window.location = "/#jobs/" + id
        			},
        			error: function(http) {
        				$("#error_heading").html("Error running MD-TASK");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again.");
        				}
        				
        				$("#errorModal").modal('show');
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.gotoCG = function() {
	    if (self.CG_start_job() != 0) {
	        window.location = "/#jobs/" + self.CG_start_job();
	    }
	    else {
	        //$("#error_heading").html("Error");
			$("#error_content").text("The current job was run independently and does not have a previous step to return to");
			$("#errorModal").modal('show');
	    }
	}
}

function NMAAStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.CG_PDB = ko.observable();
    self.W_Matrix = ko.observable();
    self.VT_Matrix = ko.observable();
    self.Conf_PDB = ko.observable();
    self.Atom = ko.observable();
    self.Mode_Number = ko.observable();
    
    self.select_mode = ko.observable(7);
    
    self.CG_start_job = ko.observable();
    self.ANM_start_job = ko.observable();
    
    self.StageType = ko.observable("Modal Analysis");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
	
	self.show_evaluation = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("nmaa-frame-one");
        frame.src = "/api/visualization/nmaa/" + job_id + "/all";
        
        frame = document.getElementById("nmaa-frame-two");
        frame.src = "/api/visualization/nmaa/" + job_id + "/specific";
	}
        
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.CG_PDB(stage.CG_PDB.split(":")[0]);
        self.W_Matrix(stage.W_Matrix.split(":")[0]);
        self.VT_Matrix(stage.VT_Matrix.split(":")[0]);
        //self.Conf_PDB(stage.Conf_PDB.split(":")[0]);
        self.Atom(stage.Atom.split(":")[0].toUpperCase());
        self.Mode_Number(stage.Mode_Number.split(":")[0]);
        
        self.CG_start_job(stage.CG_start_job.split(":")[0]);
        self.ANM_start_job(stage.ANM_start_job.split(":")[0]);
    };
    
    self.downloadStructNMAA = function() {
        var form = $("form#struct_nmaa");
        form.submit();
    };
    self.downloadWNMAA = function() {
        var form = $("form#w_nmaa");
        form.submit();
    };
    self.downloadVTNMAA = function() {
        var form = $("form#vt_nmaa");
        form.submit();
    };
    self.downloadAllNMAA = function() {
        var form = $("form#all_nmaa");
        form.submit();
    };
    self.downloadSpecNMAA = function() {
        var form = $("form#spec_nmaa");
        form.submit();
    };
    self.downloadMsfNMAA = function() {
        var form = $("form#msf_nmaa");
        form.submit();
    };
    self.downloadConfChangeNMAA = function() {
        var form = $("form#confchange_nmaa");
        form.submit();
    };
    
    self.viewVM = function() {
        $.ajax({
            url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/toponmaa",
            type: 'POST',
            contentType: 'application/pdb',
            success: function (pdbData) {
                $( document ).ready(function() {
                    setTimeout(function() {
                        $.when(
                            $.get("/api/mdtask/jobs/" + job.selected_job().JobID() + "/nglarrowsnmaa/7", function(responseArrows) { }),
                        ).then(function(responseArrows) {
                            $( "#nglscript" ).remove();
                            $("head").append('<script id="nglscript" type="text/javascript"> ' + responseArrows + '</script>');
                        });
                    }, 1000);
                });
            },
            error: function (x, y, z) {
                console.log("error 201");
            }
        });
    };
    
    self.gotoCG = function() {
	    if (self.CG_start_job() != 0) {
	        window.location = "/#jobs/" + self.CG_start_job();
	    }
	    else {
	        //$("#error_heading").html("Error");
			$("#error_content").text("The current job was run independently and does not have a previous step to return to");
			$("#errorModal").modal('show');
	    }
	}
	self.gotoANM = function() {
	    if (self.ANM_start_job() != 0) {
	        window.location = "/#jobs/" + self.ANM_start_job();
	    }
	    else {
	        //$("#error_heading").html("Error");
			$("#error_content").text("The current job was run independently and does not have a previous step to return to");
			$("#errorModal").modal('show');
	    }
	}
	
    self.select_mode.subscribe(function(select_mode){
        $.ajax({
            url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/toponmaa",
            type: 'POST',
            contentType: 'application/pdb',
            success: function (pdbData) {
                // Clear div
                document.getElementById("viewport_vm_out").innerHTML = "";
                
                $.when(
                    $.get("/api/mdtask/jobs/" + job.selected_job().JobID() + "/nglarrowsnmaa/" + select_mode, function(responseArrows) { }),
                ).then(function(responseArrows) {
                    $( "#nglscript" ).remove();
                    $("head").append('<script id="nglscript" type="text/javascript"> ' + responseArrows + '</script>');
                });
            },
            error: function (x, y, z) {
                console.log("error 201");
            }
        });
    });
}

function MDNMAStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Trajectory = ko.observable();
    self.Topology = ko.observable();
    self.Mode = ko.observable();
    self.Ignn = ko.observable();
    self.Ignc = ko.observable();
    self.Anim = ko.observable();
    
    self.StageType = ko.observable("MDNMA");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.viewMDNMAimg = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("mdnma-frame");
        frame.src = "/api/visualization/mdnmaimg/" + job_id;
	}
	
	self.viewMDNMAstruc = function() {
        $.ajax({
            url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/topomdnma",
            type: 'POST',
            contentType: 'application/pdb',
            success: function (pdbData) {
                $( document ).ready(function() {
                    setTimeout(function() {
                        
                        $.when(
                            $.get("/api/mdtask/jobs/" + job.selected_job().JobID() + "/nglarrowsmdnma", function(responseArrows) { }),
                        ).then(function(responseArrows) {
                            $( "#nglscript" ).remove();
                            $("head").append('<script id="nglscript" type="text/javascript"> ' + responseArrows + '</script>');
                        });
                        
                    }, 1000);
                });
                
            },
            error: function (x, y, z) {
                console.log("error 201");
            }
        });
    };
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Topology(stage.Topology.split(":")[0]);
        self.Mode(stage.Mode.split(":")[0]);
        self.Ignn(stage.Ignn.split(":")[0]);
        self.Ignc(stage.Ignc.split(":")[0]);
        self.Anim(stage.Anim.split(":")[0]);
    };
    self.downloadInputMDNMA = function() {
        var form = $("form#input_mdnma");
        form.submit();
    };
    self.downloadAnimMDNMA = function() {
        var form = $("form#anim_mdnma");
        form.submit();
    };
}

function GenTrajStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Complex_PDB = ko.observable();
    self.VT_Matrix = ko.observable();
    self.Atom = ko.observable();
    self.Mode = ko.observable();
    
    self.StageType = ko.observable("Visualise Vectors");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Complex_PDB(stage.Complex.split(":")[0]);
        self.VT_Matrix(stage.VT_Matrix.split(":")[0]);
        self.Atom(stage.Atom.split(":")[0].toUpperCase());
        self.Mode(stage.Mode.split(":")[0]);
    };
    
    self.viewVV = function() {
        $.ajax({
            url: "/api/mdtask/jobs/" + job.selected_job().JobID() + "/complexgentraj",
            type: 'POST',
            contentType: 'application/pdb',
            success: function (pdbData) {
                var pdbBlob = new Blob( [ pdbData ], { type: 'text/plain'} );
               
                // Create NGL Stage object
                var stage = new NGL.Stage( "viewport_vv_out" );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage.handleResize();
                }, false );
                
        		// Load PDB entry
                stage.loadFile(pdbBlob, { ext: "pdb" }).then(function (o) {
                    o.addRepresentation("spacefill", { color: "element" })
                    o.autoView()
                    
                    // Load DCD entry
                    NGL.autoLoad("/api/mdtask/jobs/" + job.selected_job().JobID() + "/dcdgentraj", { ext: 'dcd' }).then(function (frames) {
                        trajComp = o.addTrajectory(frames)
                        trajComp.trajectory.player.play()
                    })
                })
                stage.setParameters( { backgroundColor: "white" } );
            },
            error: function (x, y, z) {
                console.log("error 201");
            }
        });
    };
    
    self.play = function() {
        trajComp.trajectory.player.play()
    }
    self.stop = function() {
        trajComp.trajectory.player.stop()
    }
    
    self.downloadOutGentraj = function() {
        var form = $("form#out_gentraj");
        form.submit();
    };
    self.downloadComplexGentraj = function() {
        var form = $("form#complex_gentraj");
        form.submit();
    };
    self.downloadVTGentraj = function() {
        var form = $("form#vt_gentraj");
        form.submit();
    };
}

function KMeansStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Trajectory = ko.observable();
    self.Topology = ko.observable();
    
    self.Selection = ko.observable();
    self.Stride = ko.observable();
    self.Nclusters = ko.observable();
    self.Ignn = ko.observable();
    self.Ignc = ko.observable();
    
    self.StageType = ko.observable("Comparative Essential Dynamics");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
	self.show_evaluation = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("kmeans-frame");
        frame.src = "/api/visualization/kmeans/" + job_id;
	}
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Topology(stage.Topology.split(":")[0]);
        
        self.Selection(stage.Selection.split(":")[0]);
        self.Stride(stage.Stride.split(":")[0]);
        self.Nclusters(stage.Nclusters.split(":")[0]);
        self.Ignn(stage.Ignn.split(":")[0]);
        self.Ignc(stage.Ignc.split(":")[0]);
    };
    
    self.downloadInputKmeans = function() {
        var form = $("form#input_kmeans");
        form.submit();
    };
    
    self.downloadOutKmeans = function() {
        var form = $("form#out_kmeans");
        form.submit();
    };
}

function IntPCAStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Trajectory = ko.observable();
    self.Topology = ko.observable();
    
    self.StageType = ko.observable("Internal PCA");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.viewIntPCA = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("intpca-frame-one");
        frame.src = "/api/visualization/intpca/" + job_id + "/1";
        
        frame = document.getElementById("intpca-frame-two");
        frame.src = "/api/visualization/intpca/" + job_id + "/2";
        
        frame = document.getElementById("intpca-frame-three");
        frame.src = "/api/visualization/intpca/" + job_id + "/3";
	}
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Topology(stage.Topology.split(":")[0]);
    };
    
    self.downloadInputIntPCA = function() {
        var form = $("form#input_ipca");
        form.submit();
    };
    self.downloadOutIntPCA = function() {
        var form = $("form#out_ipca");
        form.submit();
    };
}

function PCAStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Trajectory = ko.observable();
    self.Topology = ko.observable();
    
    self.StageType = ko.observable("Standard PCA");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
	
    self.viewPCA = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("pca-frame-one");
        frame.src = "/api/visualization/pca/" + job_id + "/1";
        
        frame = document.getElementById("pca-frame-two");
        frame.src = "/api/visualization/pca/" + job_id + "/2";
        
        frame = document.getElementById("pca-frame-three");
        frame.src = "/api/visualization/pca/" + job_id + "/3";
	}
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Topology(stage.Topology.split(":")[0]);
    };
    
    self.downloadInputPCA = function() {
        var form = $("form#input_pca");
        form.submit();
    };
    self.downloadOutPCA = function() {
        var form = $("form#out_pca");
        form.submit();
    };
}

function MDSStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Trajectory = ko.observable();
    self.Topology = ko.observable();
    
    self.StageType = ko.observable("Multi-dimensional scaling");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.viewMDS = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("mds-frame-one");
        frame.src = "/api/visualization/mds/" + job_id + "/1";
        
        frame = document.getElementById("mds-frame-two");
        frame.src = "/api/visualization/mds/" + job_id + "/2";
        
        frame = document.getElementById("mds-frame-three");
        frame.src = "/api/visualization/mds/" + job_id + "/3";
	}
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Topology(stage.Topology.split(":")[0]);
    };
    
    self.downloadInputMDS = function() {
        var form = $("form#input_mds");
        form.submit();
    };
    
    self.downloadOutMDS = function() {
        var form = $("form#out_mds");
        form.submit();
    };
}

function TSNEStage() {
    var self = this;
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Trajectory = ko.observable();
    self.Topology = ko.observable();
    
    self.StageType = ko.observable("t-Distributed Stochastic Neighbor Embedding");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.viewTSNE = function(data) {
	    var job_id = job.selected_job().JobID();
        
        var frame = document.getElementById("tsne-frame-one");
        frame.src = "/api/visualization/tsne/" + job_id + "/1";
        
        frame = document.getElementById("tsne-frame-two");
        frame.src = "/api/visualization/tsne/" + job_id + "/2";
        
        frame = document.getElementById("tsne-frame-three");
        frame.src = "/api/visualization/tsne/" + job_id + "/3";
	}
    
    self.load = function(stage) {
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Topology(stage.Topology.split(":")[0]);
    };
    self.downloadInputTSNE = function() {
        var form = $("form#input_tsne");
        form.submit();
    };
    self.downloadOutTSNE = function() {
        var form = $("form#out_tsne");
        form.submit();
    };
}

function CPStage() {
    var self = this;
    
    self.Stage_ID = ko.observable();
    
    self.Submitted_At = ko.observable();
    self.Finished_At = ko.observable();
    self.Status = ko.observable();
    
    self.Topology = ko.observable();
    self.Trajectory = ko.observable();
    self.Step = ko.observable();
    self.Matrix = ko.observable();
    self.Avg = ko.observable();
    self.SlidingAvg = ko.observable();
    self.Window = ko.observable();
    
    self.DiffExists = ko.observable();
    
    self.StageType = ko.observable("Communication Propensity");
    
    self.Status.subscribe(function(status) {
    	var stage = job.selected_job().SelectedStage();
	});
    
    self.load = function(stage) {
        
        self.Stage_ID(stage.Stage_ID);
        
        self.Status(stage.Status_ID);
        self.Submitted_At(stage.Submitted_At);
        self.Finished_At(stage.Finished_At);
        
        self.Topology(stage.Topology.split(":")[0]);
        self.Trajectory(stage.Trajectory.split(":")[0]);
        self.Step(stage.Step.split(":")[0]);
        self.Matrix(stage.Matrix.split(":")[0]);
        self.Avg(stage.Avg.split(":")[0]);
        self.SlidingAvg(stage.SlidingAvg.split(":")[0]);
        self.Window(stage.Window.split(":")[0]);
        
        self.DiffExists(stage.DiffExists);
    };
    
  self.viewCP = function(data) {
	    var job_id = job.selected_job().JobID();
      var frame = document.getElementById("cp-frame");
      frame.src = "/api/visualization/cp/" + job_id + "/1";
	}
	
	self.downloadInputCP = function() {
      var form = $("form#input_cp");
      console.log(form);
      form.submit();
    };
  self.downloadCPnumpy = function() {
      var form = $("form#cpnumpy");
      form.submit();
    };
  self.downloadCP = function() {
      var form = $("form#cpdownload");
      form.submit();
    };
}

function Job() {
    var self = this;
    self.JobID = ko.observable();
	self.JobName = ko.observable();
	self.Prefix = ko.observable();
	self.RepeatName = ko.observable();
	self.RepeatDescription = ko.observable();
	self.JobDescription = ko.observable();
	self.Status = ko.observable();
	
	self.error_debug = ko.observable();
	
	self.SubmittedAt = ko.observable();
	self.FinishedAt = ko.observable();
	self.TotalTime = ko.observable();
	
	self.Summary = ko.observable();
	//self.TempID = ko.observable();
	self.CalcNetwork = ko.observable();
	//self.DBCL = ko.observable();
	//self.AvgBCL = ko.observable();
	//self.Traj = ko.observable();
	//self.Heatm = ko.observable();
	self.RCM = ko.observable();
	self.RCH = ko.observable();
	self.DCC = ko.observable();
	self.PRS = ko.observable();
	
	self.CG = ko.observable();
	self.ANM = ko.observable();
	self.NMAA = ko.observable();
	self.MDNMA = ko.observable();
	//self.Conformation = ko.observable();
	self.GenTraj = ko.observable();
	self.KMeans = ko.observable();
	self.IntPCA = ko.observable();
	self.PCA = ko.observable();
	self.MDS = ko.observable();
	self.TSNE = ko.observable();
	self.CP = ko.observable();
	//self.CPanal = ko.observable();

	self.CurrentStage = ko.observable();
	self.SelectedViewOption = ko.observable();

	//Track left right DRN scales
	self.arrayLeft = ko.observable()
	self.arrayRight = ko.observable()
	self.topoCNResponse = ko.observable()
	self.densityCNResponse = ko.observable()
	// metric selection
	self.MetricSelection = ko.observable()
      
	self.SelectedStage = ko.observable();
	self.SelectedStage.subscribe(function(stage) {
	    // This is where to load viewers automatically
        try {
            if (stage.StageType() == "Calculate Network") {
	            job.selected_plot(null);
	            loadPlotViewer();
    	    } else if (stage.StageType() == "Target-Template Alignment") {
    	        setTimeout(function() {
    	            loadMSA(ko.toJS(stage.Alignment()));
    	        }, 200);
    	    } else if(stage.StageType() == "Modeling"){
	            if (self.Status() == 8) {
        	        setTimeout(function() {
    	                loadViewer();
        	        }, 200);
	            }
    	    }
        } catch (e) {}
	});
	self.load = function(j) {
	self.JobID(j.Job_ID);
	self.JobName(j.Job_Name);
	self.JobDescription(j.Description);
	self.Prefix(j.Prefix);
	self.SubmittedAt(j.Submitted_At);
	self.FinishedAt(j.Finished_At);
	self.TotalTime(j.TotalTime);
	
	self.Status(j.Status_ID);
	// This could be made into many else if statments to improve performance
	/*if(j.TempID != null) {
		var temp = new BCLStage();
		temp.load(j.TempID);
		self.TempID(temp);
	}*/
	if(j.CalcNetwork != null) {
		console.log("Three")
		var temp = new CalcNetworkStage();
		temp.load(j.CalcNetwork);
		self.CalcNetwork(temp);
	}
	/*if(j.DeltaBCL != null) {
		var temp = new DBCLStage();
		temp.load(j.DeltaBCL);
		self.DBCL(temp);
	}*/
	/*if(j.AvgBCL != null) {
		var temp = new AvgBCLStage();
		temp.load(j.AvgBCL);
		self.AvgBCL(temp);
	}*/
	/*if(j.Trajectory != null) {
		var temp = new TrajStage();
		temp.load(j.Trajectory);
		self.Traj(temp);
	}*/
	/*if(j.Heatmap != null) {
		var temp = new HeatmStage();
		temp.load(j.Heatmap);
		self.Heatm(temp);
	}*/
	if(j.RCM != null) {
		var temp = new RCMStage();
		temp.load(j.RCM);
		self.RCM(temp);
	}
	if(j.RCH != null) {
		var temp = new RCHStage();
		temp.load(j.RCH);
		self.RCH(temp);
	}
	if(j.DCC != null) {
		var temp = new DCCStage();
		temp.load(j.DCC);
		self.DCC(temp);
	}
	if(j.PRS != null) {
		var temp = new PRSStage();
		temp.load(j.PRS);
		self.PRS(temp);
	}
	if(j.CG != null) {
		var temp = new CGStage();
		temp.load(j.CG);
		self.CG(temp);
	}
	if(j.ANM != null) {
		var temp = new ANMStage();
		temp.load(j.ANM);
		self.ANM(temp);
	}
	if(j.NMAA != null) {
		var temp = new NMAAStage();
		temp.load(j.NMAA);
		self.NMAA(temp);
	}
	if(j.MDNMA != null) {
		var temp = new MDNMAStage();
		temp.load(j.MDNMA);
		self.MDNMA(temp);
	}
	/*if(j.Conformation != null) {
		var temp = new ConformationStage();
		temp.load(j.Conformation);
		self.Conformation(temp);
	}*/
	if(j.GenTraj != null) {
		var temp = new GenTrajStage();
		temp.load(j.GenTraj);
		self.GenTraj(temp);
	}
	if(j.KMeans != null) {
		var temp = new KMeansStage();
		temp.load(j.KMeans);
		self.KMeans(temp);
	}
	if(j.IntPCA != null) {
		var temp = new IntPCAStage();
		temp.load(j.IntPCA);
		self.IntPCA(temp);
	}
	if(j.PCA != null) {
		var temp = new PCAStage();
		temp.load(j.PCA);
		self.PCA(temp);
	}
	if(j.MDS != null) {
		var temp = new MDSStage();
		temp.load(j.MDS);
		self.MDS(temp);
	}
	if(j.TSNE != null) {
		var temp = new TSNEStage();
		temp.load(j.TSNE);
		self.TSNE(temp);
	}
	if(j.CP != null) {
		var temp = new CPStage();
		temp.load(j.CP);
		self.CP(temp);
	}
	/*if(j.CPanal != null) {
		var temp = new CPanalStage();
		temp.load(j.CPanal);
		self.CPanal(temp);
	}*/
	
	
	};
	//Representation option
	self.setSelectedViewOption = function(num) {
	if (num != null) {
		if (num == 1) {
	    	self.SelectedViewOption("Cartoon");
	  	} else if (num == 2) {
	    	self.SelectedViewOption("Spacefill");
	  	} else if (num == 3) {
	  		self.SelectedViewOption("Licorice");
	  	} else if (num == 4) {
	  		self.SelectedViewOption("Surface");
 	  	}

	} else {
		self.SelectedViewOption(null);
	}}

	//set left and right color scales
	self.setLeftArray = function(array) {
	  self.arrayLeft(array)
	}
	self.setRightArray = function(array) {
	  self.arrayRight(array)
	}
	//set topocn response
	self.setTopoCNResponse = function(array) {
	  self.topoCNResponse(array)
	}
	//set densitycn response
	self.setDensityCNResponse = function(array) {
	  self.densityCNResponse(array)
	}

	//set Metric Selection in DRN
	self.setMetricSelection = function(metric) {
	  self.MetricSelection(metric)
	}

	self.selectStage = function(num) {
	    if(num != null) {
	        if (num == 20){
	            self.SelectedStage(self.CalcNetwork());
	        }
	        else if (num == 5){
	            self.SelectedStage(self.RCM());
	        }
	        else if (num == 6){
	            self.SelectedStage(self.DCC());
	        }
	        else if (num == 7){
	            self.SelectedStage(self.PRS());
	        }
	        else if (num == 8){
	            self.SelectedStage(self.CG());
	        }
	        else if (num == 9){
	            self.SelectedStage(self.ANM());
	        }
	        else if (num == 10){
	            self.SelectedStage(self.NMAA());
	        }
	        else if (num == 11){
	            self.SelectedStage(self.MDNMA());
	        }
	        else if (num == 12){
	            self.SelectedStage(self.GenTraj());
	        }
	        else if (num == 21){
	            self.SelectedStage(self.KMeans());
	        }
	        else if (num == 13){
	            self.SelectedStage(self.IntPCA());
	        }
	        else if (num == 14){
	            self.SelectedStage(self.PCA());
	        }
	        else if (num == 15){
	            self.SelectedStage(self.MDS());
	        }
	        else if (num == 16){
	            self.SelectedStage(self.TSNE());
	        }
	        else if (num == 17){
	            self.SelectedStage(self.RCH());
	        }
	        else if (num == 18){
	            self.SelectedStage(self.CP());
	        }
	        else {
	            // Get error message
	            $.get("/api/mdtask/jobs/" + self.JobID() + "/error",function(data){
                    self.error_debug(data);
                });
	            
	        }
	    } else {
	        self.SelectedStage(null);
	    }
	}
}

function JobViewModel() {
	var self = this;
	
	self.jobs = ko.observableArray();
	
	self.selected_job = ko.observable();
	self.selected_job.subscribe(function(value) {
	});
	
	self.selected_plot = ko.observable();
	
	self.loading = ko.observable(false);
    
    self.current_stage = ko.observable();
    self.current_stage_status = ko.observable();
	self.gone_back = false;
	
	self.selectJob = function(job) {
	    if(self.selected_job() == null || self.selected_job().JobID() != job.JobID()) {
    	    self.loading(true);
    	    self.selected_job(job);

    	    window.location = "/#jobs/" + job.JobID();
	    }
	}
	
	self.getJobs = function() {
	    $.ajax({
    		url: "/api/mdtask/jobs",
    		success: function(data) {
    			var temp = [];
    			
    			$.each(data, function(i, job){
    			    var j;
    			    
    			    //if this is the selected job and the status has changed or the current stage has changed, reload the job
    			    if(self.selected_job() != null && job.Job_ID == self.selected_job().JobID()) { 
    			        j = self.selected_job();

    			        if(job.Status_ID != j.Status()) {
        			        self.getJob();
    			        }
    			        //self.selected_job().selectStage(stageSelector(data.Status_ID));
    			    } else {
        			    j = new Job();
        			    j.load(job);
    			    }
    			    
    			    temp.push(j);
    			}); 
         job_list = temp;		
    			self.jobs(temp);
    		},
    		error: function(http) {
    		    console.log(http.responseText)
    		}
    	});
	}
	
	self.getJob = function() {
	    var j = self.selected_job();
	    $.ajax({
    		url: "/api/mdtask/jobs/" + j.JobID(),
    		success: function(data) {
    		    j.load(data);
    		    self.loading(false);
		    //Set representation
	            self.selected_job().setSelectedViewOption(1);
	            self.selected_job().setMetricSelection("BC");
	            self.selected_job().selectStage(stageSelector(data.Status_ID));
    		},
    		error: function(http) {
    		    console.log(http.responseText);
    		}
    	});
	}
	
	self.deleteJob = function(job) {
	    job.remove(function() {
	        self.getJobs();
	        
	        if(job.JobID() == self.selected_job().JobID()) {
	            self.selected_job(null);
	        }
	    })
	}
	
	self.sequences_to_edit = ko.observableArray([]);
	self.mode = ko.observable("view");
	self.f = ko.observable("");
}

/*
$(window).on('resize', function(){
    
    if(viewer != null) {
        var width = $("#viewer_container").width();
        viewer.setWidth(width - 10);
        viewer.setViewerHeight(width - 200);
    }
});*/

var stageSelector = function(status) {
    if (status <= 2) {
        return null;
    }
    else if (status >= 3 && status <= 4) { // CP
        return 18;
    }
    else if (status >= 5 && status <= 6) { // DCC
        return 6;
    }
    else if (status >= 7 && status <= 8) { // DRN
        return 20;
    }
    else if (status >= 9 && status <= 10) { // RIN
        return 20; // Same result page as DRN
    }
    else if (status >= 46 && status <= 47) { 
        return 21;
    }
    else if (status >= 13 && status <= 14) {
        return 5;
    }
    else if (status >= 17 && status <= 18) {
        return 7;
    }
    else if (status >= 20 && status <= 21) {
        return 8;
    }
    else if (status >= 22 && status <= 23) {
        return 9;
    }
    else if (status >= 24 && status <= 25) {
        return 10;
    }
    else if (status >= 26 && status <= 27) {
        return 11;
    }
    else if (status >= 28 && status <= 29) {
        return 12;
    }
    else if (status >= 30 && status <= 31) {
        return 13;
    }
    else if (status >= 32 && status <= 33) {
        return 14;
    }
    else if (status >= 34 && status <= 35) {
        return 15;
    }
    else if (status >= 36 && status <= 37) {
        return 16;
    }
    else if (status >= 38 && status <= 39) {
        return 17;
    }
    else if (status == 49) {
        return 49;
    }
    else if (status == 50) {
        return 50;
    }
}

var plotViewer = null;

function loadPlotViewer() {
    // not sure
}

var job = new JobViewModel()
ko.applyBindings(job, document.getElementById("jobs"));