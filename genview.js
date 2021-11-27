function IMPiViewModel() {
	var self = this;
	
	//self.jobs = ko.observableArray();
	
	/*self.getJobs = function() {
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
    			
    			self.jobs(temp);
    		},
    		error: function(http) {
    		    console.log(http.responseText)
    		}
    	});
	}*/
	
	/*
	*  Data
	*/
	
	/*self.topology_genview = ko.observable();
	self.test = ko.observable("testtest");
	
    self.disable_upload = ko.observable(false);
    self.disable_url = ko.observable(true);
    self.disable_select = ko.observable(true);*/
    
    
    // Get URL params
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    
    /*var jobid = getParameterByName('id');
    var jobtype = getParameterByName('type');*/
    
    self.job_id = ko.observable(getParameterByName('id'));
    self.job_type = ko.observable(getParameterByName('type'));
    
    //alert(self.job_id() + " " + self.job_type());
    
    self.load = function(stage) {
        console.log("a");
    };
    
    self.metricFileData = ko.observable();
    
    // fileupload change function 
    this.filePDBChange= function(file) {
        $.ajax({
    	    url: "/api/mdtask/jobs/" + self.job_id() + "/topocn",
    	    type: "POST",
    	    success: function(response) {
    	        //console.log(data);
    	        //console.log(file);
                // Create NGL Stage object
                stage_compare = new NGL.Stage( "viewport_compare", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + self.job_id() + "/densitycn",
    		    type: "POST",
    		    success: function(response) {
                    var csvBlob = new Blob( [ response ], { type: 'text/plain'} );
                    Promise.all([
                      stage_compare.loadFile(pdbBlob, { ext: "pdb" }),
                      NGL.autoLoad(csvBlob, {
                        ext: "csv",
                        delimiter: " ",
                        comment: "#",
                        columnNames: true
                      })
                      
                    ]).then(function (ol) {
                        var protein = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        //console.log(qmean);
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][0]);
                    	}
                        
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) < min_index ) {
                                  return 0x00FF00;  // green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0x33FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0x66FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0x99FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xCCFF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFFFF00;  // yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFFCC00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xFF9900;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xFF6600;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0xFF3300;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0xFF0000;  // red
                                }
                                else {
                                  return 0x0000FF;  // blue
                                }
                          };
                        });
                        
                        //ol[0].addRepresentation("cartoon", { color: "sstruc" })
                        ol[0].addRepresentation("cartoon", { color: schemeId })
                        stage_compare.autoView()
                        stage_compare.setParameters( { backgroundColor: "white", hoverTimeout: -1 } );
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
    
    self.pdbInput = ko.observable()
    self.csvInput = ko.observable()
    self.pdbReader = new FileReader()
    self.csvReader = new FileReader()

    this.clickCNCompare= function() {
        var pdbFile = document.getElementById("uploadPDBFile").files[0];
        var csvFile = document.getElementById("uploadMetricFile").files[0];
        
        // Create NGL Stage object
        stage_compare = new NGL.Stage( "viewport_compare", {sampleLevel: -1} );
        
        // Handle window resizing
        window.addEventListener( "resize", function( event ){
            stage_compare.handleResize();
        }, false );
        
        // Code for visualization
        var pdbBlob = new Blob( [ pdbFile ], { type: 'text/plain'} );
        var csvBlob = new Blob( [ csvFile ], { type: 'text/plain'} );
        
        Promise.all([
          stage_compare.loadFile(pdbBlob, { ext: "pdb" }),
          NGL.autoLoad(csvBlob, {
            ext: "csv",
            delimiter: " ",
            comment: "#",
            columnNames: true
          })
          
        ]).then(function (ol) {
            var proteinComp = ol[ 0 ]
            var qmean = ol[ 1 ].data
            //console.log(qmean);
            var tempArray = []
            
            for (i = 0; i < qmean.length; i++) {
        		tempArray.push(qmean[i][0]);
        	}
            
            var min_index = Math.min.apply(Math, tempArray)
            var max_index = Math.max.apply(Math, tempArray)
            var diff_index = max_index - min_index
            var increment_index = diff_index/10
            
            var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
              this.atomColor = function (atom) {
                    if (parseFloat(tempArray[ atom.residueIndex ]) < min_index ) {
                      return 0x00FF00;  // green
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                      return 0x33FF00;  // 
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                      return 0x66FF00;  // 
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                      return 0x99FF00;  // 
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                      return 0xCCFF00;  // 
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                      return 0xFFFF00;  // yellow
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                      return 0xFFCC00;  // 
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                      return 0xFF9900;  // 
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                      return 0xFF6600;  // 
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                      return 0xFF3300;  // 
                    }
                    else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                      return 0xFF0000;  // red
                    }
                    else {
                      return 0x0000FF;  // blue
                    }
              };
            });
            
            ol[0].addRepresentation("cartoon", { color: schemeId })
            stage_compare.autoView()
            stage_compare.setParameters( { backgroundColor: "white", hoverTimeout: -1 } );
            
            // asign events and call stage sync
            stage_cn.viewer.container.addEventListener( "mousedown", function() { sync_right = true }, false );
            stage_compare.viewer.container.addEventListener( "mousedown", function() { sync_right = false }, false );
            sync_controller();
        })
    }
    
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
        var m = stage_compare.viewerControls.getOrientation()
        stage_cn.viewerControls.orient(m.elements)
    }
    
    function sync_stage_right() {
        var m = stage_cn.viewerControls.getOrientation()
        stage_compare.viewerControls.orient(m.elements)
    }
    // end stage sync logic
    
    self.viewCN = function() {
        $.ajax({
		    url: "/api/mdtask/jobs/" + self.job_id() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn").innerHTML = "";
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + self.job_id() + "/densitycn",
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
                        var proteinBetween = ol[ 0 ]
                        var qmean = ol[ 1 ].data
                        
                        var tempArray = []
                        
                        for (i = 0; i < qmean.length; i++) {
                    		tempArray.push(qmean[i][0]);
                    	}
                        
                        var min_index = Math.min.apply(Math, tempArray)
                        var max_index = Math.max.apply(Math, tempArray)
                        var diff_index = max_index - min_index
                        var increment_index = diff_index/10
                        
                        var schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
                          this.atomColor = function (atom) {
                                if (parseFloat(tempArray[ atom.residueIndex ]) < min_index ) {
                                  return 0x00FF00;  // green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0x33FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0x66FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0x99FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xCCFF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFFFF00;  // yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFFCC00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xFF9900;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xFF6600;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0xFF3300;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0xFF0000;  // red
                                }
                                else {
                                  return 0x0000FF;  // blue
                                }
                          };
                        });
                        
                        //ol[0].addRepresentation("cartoon", { color: "sstruc" })
                        ol[0].addRepresentation("cartoon", { color: schemeId })
                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white", hoverTimeout: -1 } );
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
    
    self.viewCNCloseness = function() {
        $.ajax({
		    url: "/api/mdtask/jobs/" + self.job_id() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn").innerHTML = "";
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + self.job_id() + "/densitycn",
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
                                if (parseFloat(tempArray[ atom.residueIndex ]) < min_index ) {
                                  return 0x00FF00;  // green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0x33FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0x66FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0x99FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xCCFF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFFFF00;  // yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFFCC00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xFF9900;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xFF6600;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0xFF3300;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0xFF0000;  // red
                                }
                                else {
                                  return 0x0000FF;  // blue
                                }
                          };
                        });
                        
                        //ol[0].addRepresentation("cartoon", { color: "sstruc" })
                        ol[0].addRepresentation("cartoon", { color: schemeId })
                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white", hoverTimeout: -1 } );
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
    
    self.viewCNDegree = function() {
        $.ajax({
		    url: "/api/mdtask/jobs/" + self.job_id() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn").innerHTML = "";
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + self.job_id() + "/densitycn",
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
                                if (parseFloat(tempArray[ atom.residueIndex ]) < min_index ) {
                                  return 0x00FF00;  // green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0x33FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0x66FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0x99FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xCCFF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFFFF00;  // yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFFCC00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xFF9900;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xFF6600;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0xFF3300;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0xFF0000;  // red
                                }
                                else {
                                  return 0x0000FF;  // blue
                                }
                          };
                        });
                        
                        //ol[0].addRepresentation("cartoon", { color: "sstruc" })
                        ol[0].addRepresentation("cartoon", { color: schemeId })
                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white", hoverTimeout: -1 } );
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
    
    self.viewCNEccentricity = function() {
        $.ajax({
		    url: "/api/mdtask/jobs/" + self.job_id() + "/topocn",
		    type: "POST",
		    success: function(response) {
		        // Clear div
                document.getElementById("viewport_cn").innerHTML = "";
                
                // Create NGL Stage object
                stage_cn = new NGL.Stage( "viewport_cn", {sampleLevel: -1} );
                
                // Handle window resizing
                window.addEventListener( "resize", function( event ){
                    stage_cn.handleResize();
                }, false );
                
                // Code for visualization
                var pdbBlob = new Blob( [ response ], { type: 'text/plain'} );
                $.ajax({
    		    url: "/api/mdtask/jobs/" + self.job_id() + "/densitycn",
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
                                if (parseFloat(tempArray[ atom.residueIndex ]) < min_index ) {
                                  return 0x00FF00;  // green
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index ) {
                                  return 0x33FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*2 ) {
                                  return 0x66FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*3 ) {
                                  return 0x99FF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*4 ) {
                                  return 0xCCFF00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*5 ) {
                                  return 0xFFFF00;  // yellow
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*6 ) {
                                  return 0xFFCC00;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*7 ) {
                                  return 0xFF9900;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*8 ) {
                                  return 0xFF6600;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) < min_index+increment_index*9 ) {
                                  return 0xFF3300;  // 
                                }
                                else if (parseFloat(tempArray[ atom.residueIndex ]) <= max_index ) {
                                  return 0xFF0000;  // red
                                }
                                else {
                                  return 0x0000FF;  // blue
                                }
                          };
                        });
                        
                        //ol[0].addRepresentation("cartoon", { color: "sstruc" })
                        ol[0].addRepresentation("cartoon", { color: schemeId })
                        stage_cn.autoView()
                        stage_cn.setParameters( { backgroundColor: "white", hoverTimeout: -1 } );
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
    
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("genview"));
