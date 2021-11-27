function IMPiViewModel() {
	var self = this;
	
	self.jobname = ko.observable('Job 1');
	self.description_mdnma = ko.observable('');
	
	self.topology_mdnma = ko.observable();
	self.trajectory_option = ko.observable("upload");
	self.trajectories = ko.observableArray([]);
	self.topologies = ko.observableArray([]);
	self.topology_option = ko.observable("upload");
	self.trajectory_mdnma = ko.observable();
	self.mode_mdnma = ko.observable("1");
	self.ignn_mdnma = ko.observable("0");
	self.ignc_mdnma = ko.observable("0");
	self.anim_mdnma = ko.observable(false);
	
	self.email_notification_mdnma = ko.observable("no");

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
    
	self.start_job_mdnma = function() {
		if(site.User())
		{
    	    try
            {
    			$("#mdnma_input").hide();
    			$("#loading_mdnma").show();
    			var form = $("form#mdnma-form")
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
        				
    		        $("#mdnma_input").show();
    			    $("#loading_mdnma").hide();
    		        return;
    		    }
    		    
    		   // formData.append('topology_mdnma', ko.toJSON(self.topology_mdnma()));
    		   if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_mdnma', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_mdnma', ko.toJSON(self.topology_mdnma()));
    		    } 

    		    if(self.trajectory_option() == "select")
    		    {
    		        formData.append('trajectory_mdnma', self.selectedOption());
    		    }
    		    else
    		    {
					if(self.trajectory_option() == "upload"){
						traj_file = document.getElementById('check_trajsize_mdnma');
						if(traj_file.files[0].size/ 1024 / 1024 > 250) {
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
					}
					else{
						url_file = document.getElementById('check_Urltrajsize_mdnma');
						if(url_file.files[0].size/ 1024 / 1024 > 250){
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
				}
    		        formData.append('trajectory_mdnma', ko.toJSON(self.trajectory_mdnma()));
    		    }
    		    formData.append('mode_mdnma', self.mode_mdnma());
    		    formData.append('ignn_mdnma', self.ignn_mdnma());
    		    formData.append('ignc_mdnma', self.ignc_mdnma());
    		    
    		    formData.append('description_mdnma', self.description_mdnma());
    		    formData.append('email_notification_mdnma', self.email_notification_mdnma());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/mdnma",
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
        				$("#mdnma_input").show();
        				$("#loading_mdnma").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#mdnma_input").show();
				$("#loading_mdnma").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_mdnma = function() {
		if(site.User())
		{
    	    try
            {
    			$("#mdnma_input").hide();
    			$("#loading_mdnma").show();
    			var form = $("form#mdnma-form")
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
        				
    		        $("#mdnma_input").show();
    			    $("#loading_mdnma").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_mdnma', "sample_job");
    		    formData.append('mode_mdnma', self.mode_mdnma());
    		    formData.append('ignn_mdnma', self.ignn_mdnma());
    		    formData.append('ignc_mdnma', self.ignc_mdnma());
    		    
    		    formData.append('description_mdnma', self.description_mdnma());
    		    formData.append('email_notification_mdnma', self.email_notification_mdnma());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/mdnma",
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
        				$("#mdnma_input").show();
        				$("#loading_mdnma").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#mdnma_input").show();
				$("#loading_mdnma").hide(); 
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

var changeTopologyDiv_mdnma = function(div) {
	if(div == "upload") {
		$("#upload_topology_mdnma").addClass('panel-info');
		$("#select_topology_mdnma").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_mdnma").removeClass('panel-info');
		$("#select_topology_mdnma").addClass('panel-info');
	}
}

var changeTrajectoryDiv_mdnma = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_mdnma").addClass('panel-info');
		$("#url_trajectory_mdnma").removeClass('panel-info');
		$("#select_trajectory_mdnma").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_mdnma").removeClass('panel-info');
		$("#url_trajectory_mdnma").addClass('panel-info');
		$("#select_trajectory_mdnma").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_mdnma").removeClass('panel-info');
		$("#url_trajectory_mdnma").removeClass('panel-info');
		$("#select_trajectory_mdnma").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("mdnma"));