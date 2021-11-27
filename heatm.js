function IMPiViewModel() {
	var self = this;
	
	/*
	*
	*  Data
	*
	*/
	
	self.jobname = ko.observable('Job 1');
	self.description_heatm = ko.observable('');
	
	self.ref_heatm = ko.observable();
	self.ref_std_heatm = ko.observable();
	self.alt_heatm = ko.observable();
	self.alt_std_heatm = ko.observable();
	//self.prefix_heatm = ko.observable();
	
	self.email_notification_heatm = ko.observable("no");
    
	self.start_job_heatm = function() {
		if(site.User())
		{
    	    try
            {
    			$("#heatm_input").hide();
    			$("#loading_heatm").show();
    			
    			var form = $("form#heatm-form")
    			
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
        				
    		        $("#heatm_input").show();
    			    $("#loading_heatm").hide();
    		        return;
    		    }
    		    
    		    formData.append('ref_heatm', ko.toJSON(self.ref_heatm()));
    		    formData.append('ref_std_heatm', ko.toJSON(self.ref_std_heatm()));
    		    formData.append('alt_heatm', ko.toJSON(self.alt_heatm()));
    		    formData.append('alt_std_heatm', ko.toJSON(self.alt_std_heatm()));
    		    //formData.append('prefix_heatm', ko.toJSON(self.prefix_heatm()));
    		    
    		    formData.append('description_heatm', self.description_heatm());
    		    formData.append('email_notification_heatm', self.email_notification_heatm());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/heatm",
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
        				$("#heatm_input").show();
        				$("#loading_heatm").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#heatm_input").show();
				$("#loading_heatm").hide(); 
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
ko.applyBindings(impi, document.getElementById("heatmap"));
