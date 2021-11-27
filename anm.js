function IMPiViewModel() {
	var self = this;
	
	self.jobname = ko.observable('Job 1');
	self.description_anm = ko.observable('');
	
	self.topology_anm = ko.observable();
	self.topology_option = ko.observableArray([]);
	self.topologies = ko.observable("upload");
	self.cutoff_anm = ko.observable("24"); // Caroline suggested that this should be 15
	self.atom_anm = ko.observable("cb");
	
	self.email_notification_anm = ko.observable("no");

	self.selectedOption_top = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_top(); 
    });	
    
	self.disable_upload_top= ko.observable(false);
	self.disable_select_top = ko.observable(true);    

	self.start_job_anm = function() {
		if(site.User())
		{
    	    try
            {
    			$("#anm_input").hide();
    			$("#loading_anm").show();
    			
    			var form = $("form#anm-form")
        		var formData = new FormData(form[0]);
        		
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#anm_input").show();
    			    $("#loading_anm").hide();
    		        return;
    		    }
    		    
    		    if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_anm', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_anm', ko.toJSON(self.topology_anm()));
    		    }
    		    formData.append('cutoff_anm', self.cutoff_anm());
    		    formData.append('atom_anm', self.atom_anm());
    		    
    		    formData.append('description_anm', self.description_anm());
    		    formData.append('email_notification_anm', self.email_notification_anm());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/anm",
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
        				$("#anm_input").show();
        				$("#loading_anm").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#anm_input").show();
				$("#loading_anm").hide(); 
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
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

var changeTopologyDiv_anm = function(div) {
	if(div == "upload") {
		$("#upload_topology_anm").addClass('panel-info');
		$("#select_topology_anm").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_anm").removeClass('panel-info');
		$("#select_topology_anm").addClass('panel-info');
	}
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("anm"));