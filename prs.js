function IMPiViewModel() {
	var self = this;
	
	/*
	*  Data
	*/
	
	self.jobname = ko.observable('Job 1');
	self.description_prs = ko.observable('');
	
	//self.initial_prs = ko.observable();
	self.topofinal_prs = ko.observable();
	self.topology_prs = ko.observable();
	self.trajectory_prs = ko.observable();

	self.trajectory_option = ko.observable("upload");
	self.trajectories = ko.observableArray([]);

	self.topologies = ko.observableArray([]);
	self.topology_option = ko.observable("upload");

	self.topofinal = ko.observableArray([]);
	self.topofinal_option = ko.observable("upload");
	
	self.step_prs = ko.observable("50");
	self.perturb_prs = ko.observable("100");
	
	self.email_notification_prs = ko.observable("no");

	self.selectedOption_top = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_top(); 
    });

	self.selectedOption_final = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_final(); 
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

	self.disable_upload_final = ko.observable(false);
    self.disable_select_final = ko.observable(true);
    
	self.start_job_prs = function() {
		if(site.User())
		{
    	    try
            {
    			$("#prs_input").hide();
    			$("#loading_prs").show();
    			
    			var form = $("form#prs-form")
    			
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
        				
    		        $("#prs_input").show();
    			    $("#loading_prs").hide();
    		        return;
    		    }
    		    
    		    //formData.append('initial_prs', ko.toJSON(self.initial_prs()));
    		    //formData.append('topofinal_prs', ko.toJSON(self.topofinal_prs()));
    		
		    	if(self.topofinal_option() == "select")
    		    {
    		        formData.append('topofinal_prs', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topofinal_prs', ko.toJSON(self.topofinal_prs()));
    		    }    

				if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_prs', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_prs', ko.toJSON(self.topology_prs()));
    		    }    
		    
    		    if(self.trajectory_option() == "select")
    		    {
    		        formData.append('trajectory_prs', self.selectedOption());
    		    }
    		    else
    		    {
					if(self.trajectory_option() == "upload"){
						traj_file = document.getElementById('check_trajsize_prs');
						if(traj_file.files[0].size/ 1024 / 1024 > 250) {
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
					}
					else{
						url_file = document.getElementById('check_Urltrajsize_prs');
						if(url_file.files[0].size/ 1024 / 1024 > 250){
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
				}
    		        formData.append('trajectory_prs', ko.toJSON(self.trajectory_prs()));
    		    }
    		    formData.append('step_prs', self.step_prs());
    		    formData.append('perturb_prs', self.perturb_prs());
    		    
    		    formData.append('description_prs', self.description_prs());
    		    formData.append('email_notification_prs', self.email_notification_prs());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/prs",
        		    type: "POST",
        		    data: formData,
        		    success: function(id) {
        				job.getJobs()
						console.log("Check point")
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
        				$("#prs_input").show();
        				$("#loading_prs").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#prs_input").show();
				$("#loading_prs").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_prs = function() {
		if(site.User())
		{
    	    try
            {
    			$("#prs_input").hide();
    			$("#loading_prs").show();
    			
    			var form = $("form#prs-form")
    			
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
        				
    		        $("#prs_input").show();
    			    $("#loading_prs").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_prs', "sample_job");
    		    
    		    formData.append('step_prs', self.step_prs());
    		    formData.append('perturb_prs', self.perturb_prs());
    		    
    		    formData.append('description_prs', self.description_prs());
    		    formData.append('email_notification_prs', self.email_notification_prs());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/prs",
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
        				$("#prs_input").show();
        				$("#loading_prs").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#prs_input").show();
				$("#loading_prs").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.topofinal_option.subscribe(function() {		
        if(self.topofinal_option() == "upload")
	    {
	        self.disable_upload_final(false);
            self.disable_select_final(true);
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
                    self.topofinal(array);
    			},
    			error: function(http) {	
    				$("#error_heading").html("Error loading topologies");
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
    		self.disable_upload_final(true);
            self.disable_select_final(false);
	    }
    });

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

var changeTopoFinalDiv_prs = function(div) {
	if(div == "upload") {
		$("#upload_topofinal_prs").addClass('panel-info');
		$("#select_topofinal_prs").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topofinal_prs").removeClass('panel-info');
		$("#select_topofinal_prs").addClass('panel-info');
	}
}

var changeTopologyDiv_prs = function(div) {
	if(div == "upload") {
		$("#upload_topology_prs").addClass('panel-info');
		$("#select_topology_prs").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_prs").removeClass('panel-info');
		$("#select_topology_prs").addClass('panel-info');
	}
}

var changeTrajectoryDiv_prs = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_prs").addClass('panel-info');
		$("#url_trajectory_prs").removeClass('panel-info');
		$("#select_trajectory_prs").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_prs").removeClass('panel-info');
		$("#url_trajectory_prs").addClass('panel-info');
		$("#select_trajectory_prs").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_prs").removeClass('panel-info');
		$("#url_trajectory_prs").removeClass('panel-info');
		$("#select_trajectory_prs").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("prs"));
