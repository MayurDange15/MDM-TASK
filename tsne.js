function IMPiViewModel() {
	var self = this;
	
	self.jobname = ko.observable('Job 1');
	self.description_tsne = ko.observable('');
	
	self.topology_tsne = ko.observable();
	self.trajectory_option = ko.observable("upload");
	self.trajectories = ko.observableArray([]);
	self.topologies = ko.observableArray([]);
	self.topology_option = ko.observable("upload");
	self.trajectory_tsne = ko.observable();
	
	self.email_notification_tsne = ko.observable("no");

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
    
	self.start_job_tsne = function() {
		if(site.User())
		{
    	    try
            {
    			$("#tsne_input").hide();
    			$("#loading_tsne").show();
    			var form = $("form#tsne-form")
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
        				
    		        $("#tsne_input").show();
    			    $("#loading_tsne").hide();
    		        return;
    		    }
    		    
    		   // formData.append('topology_tsne', ko.toJSON(self.topology_tsne()));

		    if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_tsne', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_tsne', ko.toJSON(self.topology_tsne()));
    		    }
    		    
    		    if(self.trajectory_option() == "select")
    		    {
    		        formData.append('trajectory_tsne', self.selectedOption());
    		    }
    		    else
    		    {
					if(self.trajectory_option() == "upload"){
						traj_file = document.getElementById('check_trajsize_tsne');
						if(traj_file.files[0].size/ 1024 / 1024 > 250) {
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
					}
					else{
						url_file = document.getElementById('check_Urltrajsize_tsne');
						if(url_file.files[0].size/ 1024 / 1024 > 250){
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
				}
    		        formData.append('trajectory_tsne', ko.toJSON(self.trajectory_tsne()));
    		    }
    		    
    		    formData.append('description_tsne', self.description_tsne());
    		    formData.append('email_notification_tsne', self.email_notification_tsne());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/tsne",
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
        				$("#tsne_input").show();
        				$("#loading_tsne").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#tsne_input").show();
				$("#loading_tsne").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_tsne = function() {
		if(site.User())
		{
    	    try
            {
    			$("#tsne_input").hide();
    			$("#loading_tsne").show();
    			var form = $("form#tsne-form")
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
        				
    		        $("#tsne_input").show();
    			    $("#loading_tsne").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_tsne', "sample_job");
    		    
    		    formData.append('description_tsne', self.description_tsne());
    		    formData.append('email_notification_tsne', self.email_notification_tsne());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/tsne",
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
        				$("#tsne_input").show();
        				$("#loading_tsne").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#tsne_input").show();
				$("#loading_tsne").hide(); 
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

var changeTopologyDiv_tsne = function(div) {
	if(div == "upload") {
		$("#upload_topology_tsne").addClass('panel-info');
		$("#select_topology_tsne").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_tsne").removeClass('panel-info');
		$("#select_topology_tsne").addClass('panel-info');
	}
}

var changeTrajectoryDiv_tsne = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_tsne").addClass('panel-info');
		$("#url_trajectory_tsne").removeClass('panel-info');
		$("#select_trajectory_tsne").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_tsne").removeClass('panel-info');
		$("#url_trajectory_tsne").addClass('panel-info');
		$("#select_trajectory_tsne").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_tsne").removeClass('panel-info');
		$("#url_trajectory_tsne").removeClass('panel-info');
		$("#select_trajectory_tsne").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("tsne"));