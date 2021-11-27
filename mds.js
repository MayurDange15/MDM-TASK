function IMPiViewModel() {
	var self = this;
	self.jobname = ko.observable('Job 1');
	self.description_mds = ko.observable('');
	
	self.topology_mds = ko.observable();
	self.trajectory_option = ko.observable("upload");
	self.trajectories = ko.observableArray([]);
	self.topologies = ko.observableArray([]);
	self.topology_option = ko.observable("upload");
	self.trajectory_mds = ko.observable();
	
	self.email_notification_mds = ko.observable("no");

	self.selectedOption_top = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_top(); 
    });
	
	self.selectedOption = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption(); 
    });
    self.disable_upload = ko.observable(false);
    self.disable_url = ko.observable(true);
    self.disable_select = ko.observable(true);

	self.disable_upload_top = ko.observable(false);
	self.disable_select_top = ko.observable(true);
    
	self.start_job_mds = function() {
		if(site.User())
		{
    	    try
            {
    			$("#mds_input").hide();
    			$("#loading_mds").show();
    			var form = $("form#mds-form")
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
        				
    		        $("#mds_input").show();
    			    $("#loading_mds").hide();
    		        return;
    		    }
    		    
    		   // formData.append('topology_mds', ko.toJSON(self.topology_mds()));

		    if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_mds', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_mds', ko.toJSON(self.topology_mds()));
    		    }

    		    
    		    if(self.trajectory_option() == "select")
    		    {
    		        formData.append('trajectory_mds', self.selectedOption());
    		    }
    		    else
    		    {
					if(self.trajectory_option() == "upload"){
						traj_file = document.getElementById('check_trajsize_mds');
						if(traj_file.files[0].size/ 1024 / 1024 > 250) {
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
					}
					else{
						url_file = document.getElementById('check_Urltrajsize_mds');
						if(url_file.files[0].size/ 1024 / 1024 > 250){
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
				}
    		        formData.append('trajectory_mds', ko.toJSON(self.trajectory_mds()));
    		    }
    		    
    		    formData.append('description_mds', self.description_mds());
    		    formData.append('email_notification_mds', self.email_notification_mds());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/mds",
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
        				$("#mds_input").show();
        				$("#loading_mds").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#mds_input").show();
				$("#loading_mds").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_mds = function() {
		if(site.User())
		{
    	    try
            {
    			$("#mds_input").hide();
    			$("#loading_mds").show();
    			var form = $("form#mds-form")
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
        				
    		        $("#mds_input").show();
    			    $("#loading_mds").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_mds', "sample_job");
    		    
    		    formData.append('description_mds', self.description_mds());
    		    formData.append('email_notification_mds', self.email_notification_mds());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/mds",
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
        				$("#mds_input").show();
        				$("#loading_mds").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#mds_input").show();
				$("#loading_mds").hide(); 
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
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

var changeTopologyDiv_mds = function(div) {
	if(div == "upload") {
		$("#upload_topology_mds").addClass('panel-info');
		$("#select_topology_mds").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_mds").removeClass('panel-info');
		$("#select_topology_mds").addClass('panel-info');
	}
}

var changeTrajectoryDiv_mds = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_mds").addClass('panel-info');
		$("#url_trajectory_mds").removeClass('panel-info');
		$("#select_trajectory_mds").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_mds").removeClass('panel-info');
		$("#url_trajectory_mds").addClass('panel-info');
		$("#select_trajectory_mds").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_mds").removeClass('panel-info');
		$("#url_trajectory_mds").removeClass('panel-info');
		$("#select_trajectory_mds").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("mds"));