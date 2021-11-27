function IMPiViewModel() {
	var self = this;
	var traj_file;

	self.jobname = ko.observable('Job 1');
	self.description_cp = ko.observable('');
	
	self.topology_cp = ko.observable();
	
	self.topology_option = ko.observable("upload");
	self.trajectory_option = ko.observable("upload");
	self.trajectories = ko.observableArray([]);
	self.topologies = ko.observableArray([]);
	self.trajectory_cp = ko.observable();
	self.step_cp = ko.observable("10");
	//self.frames_cp = ko.observable();
	self.avg_cp = ko.observable("true");
	self.slidingavg_cp = ko.observable();
	self.window_cp = ko.observable("4");
	self.diff_matrix_cp = ko.observable();
	
	self.email_notification_cp = ko.observable("no");
    
    self.selectedOption_top = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption_top(); 
    });

	self.selectedOption = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption(); 
    });


    self.disable_upload_top = ko.observable(false);
	self.disable_upload_traj = ko.observable(false);
    self.disable_url = ko.observable(true);
    self.disable_select_traj = ko.observable(true);
	self.disable_select_top = ko.observable(true);

	self.demo_show = function(){
		if(site.User()){
			try{
				var formData = new FormData();
				formData.append('topology_cp', "demo_job");
				console.log(formData);
				$.ajax({
        		    url: "/api/mdtask/jobs/cp/2",
        		    type: "POST",
        		    data: formData,
        		    success: function(id) {
        				job.getJobs();
						console.log(job.getJobs());
						console.log(id);
        			    window.location = "/#jobs/" + id;				          			   
        			},
        			error: function(http) {
        				$("#error_heading").html("Error running MD-TASK");
        				console.log(http);
					if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again.");
        				}
        				
        				$("#errorModal").modal('show');
        				$("#cp_input").show();
        				$("#loading_cp").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
			}
			catch(err){
				$("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#cp_input").show();
				$("#loading_cp").hide(); 
			}
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}

	self.start_job_cp = function() {
		if(site.User())
		{
    	    try
            {
    			$("#cp_input").hide();
    			$("#loading_cp").show();
    			var form = $("form#cp-form")
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
        				
    		        $("#cp_input").show();
    			    $("#loading_cp").hide();
    		        return;
    		    }
    		    
				if(self.topology_option() == "select")
    		    {
    		        formData.append('topology_cp', self.selectedOption_top());
    		    }
    		    else
    		    {
					formData.append('topology_cp', ko.toJSON(self.topology_cp()));
    		    }

    		    if(self.trajectory_option() == "select")
    		    {
    		        formData.append('trajectory_cp', self.selectedOption());
    		    }
    		    else
    		    {	
					if(self.trajectory_option() == "upload"){
						traj_file = document.getElementById('check_trajsize_cp');
						if(traj_file.files[0].size/ 1024 / 1024 > 250) {
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
					}
					else{
						url_file = document.getElementById('check_Urltrajsize_cp');
						if(url_file.files[0].size/ 1024 / 1024 > 250){
							throw "Trajectory is larger than 250Mb. Please decrease the file size.";
						}	
				}
    		        formData.append('trajectory_cp', ko.toJSON(self.trajectory_cp()));
    		    }
    	
    		    formData.append('step_cp', self.step_cp());
    		    formData.append('avg_cp', self.avg_cp());
    		    formData.append('slidingavg_cp', self.slidingavg_cp());
    		    formData.append('window_cp', self.window_cp());
    		    
    		    formData.append('description_cp', self.description_cp());
    		    formData.append('email_notification_cp', self.email_notification_cp());

        		$.ajax({
        		    url: "/api/mdtask/jobs/cp",
        		    type: "POST",
        		    data: formData,					
        		    success: function(id) {									
        				job.getJobs();
        			    window.location = "/#jobs/" + id;
        			},
        			error: function(http) {		
        				$("#error_heading").html("Error running MD-TASK");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again.");
        				}
        				
        				$("#errorModal").modal('show');
        				$("#cp_input").show();
        				$("#loading_cp").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#cp_input").show();
				$("#loading_cp").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_cp = function() {
		if(site.User())
		{
    	    try
            {
    			$("#cp_input").hide();
    			$("#loading_cp").show();
    			var form = $("form#cp-form")
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
        				
    		        $("#cp_input").show();
    			    $("#loading_cp").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology_cp', "sample_job");
    		    
    		    formData.append('step_cp', self.step_cp());
    		    formData.append('avg_cp', self.avg_cp());
    		    formData.append('slidingavg_cp', self.slidingavg_cp());
    		    formData.append('window_cp', self.window_cp());
    		    
    		    formData.append('description_cp', self.description_cp());
    		    formData.append('email_notification_cp', self.email_notification_cp());
				
				$.ajax({
        		    url: "/api/mdtask/jobs/cp",
        		    type: "POST",
        		    data: formData,
        		    success: function(id) {
        				job.getJobs()
        			    window.location = "/#jobs/" + id				          			   
        			},
        			error: function(http) {
        				$("#error_heading").html("Error running MD-TASK");
        				console.log(http);
					if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again.");
        				}
        				
        				$("#errorModal").modal('show');
        				$("#cp_input").show();
        				$("#loading_cp").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#cp_input").show();
				$("#loading_cp").hide(); 
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
	        self.disable_upload_traj(false);
            self.disable_url(true);
            self.disable_select_traj(true);
	    }
	    else if(self.trajectory_option() == "url")
	    {
	        self.disable_upload_traj(true);
            self.disable_url(false);
            self.disable_select_traj(true);
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
    		self.disable_upload_traj(true);
            self.disable_url(true);
            self.disable_select_traj(false);
	    }
    });
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

var changeTopologyDiv_cp = function(div) {
	if(div == "upload") {
		$("#upload_topology_cp").addClass('panel-info');
		$("#select_topology_cp").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_topology_cp").removeClass('panel-info');
		$("#select_topology_cp").addClass('panel-info');
	}
}

var changeTrajectoryDiv_cp = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_cp").addClass('panel-info');
		$("#url_trajectory_cp").removeClass('panel-info');
		$("#select_trajectory_cp").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_cp").removeClass('panel-info');
		$("#url_trajectory_cp").addClass('panel-info');
		$("#select_trajectory_cp").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_cp").removeClass('panel-info');
		$("#url_trajectory_cp").removeClass('panel-info');
		$("#select_trajectory_cp").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("cp"));