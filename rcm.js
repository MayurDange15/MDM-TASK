function IMPiViewModel() {
	var self = this;
	self.jobname = ko.observable('Job 1');
	self.description_rcm = ko.observable('');
	
	self.topology_rcm = ko.observable();
	self.trajectory_option = ko.observable("upload");
	self.trajectories = ko.observableArray([]);
	self.topologies = ko.observableArray([]);
	self.topology_option = ko.observable("upload");
	self.traj_url_rcm = ko.observable();
	self.trajectory_rcm = ko.observable();
	self.residue_rcm = ko.observable();
	self.chain_rcm = ko.observable("A");
	
	self.cutoff_rcm = ko.observable("6.7");
	self.step_rcm = ko.observable("1");
	
	self.email_notification_rcm = ko.observable("no");

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
    
	self.start_job_rcm = function() {
		if(site.User())
		{
    	    try
            {
    			$("#rcm_input").hide();
    			$("#loading_rcm").show();
    			
    			var form = $("form#rcm-form")
    			
    			var em = false;
    			if(self.email_notification_rcm() == "yes") {
    			    em = true;
    			}
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#rcm_input").show();
    			    $("#loading_rcm").hide();
    		        return;
    		    }
    		    if(!validateTopo(self.topology_rcm())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Please provide a topology");
        			$("#errorModal").modal('show');
        				
    		        $("#rcm_input").show();
    			    $("#loading_rcm").hide();
    		        return;
    		    }
    		    if(!validateTraj(self.trajectory_rcm())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Please provide a trajectory");
        			$("#errorModal").modal('show');
        				
    		        $("#rcm_input").show();
    			    $("#loading_rcm").hide();
    		        return;
    		    }
    		    if(!validateResidue(self.residue_rcm()) || self.residue_rcm() == null){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Residue is required");
        			$("#errorModal").modal('show');
        				
    		        $("#rcm_input").show();
    			    $("#loading_rcm").hide();
    		        return;
    		    }
    		    
    		    if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_rcm', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_rcm', ko.toJSON(self.topology_rcm()));
    		    }
    		    
    		    if(self.trajectory_option() == "upload")
    		    {
					traj_file = document.getElementById('check_trajsize_rcm');
					if(traj_file.files[0].size/ 1024 / 1024 > 250){
						throw "Trajectory is larger than 250Mb. Please decrease the file size.";
					}	
    		        formData.append('trajectory_rcm', ko.toJSON(self.trajectory_rcm()));
    		    }
    		    else if(self.trajectory_option() == "url")
    		    {
					url_file = document.getElementById('check_Urltrajsize_rcm');
					if(url_file.files[0].size/ 1024 / 1024 > 250){
						throw "Trajectory is larger than 250Mb. Please decrease the file size.";
					}	
    		        formData.append('trajectory_rcm', self.traj_url_rcm());
    		    }
    		    else
    		    {
    		        formData.append('trajectory_rcm', self.selectedOption());
    		    }
    		    formData.append('residue_rcm', self.residue_rcm());
    		    formData.append('chain_rcm', self.chain_rcm());
    		    formData.append('cutoff_rcm', self.cutoff_rcm());
    		    formData.append('step_rcm', self.step_rcm());
    		    
    		    formData.append('description_rcm', self.description_rcm());
    		    formData.append('email_notification_rcm', self.email_notification_rcm());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/rcm",
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
        				$("#rcm_input").show();
        				$("#loading_rcm").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#rcm_input").show();
				$("#loading_rcm").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_rcm = function() {
		if(site.User())
		{
    	    try
            {
    			$("#rcm_input").hide();
    			$("#loading_rcm").show();
    			
    			var form = $("form#rcm-form")
    			
    			var em = false;
    			if(self.email_notification_rcm() == "yes") {
    			    em = true;
    			}
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#rcm_input").show();
    			    $("#loading_rcm").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_rcm', "sample_job");
    		    
    		    formData.append('chain_rcm', self.chain_rcm());
    		    formData.append('cutoff_rcm', self.cutoff_rcm());
    		    formData.append('step_rcm', self.step_rcm());
    		    
    		    formData.append('description_rcm', self.description_rcm());
    		    formData.append('email_notification_rcm', self.email_notification_rcm());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/rcm",
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
        				$("#rcm_input").show();
        				$("#loading_rcm").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#rcm_input").show();
				$("#loading_rcm").hide(); 
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
    function validateTopo(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
    function validateTraj(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
    function validateResidue(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

var changeTopologyDiv_rcm = function(div) {
	if(div == "upload") {
		$("#upload_topology_rcm").addClass('panel-info');
		$("#select_topology_rcm").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_rcm").removeClass('panel-info');
		$("#select_topology_rcm").addClass('panel-info');
	}
}

var changeTrajectoryDiv = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_rcm").addClass('panel-info');
		$("#url_trajectory_rcm").removeClass('panel-info');
		$("#select_trajectory_rcm").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_rcm").removeClass('panel-info');
		$("#url_trajectory_rcm").addClass('panel-info');
		$("#select_trajectory_rcm").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_rcm").removeClass('panel-info');
		$("#url_trajectory_rcm").removeClass('panel-info');
		$("#select_trajectory_rcm").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("rcm"));