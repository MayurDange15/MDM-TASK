function IMPiViewModel() {
	var self = this;
	
	/*
	*
	*  Data
	*
	*/
	
	self.jobname = ko.observable('Job 1');
	self.description_traj = ko.observable('');
	
	self.ref_traj = ko.observable();
	self.alt_traj = ko.observable();
	/*self.ref_label_traj = ko.observable();
	self.alt_label_traj = ko.observable();*/
	
	self.email_notification_traj = ko.observable("no");
    
	self.start_job_traj = function() {
		if(site.User())
		{
    	    try
            {
    			$("#traj_input").hide();
    			$("#loading_traj").show();
    			
    			var form = $("form#traj-form")
    			
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
        				
    		        $("#traj_input").show();
    			    $("#loading_traj").hide();
    		        return;
    		    }
    		    
    		    formData.append('ref_traj', ko.toJSON(self.ref_traj()));
    		    formData.append('alt_traj', ko.toJSON(self.alt_traj()));
    		    //formData.append('ref_label_traj', ko.toJSON(self.ref_label_traj()));
    		    //formData.append('alt_label_traj', ko.toJSON(self.alt_label_traj()));
    		    
    		    formData.append('description_traj', self.description_traj());
    		    formData.append('email_notification_traj', self.email_notification_traj());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/trajectory",
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
        				$("#traj_input").show();
        				$("#loading_traj").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#traj_input").show();
				$("#loading_traj").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("trajectory"));
