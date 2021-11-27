function IMPiViewModel() {
	var self = this;
	self.jobname = ko.observable('Job 1');
	self.description_cg = ko.observable('');
	
	self.grain = ko.observable("1");
	self.atom_cg = ko.observable("cb");
	
	self.topologies = ko.observableArray([]);
	self.topology_cg = ko.observable();
	self.topology_option = ko.observable("upload");	
	
	self.email_notification_cg = ko.observable("no");
	
	self.selectedOption_top = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_top(); 
    });	
    
	self.disable_upload_top= ko.observable(false);
	self.disable_select_top = ko.observable(true);

	self.start_job_cg = function() {
		if(site.User())
		{
    	    try
            {
    			$("#cg_input").hide();
    			$("#loading_cg").show();
    			var form = $("form#cg-form")
    			
    			var em = false;
    			if(self.email_notification_cg() == "yes") {
    			    em = true;
    			}
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#cg_input").show();
    			    $("#loading_cg").hide();
    		        return;
    		    }

		    if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_cg', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_cg', ko.toJSON(self.topology_cg()));
    		    }
    		    
		/*
    		    formData.append('topology_cg', ko.toJSON(self.topology_cg()));
		        		    
    		    if(self.trajectory_option() == "select")
    		    {
    		        formData.append('trajectory_cg', self.selectedOption());
    		    }
    		    else
    		    {
    		        formData.append('trajectory_cg', ko.toJSON(self.trajectory_mdnma()));
    		    }
		*/
    		    formData.append('grain', self.grain());
    		    formData.append('atom_cg', self.atom_cg());
    		    
    		    formData.append('description_cg', self.description_cg());
    		    formData.append('email_notification_cg', self.email_notification_cg());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/cg",
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
        				$("#cg_input").show();
        				$("#loading_cg").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#cg_input").show();
				$("#loading_cg").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_cg = function() {
		if(site.User())
		{
    	    try
            {
    			$("#cg_input").hide();
    			$("#loading_cg").show();
    			
    			var form = $("form#cg-form")
    			
    			var em = false;
    			if(self.email_notification_cg() == "yes") {
    			    em = true;
    			}
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#cg_input").show();
    			    $("#loading_cg").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_cg', "sample_job");
    		    formData.append('grain', self.grain());
    		    formData.append('atom_cg', self.atom_cg());
    		    
    		    formData.append('description_cg', self.description_cg());
    		    formData.append('email_notification_cg', self.email_notification_cg());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/cg",
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
        				$("#cg_input").show();
        				$("#loading_cg").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#cg_input").show();
				$("#loading_cg").hide(); 
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
	
	/*self.show_cg_demo = function() {
		$('#nmaModal').modal('show');
	}*/
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

var changeTopologyDiv_cg = function(div) {
	if(div == "upload") {
		$("#upload_topology_cg").addClass('panel-info');
		$("#select_topology_cg").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_cg").removeClass('panel-info');
		$("#select_topology_cg").addClass('panel-info');
	}
}

function clearAutoModel() {
	autoModelViewModel.clearAutoModel();
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("cg"));