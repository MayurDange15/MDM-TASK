function IMPiViewModel() {
	var self = this;
	
	/*
	*
	*  Data
	*
	*/
	
	self.jobname = ko.observable('Job 1');
	self.description_dbcl = ko.observable('');
	
	self.reference = ko.observable();
	self.alternatives = ko.observable();
	//self.normalize = ko.observable("no");
	self.normalize = ko.observable("none");
	self.measurement_dbcl = ko.observable("bc");
	
	self.email_notification_dbcl = ko.observable("no");
    
	self.start_job_dbcl = function() {
		if(site.User())
		{
    	    try
            {
    			$("#deltabcl_input").hide();
    			$("#loading_dbcl").show();
    			
    			var form = $("form#dbcl-form")
    			
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
        				
    		        $("#deltabcl_input").show();
    			    $("#loading_dbcl").hide();
    		        return;
    		    }
    		    
    		    formData.append('reference', ko.toJSON(self.reference()));
    		    formData.append('alternatives', ko.toJSON(self.alternatives()));
    		    //formData.append('normalize', self.normalize());
    		    if (self.normalize() != "none")
    		    {
    		        formData.append('normalize', self.normalize());
    		    }
    		    formData.append('measurement_dbcl', self.measurement_dbcl());
    		    
    		    formData.append('description_dbcl', self.description_dbcl());
    		    formData.append('email_notification_dbcl', self.email_notification_dbcl());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/deltabcl",
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
        				$("#deltabcl_input").show();
        				$("#loading_dbcl").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#deltabcl_input").show();
				$("#loading_dbcl").hide(); 
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

function clearAutoModel() {
	autoModelViewModel.clearAutoModel();
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("deltabcl"));
