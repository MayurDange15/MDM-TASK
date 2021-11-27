function IMPiViewModel() {
	var self = this;
	
	self.jobname = ko.observable('Job 1');
	self.description_kmeans = ko.observable('');
	
	self.topology_kmeans = ko.observable();
	self.ctopology_kmeans = ko.observable();

	self.trajectory_kmeans = ko.observable();	
	self.ctrajectory_kmeans = ko.observable();
	
	self.trajectory_option = ko.observable("upload");
	self.ctrajectory_option = ko.observable("upload");
	self.trajectories = ko.observableArray([]);
	self.ctrajectories = ko.observableArray([]);

	self.topologies = ko.observableArray([]);
	self.topology_option = ko.observable("upload");
	self.ctopologies = ko.observableArray([]);
	self.ctopology_option = ko.observable("upload");
	/*self.selection_kmeans = ko.observable("(name CB or (name CA and resi GLY))")*/
	
	self.selection_kmeans = ko.observable("name CA")
	self.stride_kmeans = ko.observable("1");
	self.nclusters_kmeans = ko.observable("3");
	self.ignn_kmeans = ko.observable("0");
	self.ignc_kmeans = ko.observable("3");
	
	self.email_notification_kmeans = ko.observable("no");

	self.selectedOption_top = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_top(); 
    });

	self.cselectedOption_top = ko.observable();
	self.cselectedText =  ko.computed(function () { 
        return self.cselectedOption_top(); 
    });
	
	self.selectedOption = ko.observable();
	self.selectedOptionComp = ko.observable();
	self.cselectedOption = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption(); 
    });
    self.cselectedText =  ko.computed(function () { 
        return self.cselectedOption(); 
    });
    self.disable_upload = ko.observable(false);
    self.disable_cupload = ko.observable(false);
    self.disable_url = ko.observable(true);
    self.disable_curl = ko.observable(true);
    self.disable_select = ko.observable(true);
    self.disable_cselect = ko.observable(true);

	self.disable_upload_top = ko.observable(false);
	self.disable_select_top = ko.observable(true);
	self.cdisable_upload_top = ko.observable(false);
	self.cdisable_select_top = ko.observable(true);
    
    
    
	self.start_job_kmeans = function() {
		if(site.User())
		{
    	    try
            {
    			$("#kmeans_input").hide();
    			$("#loading_kmeans").show();
    			var form = $("form#kmeans-form")
    			/*var em = false;
    			if(self.email_notification() == "yes") {
    			    em = true;
    			}*/
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#kmeans_input").show();
    			    $("#loading_kmeans").hide();
    		        return;
    		    }
    		    
    		    //formData.append('topology_kmeans', ko.toJSON(self.topology_kmeans()));
    		    //formData.append('ctopology_kmeans', ko.toJSON(self.ctopology_kmeans()));
    		    
		    if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_kmeans', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_kmeans', ko.toJSON(self.topology_kmeans()));
    		    }

		   if(self.ctopology_option() == "select")
                    {
                        formData.append('ctopology_kmeans', self.cselectedOption_top());
                    }
                    else
                    {
                        formData.append('ctopology_kmeans', ko.toJSON(self.ctopology_kmeans()));
                    }

		    
    		    if(self.trajectory_option() == "select")
    		    {
    		        formData.append('trajectory_kmeans', self.selectedOption());
    		    }
    		    else
    		    {
					if(self.trajectory_option() == "upload"){
						traj_file = document.getElementById('check_trajsize_kmeans');
						if(traj_file.files[0].size/ 1024 / 1024 > 250) {
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
					}
					else{
						url_file = document.getElementById('check_Urltrajsize_kmeans');
						if(url_file.files[0].size/ 1024 / 1024 > 250){
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
				}
    		        formData.append('trajectory_kmeans', ko.toJSON(self.trajectory_kmeans()));
    		    }
    		    
    		    if(self.ctrajectory_option() == "select")
    		    {
    		        formData.append('ctrajectory_kmeans', self.selectedOptionComp());
    		    }
    		    else
    		    {
					if(self.trajectory_option() == "upload"){
						traj_file = document.getElementById('Com_check_trajsize_kmeans');
						if(traj_file.files[0].size/ 1024 / 1024 > 250) {
							throw "Compare trajectory is larger than 250Mb. Please decrease the file size.";
						}	
					}
					else{
						url_file = document.getElementById('com_check_Urltrajsize_kmeans');
						if(url_file.files[0].size/ 1024 / 1024 > 250){
							throw "Compare trajectory is larger than 250Mb. Please decrease the file size.";
						}	
				}
    		        formData.append('ctrajectory_kmeans', ko.toJSON(self.ctrajectory_kmeans()));
    		    }
    		    
    		    formData.append('selection', self.selection_kmeans());
    		    formData.append('stride', self.stride_kmeans());
    		    formData.append('nclusters', self.nclusters_kmeans());
    		    formData.append('ignn', self.ignn_kmeans());
    		    formData.append('ignc', self.ignc_kmeans());
    		    
    		    formData.append('description_kmeans', self.description_kmeans());
    		    formData.append('email_notification_kmeans', self.email_notification_kmeans());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/kmeans",
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
        				$("#kmeans_input").show();
        				$("#loading_kmeans").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#kmeans_input").show();
				$("#loading_kmeans").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_kmeans = function() {
		if(site.User())
		{
    	    try
            {
    			$("#kmeans_input").hide();
    			$("#loading_kmeans").show();
    			
    			var form = $("form#kmeans-form")
    			/*var em = false;
    			if(self.email_notification() == "yes") {
    			    em = true;
    			}*/
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        //alert(validateJobName(self.jobname()));
    		        
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#kmeans_input").show();
    			    $("#loading_kmeans").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_kmeans', "sample_job");
    		    formData.append('ctopology_kmeans', ko.toJSON(self.ctopology_kmeans()));
    		    
    		    formData.append('selection', self.selection_kmeans());
    		    formData.append('stride', self.stride_kmeans());
    		    formData.append('nclusters', self.nclusters_kmeans());
    		    formData.append('ignn', self.ignn_kmeans());
    		    formData.append('ignc', self.ignc_kmeans());
    		    
    		    formData.append('description_kmeans', self.description_kmeans());
    		    formData.append('email_notification_kmeans', self.email_notification_kmeans());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/kmeans",
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
        				$("#kmeans_input").show();
        				$("#loading_kmeans").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#kmeans_input").show();
				$("#loading_kmeans").hide(); 
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

	self.ctopology_option.subscribe(function() {		
        if(self.ctopology_option() == "upload")
	    {
	        self.cdisable_upload_top(false);
            self.cdisable_select_top(true);
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
                    self.ctopologies(array);
    			},
    			error: function(http) {	
    				$("#error_heading").html("Error loading topologies");
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
    		self.cdisable_upload_top(true);
            self.cdisable_select_top(false);
	    }
    });

    self.trajectory_option.subscribe(function() {
        if(self.trajectory_option() == "upload")
	    {
	        self.disable_upload(false);
            self.disable_url(true);
            self.disable_select(true);
	    }
	    else if(self.trajectory_option() == "url")
	    {
	        self.disable_upload(true);
            self.disable_url(false);
            self.disable_select(true);
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
    		self.disable_upload(true);
            self.disable_url(true);
            self.disable_select(false);
	    }
    });
    
    self.ctrajectory_option.subscribe(function() {
        if(self.ctrajectory_option() == "upload")
	    {
	        self.disable_cupload(false);
            self.disable_curl(true);
            self.disable_cselect(true);
	    }
	    else if(self.ctrajectory_option() == "url")
	    {
	        self.disable_cupload(true);
            self.disable_curl(false);
            self.disable_cselect(true);
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
                    self.ctrajectories(array);
    			},
    			error: function(http) {
    				$("#error_heading").html("Error loading trajectories");
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
    		self.disable_cupload(true);
            self.disable_curl(true);
            self.disable_cselect(false);
	    }
    });
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

var changeTopologyDiv_kmeans = function(div) {
	if(div == "upload") {
		$("#upload_topology_kmeans").addClass('panel-info');
		$("#select_topology_kmeans").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_kmeans").removeClass('panel-info');
		$("#select_topology_kmeans").addClass('panel-info');
	}
}

var c_changeTopologyDiv_kmeans = function(div) {
	if(div == "upload") {
		$("#c_upload_topology_kmeans").addClass('panel-info');
		$("#c_select_topology_kmeans").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#c_upload_topology_kmeans").removeClass('panel-info');
		$("#c_select_topology_kmeans").addClass('panel-info');
	}
}

var changeTrajectoryDiv_kmeans = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_kmeans").addClass('panel-info');
		$("#url_trajectory_kmeans").removeClass('panel-info');
		$("#select_trajectory_kmeans").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_kmeans").removeClass('panel-info');
		$("#url_trajectory_kmeans").addClass('panel-info');
		$("#select_trajectory_kmeans").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_kmeans").removeClass('panel-info');
		$("#url_trajectory_kmeans").removeClass('panel-info');
		$("#select_trajectory_kmeans").addClass('panel-info');
	}
}

var c_changeCTrajectoryDiv_kmeans = function(div) {
	if(div == "upload") {
		$("#upload_ctrajectory_kmeans").addClass('panel-info');
		$("#url_ctrajectory_kmeans").removeClass('panel-info');
		$("#select_ctrajectory_kmeans").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_ctrajectory_kmeans").removeClass('panel-info');
		$("#url_ctrajectory_kmeans").addClass('panel-info');
		$("#select_ctrajectory_kmeans").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_ctrajectory_kmeans").removeClass('panel-info');
		$("#url_ctrajectory_kmeans").removeClass('panel-info');
		$("#select_ctrajectory_kmeans").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("kmeans"));
