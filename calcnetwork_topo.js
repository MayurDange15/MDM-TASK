function IMPiViewModel() {
	var self = this;
	
	self.jobname = ko.observable('Job 1');
	self.description_cn = ko.observable('');
	
	self.topology_cn = ko.observable();
	//self.trajectory_option = ko.observable("upload");
	//self.trajectories = ko.observableArray([])
	//self.trajectory_cn = ko.observable();
	//self.traj_url = ko.observable();
	self.threshold_cn = ko.observable("6.7");
	//self.step_cn = ko.observable("50");
	//self.cn = ko.observable("mean");
	
	self.bc_cn = ko.observable(true);
	self.l_cn = ko.observable(false);
	self.katz_cn = ko.observable(false);
	self.dc_cn = ko.observable(false);
	self.cc_cn = ko.observable(false);
	self.ecc_cn = ko.observable(false);
	self.ec_cn = ko.observable(false);
	self.pr_cn = ko.observable(false);
	self.topology_option = ko.observable("upload");
	self.topologies = ko.observableArray([]);
	
	self.disable_upload_top = ko.observable(false);
	self.disable_select_top = ko.observable(true);

	self.selectedOption_top = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_top(); 
    });

	self.email_notification_cn = ko.observable("no");
    
	self.selectedOption = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption(); 
    });
    self.disable_upload = ko.observable(false);
    self.disable_url = ko.observable(true);
    self.disable_select = ko.observable(true);
    
	self.start_job = function() {
		if(site.User())
		{
    	    try
            {
    			$("#cnt_input").hide();
    			$("#loading_cnt").show();
    			
    			var form = $("form#cnt-form")
    			
    			var em = false;
    			if(self.email_notification_cn() == "yes") {
    			    em = true;
    			}
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#cnt_input").show();
    			    $("#loading_cnt").hide();
    		        return;
    		    }
		   
 		    if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_cn', self.selectedOption_top());
    		    }
    		    else
    		    {
    		        formData.append('topology_cn', ko.toJSON(self.topology_cn()));
    		    }
    		    
    		   // formData.append('topology_cn', ko.toJSON(self.topology_cn()));
    		    
    		    /*if(self.trajectory_option() == "upload")
    		    {
    		        formData.append('trajectory_cn', ko.toJSON(self.trajectory_cn()));
    		    }
    		    else if(self.trajectory_option() == "url")
    		    {
    		        formData.append('trajectory_cn', self.traj_url());
    		    }
    		    else
    		    {
    		        formData.append('trajectory_cn', self.selectedOption());
    		    }*/
    		    
    		    formData.append('step_cn', "1");
    		    formData.append('drnstat', "ind");
    		    formData.append('threshold_cn', self.threshold_cn());
    		    
    		    //formData.append('trajectory_cn', self.selectedOption());
    		    
    		    formData.append('description_cn', self.description_cn());
    		    formData.append('email_notification_cn', em);
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/calcnetwork",
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
        				$("#cnt_input").show();
        				$("#loading_cnt").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#cnt_input").show();
				$("#loading_cnt").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_job = function() {
		if(site.User())
		{
    	    try
            {
    			$("#cnt_input").hide();
    			$("#loading_cnt").show();
    			
    			var form = $("form#cnt-form")
    			
    			var em = false;
    			if(self.email_notification_cn() == "yes") {
    			    em = true;
    			}
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#cnt_input").show();
    			    $("#loading_cnt").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_cn', "sample_job");
    		    
    		    formData.append('step_cn', "1");
    		    formData.append('drnstat', "ind");
    		    formData.append('threshold_cn', self.threshold_cn());
    		    
    		    formData.append('description_cn', self.description_cn());
    		    formData.append('email_notification_cn', em);
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/calcnetwork",
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
        				$("#cnt_input").show();
        				$("#loading_cnt").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#cnt_input").show();
				$("#loading_cnt").hide(); 
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

    /*self.trajectory_option.subscribe(function() {
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
    });*/
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
	
	self.clearAutoModel = function() {
		self.jobname();
    	self.sequence('');
    	self.description_cn('');
    	
    	self.template_option("automatic");
    	self.method("blast")
    	self.manual_template(false);
    	self.templates([new Template(null, "A", "True")]);
    	
    	self.alignment_option("automatic");
    	self.alignment_program("t-coffee");
    	self.alignment_mode("pspresso");
    	self.manual_alignment(false);	
    	self.alignment();
    	
    	self.num_models("60");
    	self.refinement_method("very_slow");
			
		showTemplateDiv("automatic");	
		showAlignmentDiv("automatic");
		showModeDiv("t-coffee");
	
		$("#cnt_input").show();
		$("#loading_cnt").hide();
	}
}

var changeTopologyDiv_cnt = function(div) {
	if(div == "upload") {
		$("#upload_topology_cnt").addClass('panel-info');
		$("#select_topology_cnt").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_cnt").removeClass('panel-info');
		$("#select_topology_cnt").addClass('panel-info');
	}
}
/*
var changeTrajectoryDiv_cn = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_cnt").addClass('panel-info');
		$("#url_trajectory_cnt").removeClass('panel-info');
		$("#select_trajectory_cnt").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_cnt").removeClass('panel-info');
		$("#url_trajectory_cnt").addClass('panel-info');
		$("#select_trajectory_cnt").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_cnt").removeClass('panel-info');
		$("#url_trajectory_cnt").removeClass('panel-info');
		$("#select_trajectory_cnt").addClass('panel-info');
	}
}
*/
$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

function clearAutoModel() {
	autoModelViewModel.clearAutoModel();
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("cnt"));