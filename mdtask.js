function IMPiViewModel() {
    var r = this;

    function t(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    r.jobname = ko.observable("Job 1"), r.description_anm = ko.observable(""), r.topology_anm = ko.observable(), r.cutoff_anm = ko.observable("24"), r.atom_anm = ko.observable("cb"), r.email_notification_anm = ko.observable("no"), r.start_job_anm = function() {
        if (site.User()) try {
            $("#anm_input").hide(), $("#loading_anm").show();
            var e = $("form#anm-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#anm_input").show(), void $("#loading_anm").hide();
            o.append("topology_anm", ko.toJSON(r.topology_anm())), o.append("cutoff_anm", r.cutoff_anm()), o.append("atom_anm", r.atom_anm()), o.append("description_anm", r.description_anm()), o.append("email_notification_anm", r.email_notification_anm()), $.ajax({
                url: "/api/mdtask/jobs/anm",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#anm_input").show(), $("#loading_anm").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#anm_input").show(), $("#loading_anm").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }
}

function clearAutoModel() {
    autoModelViewModel.clearAutoModel()
}
var impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function a(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description = ko.observable(""), t.topology = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.trajectory_bcl = ko.observable(), t.traj_url = ko.observable(), t.threshold = ko.observable("7"), t.step = ko.observable("100"), t.measurement_bcl = ko.observable("bcl"), t.email_notification_bcl = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job = function() {
        if (site.User()) try {
            $("#bcl_input").hide(), $("#loading_bcl").show();
            var e = $("form#bcl-form"),
                o = !1;
            "yes" == t.email_notification_bcl() && (o = !0);
            var r = new FormData(e[0]);
            if (r.append("jobname", t.jobname()), !a(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#bcl_input").show(), void $("#loading_bcl").hide();
            r.append("topology", ko.toJSON(t.topology())), "upload" == t.trajectory_option() ? r.append("trajectory_bcl", ko.toJSON(t.trajectory_bcl())) : "url" == t.trajectory_option() ? r.append("trajectory_bcl", t.traj_url()) : r.append("trajectory_bcl", t.selectedOption()), r.append("threshold", t.threshold()), r.append("step", t.step()), r.append("measurement", t.measurement_bcl()), r.append("description", t.description()), r.append("email_notification_bcl", o), $.ajax({
                url: "/api/mdtask/jobs",
                type: "POST",
                data: r,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#automodel_input").show(), $("#loading_automodel").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#bcl_input").show(), $("#loading_bcl").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_job = function() {
        if (site.User()) try {
            $("#bcl_input").hide(), $("#loading_bcl").show();
            var e = $("form#bcl-form"),
                o = !1;
            "yes" == t.email_notification_bcl() && (o = !0);
            var r = new FormData(e[0]);
            if (r.append("jobname", t.jobname()), !a(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#bcl_input").show(), void $("#loading_bcl").hide();
            r.append("topology", "sample_job"), r.append("threshold", t.threshold()), r.append("step", t.step()), r.append("measurement", t.measurement_bcl()), r.append("description", t.description()), r.append("email_notification_bcl", o), $.ajax({
                url: "/api/mdtask/jobs",
                type: "POST",
                data: r,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#automodel_input").show(), $("#loading_automodel").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#bcl_input").show(), $("#loading_bcl").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    }), t.clearAutoModel = function() {
        t.jobname(), t.sequence(""), t.description(""), t.template_option("automatic"), t.method("blast"), t.manual_template(!1), t.templates([new Template(null, "A", "True")]), t.alignment_option("automatic"), t.alignment_program("t-coffee"), t.alignment_mode("pspresso"), t.manual_alignment(!1), t.alignment(), t.num_models("60"), t.refinement_method("very_slow"), showTemplateDiv("automatic"), showAlignmentDiv("automatic"), showModeDiv("t-coffee"), $("#bcl_input").show(), $("#loading_bcl").hide()
    }
}
ko.applyBindings(impi, document.getElementById("anm"));
var changeTrajectoryDiv_bcl = function(e) {
    "upload" == e ? ($("#upload_trajectory_bcl").addClass("panel-info"), $("#url_trajectory_bcl").removeClass("panel-info"), $("#select_trajectory_bcl").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_bcl").removeClass("panel-info"), $("#url_trajectory_bcl").addClass("panel-info"), $("#select_trajectory_bcl").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_bcl").removeClass("panel-info"), $("#url_trajectory_bcl").removeClass("panel-info"), $("#select_trajectory_bcl").addClass("panel-info"))
};

function clearAutoModel() {
    autoModelViewModel.clearAutoModel()
}
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;

function IMPiViewModel() {
    var r = this;

    function t(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    r.jobname = ko.observable("Job 1"), r.description_avgbcl = ko.observable(""), r.data_files = ko.observable(), r.email_notification_avgbcl = ko.observable("no"), r.start_job_avgbcl = function() {
        if (site.User()) try {
            $("#avgbcl_input").hide(), $("#loading_avgbcl").show();
            var e = $("form#avgbcl-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#avgbcl_input").show(), void $("#loading_avgbcl").hide();
            o.append("data_files", ko.toJSON(r.data_files())), o.append("description_avgbcl", r.description_avgbcl()), o.append("email_notification_avgbcl", r.email_notification_avgbcl()), $.ajax({
                url: "/api/mdtask/jobs/avgbcl",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#avgbcl_input").show(), $("#loading_avgbcl").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#avgbcl_input").show(), $("#loading_avgbcl").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }
}
ko.applyBindings(impi, document.getElementById("bcl"));
impi = new IMPiViewModel;

function IMPiViewModel() {
    var r = this;

    function t(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    r.jobname = ko.observable("Job 1"), r.description_cg = ko.observable(""), r.topology_cg = ko.observable(), r.grain = ko.observable("4"), r.atom_cg = ko.observable("cb"), r.email_notification_cg = ko.observable("no"), r.start_job_cg = function() {
        if (site.User()) try {
            $("#cg_input").hide(), $("#loading_cg").show();
            var e = $("form#cg-form");
            "yes" == r.email_notification_cg() && !0;
            var o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#cg_input").show(), void $("#loading_cg").hide();
            o.append("topology_cg", ko.toJSON(r.topology_cg())), o.append("grain", r.grain()), o.append("atom_cg", r.atom_cg()), o.append("description_cg", r.description_cg()), o.append("email_notification_cg", r.email_notification_cg()), $.ajax({
                url: "/api/mdtask/jobs/cg",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#cg_input").show(), $("#loading_cg").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#cg_input").show(), $("#loading_cg").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }, r.start_example_cg = function() {
        if (site.User()) try {
            $("#cg_input").hide(), $("#loading_cg").show();
            var e = $("form#cg-form");
            "yes" == r.email_notification_cg() && !0;
            var o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#cg_input").show(), void $("#loading_cg").hide();
            o.append("topology_cg", "sample_job"), o.append("grain", r.grain()), o.append("atom_cg", r.atom_cg()), o.append("description_cg", r.description_cg()), o.append("email_notification_cg", r.email_notification_cg()), $.ajax({
                url: "/api/mdtask/jobs/cg",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#cg_input").show(), $("#loading_cg").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#cg_input").show(), $("#loading_cg").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }
}

function clearAutoModel() {
    autoModelViewModel.clearAutoModel()
}
ko.applyBindings(impi, document.getElementById("averagebcl"));
impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function r(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description_cp = ko.observable(""), t.topology_cp = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.trajectory_cp = ko.observable(), t.step_cp = ko.observable("10"), t.avg_cp = ko.observable("true"), t.slidingavg_cp = ko.observable("true"), t.window_cp = ko.observable("4"), t.diff_matrix_cp = ko.observable(), t.email_notification_cp = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job_cp = function() {
        if (site.User()) try {
            $("#cp_input").hide(), $("#loading_cp").show();
            var e = $("form#cp-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#cp_input").show(), void $("#loading_cp").hide();
            o.append("topology_cp", ko.toJSON(t.topology_cp())), "select" == t.trajectory_option() ? o.append("trajectory_cp", t.selectedOption()) : o.append("trajectory_cp", ko.toJSON(t.trajectory_cp())), o.append("step_cp", t.step_cp()), o.append("avg_cp", t.avg_cp()), o.append("slidingavg_cp", t.slidingavg_cp()), o.append("window_cp", t.window_cp()), o.append("description_cp", t.description_cp()), o.append("email_notification_cp", t.email_notification_cp()), $.ajax({
                url: "/api/mdtask/jobs/cp",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#cp_input").show(), $("#loading_cp").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#cp_input").show(), $("#loading_cp").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_cp = function() {
        if (site.User()) try {
            $("#cp_input").hide(), $("#loading_cp").show();
            var e = $("form#cp-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#cp_input").show(), void $("#loading_cp").hide();
            o.append("topology_cp", "sample_job"), o.append("step_cp", t.step_cp()), o.append("avg_cp", t.avg_cp()), o.append("slidingavg_cp", t.slidingavg_cp()), o.append("window_cp", t.window_cp()), o.append("description_cp", t.description_cp()), o.append("email_notification_cp", t.email_notification_cp()), $.ajax({
                url: "/api/mdtask/jobs/cp",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#cp_input").show(), $("#loading_cp").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#cp_input").show(), $("#loading_cp").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    })
}
ko.applyBindings(impi, document.getElementById("cg"));
var changeTrajectoryDiv_cp = function(e) {
    "upload" == e ? ($("#upload_trajectory_cp").addClass("panel-info"), $("#url_trajectory_cp").removeClass("panel-info"), $("#select_trajectory_cp").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_cp").removeClass("panel-info"), $("#url_trajectory_cp").addClass("panel-info"), $("#select_trajectory_cp").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_cp").removeClass("panel-info"), $("#url_trajectory_cp").removeClass("panel-info"), $("#select_trajectory_cp").addClass("panel-info"))
};
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function r(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description_dcc = ko.observable(""), t.topology_dcc = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.trajectory_dcc = ko.observable(), t.step_dcc = ko.observable("100"), t.email_notification_dcc = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job_dcc = function() {
        if (site.User()) try {
            $("#dcc_input").hide(), $("#loading_dcc").show();
            var e = $("form#dcc-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#dcc_input").show(), void $("#loading_dcc").hide();
            o.append("topology_dcc", ko.toJSON(t.topology_dcc())), "select" == t.trajectory_option() ? o.append("trajectory_dcc", t.selectedOption()) : o.append("trajectory_dcc", ko.toJSON(t.trajectory_dcc())), o.append("step_dcc", t.step_dcc()), o.append("description_dcc", t.description_dcc()), o.append("email_notification_dcc", t.email_notification_dcc()), $.ajax({
                url: "/api/mdtask/jobs/dcc",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#dcc_input").show(), $("#loading_dcc").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#dcc_input").show(), $("#loading_dcc").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_dcc = function() {
        if (site.User()) try {
            $("#dcc_input").hide(), $("#loading_dcc").show();
            var e = $("form#dcc-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#dcc_input").show(), void $("#loading_dcc").hide();
            o.append("topology_dcc", "sample_job"), o.append("step_dcc", t.step_dcc()), o.append("description_dcc", t.description_dcc()), o.append("email_notification_dcc", t.email_notification_dcc()), $.ajax({
                url: "/api/mdtask/jobs/dcc",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#dcc_input").show(), $("#loading_dcc").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#dcc_input").show(), $("#loading_dcc").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    })
}
ko.applyBindings(impi, document.getElementById("cp"));
var changeTrajectoryDiv_dcc = function(e) {
    "upload" == e ? ($("#upload_trajectory_dcc").addClass("panel-info"), $("#url_trajectory_dcc").removeClass("panel-info"), $("#select_trajectory_dcc").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_dcc").removeClass("panel-info"), $("#url_trajectory_dcc").addClass("panel-info"), $("#select_trajectory_dcc").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_dcc").removeClass("panel-info"), $("#url_trajectory_dcc").removeClass("panel-info"), $("#select_trajectory_dcc").addClass("panel-info"))
};
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;

function IMPiViewModel() {
    var r = this;

    function t(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    r.jobname = ko.observable("Job 1"), r.description_dbcl = ko.observable(""), r.reference = ko.observable(), r.alternatives = ko.observable(), r.normalize = ko.observable("none"), r.measurement_dbcl = ko.observable("bc"), r.email_notification_dbcl = ko.observable("no"), r.start_job_dbcl = function() {
        if (site.User()) try {
            $("#deltabcl_input").hide(), $("#loading_dbcl").show();
            var e = $("form#dbcl-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#deltabcl_input").show(), void $("#loading_dbcl").hide();
            o.append("reference", ko.toJSON(r.reference())), o.append("alternatives", ko.toJSON(r.alternatives())), "none" != r.normalize() && o.append("normalize", r.normalize()), o.append("measurement_dbcl", r.measurement_dbcl()), o.append("description_dbcl", r.description_dbcl()), o.append("email_notification_dbcl", r.email_notification_dbcl()), $.ajax({
                url: "/api/mdtask/jobs/deltabcl",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#deltabcl_input").show(), $("#loading_dbcl").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#deltabcl_input").show(), $("#loading_dbcl").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }
}

function clearAutoModel() {
    autoModelViewModel.clearAutoModel()
}
ko.applyBindings(impi, document.getElementById("dcc"));
impi = new IMPiViewModel;

function IMPiViewModel() {
    var r = this;

    function t(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    r.jobname = ko.observable("Job 1"), r.description_heatm = ko.observable(""), r.ref_heatm = ko.observable(), r.ref_std_heatm = ko.observable(), r.alt_heatm = ko.observable(), r.alt_std_heatm = ko.observable(), r.email_notification_heatm = ko.observable("no"), r.start_job_heatm = function() {
        if (site.User()) try {
            $("#heatm_input").hide(), $("#loading_heatm").show();
            var e = $("form#heatm-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#heatm_input").show(), void $("#loading_heatm").hide();
            o.append("ref_heatm", ko.toJSON(r.ref_heatm())), o.append("ref_std_heatm", ko.toJSON(r.ref_std_heatm())), o.append("alt_heatm", ko.toJSON(r.alt_heatm())), o.append("alt_std_heatm", ko.toJSON(r.alt_std_heatm())), o.append("description_heatm", r.description_heatm()), o.append("email_notification_heatm", r.email_notification_heatm()), $.ajax({
                url: "/api/mdtask/jobs/heatm",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#heatm_input").show(), $("#loading_heatm").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#heatm_input").show(), $("#loading_heatm").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }
}

function clearAutoModel() {
    autoModelViewModel.clearAutoModel()
}
ko.applyBindings(impi, document.getElementById("deltabcl"));
impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function r(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description_intpca = ko.observable(""), t.topology_intpca = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.trajectory_intpca = ko.observable(), t.email_notification_intpca = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job_intpca = function() {
        if (site.User()) try {
            $("#intpca_input").hide(), $("#loading_intpca").show();
            var e = $("form#intpca-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#intpca_input").show(), void $("#loading_intpca").hide();
            o.append("topology_intpca", ko.toJSON(t.topology_intpca())), "select" == t.trajectory_option() ? o.append("trajectory_intpca", t.selectedOption()) : o.append("trajectory_intpca", ko.toJSON(t.trajectory_intpca())), o.append("description_intpca", t.description_intpca()), o.append("email_notification_intpca", t.email_notification_intpca()), $.ajax({
                url: "/api/mdtask/jobs/intpca",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#intpca_input").show(), $("#loading_intpca").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#intpca_input").show(), $("#loading_intpca").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_intpca = function() {
        if (site.User()) try {
            $("#intpca_input").hide(), $("#loading_intpca").show();
            var e = $("form#intpca-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#intpca_input").show(), void $("#loading_intpca").hide();
            o.append("topology_intpca", "sample_job"), o.append("description_intpca", t.description_intpca()), o.append("email_notification_intpca", t.email_notification_intpca()), $.ajax({
                url: "/api/mdtask/jobs/intpca",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#intpca_input").show(), $("#loading_intpca").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#intpca_input").show(), $("#loading_intpca").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    })
}
ko.applyBindings(impi, document.getElementById("heatmap"));
var changeTrajectoryDiv_intpca = function(e) {
    "upload" == e ? ($("#upload_trajectory_intpca").addClass("panel-info"), $("#url_trajectory_intpca").removeClass("panel-info"), $("#select_trajectory_intpca").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_intpca").removeClass("panel-info"), $("#url_trajectory_intpca").addClass("panel-info"), $("#select_trajectory_intpca").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_intpca").removeClass("panel-info"), $("#url_trajectory_intpca").removeClass("panel-info"), $("#select_trajectory_intpca").addClass("panel-info"))
};
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function r(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description_mds = ko.observable(""), t.topology_mds = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.trajectory_mds = ko.observable(), t.email_notification_mds = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job_mds = function() {
        if (site.User()) try {
            $("#mds_input").hide(), $("#loading_mds").show();
            var e = $("form#mds-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#mds_input").show(), void $("#loading_mds").hide();
            o.append("topology_mds", ko.toJSON(t.topology_mds())), "select" == t.trajectory_option() ? o.append("trajectory_mds", t.selectedOption()) : o.append("trajectory_mds", ko.toJSON(t.trajectory_mds())), o.append("description_mds", t.description_mds()), o.append("email_notification_mds", t.email_notification_mds()), $.ajax({
                url: "/api/mdtask/jobs/mds",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#mds_input").show(), $("#loading_mds").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#mds_input").show(), $("#loading_mds").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_mds = function() {
        if (site.User()) try {
            $("#mds_input").hide(), $("#loading_mds").show();
            var e = $("form#mds-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#mds_input").show(), void $("#loading_mds").hide();
            o.append("topology_mds", "sample_job"), o.append("description_mds", t.description_mds()), o.append("email_notification_mds", t.email_notification_mds()), $.ajax({
                url: "/api/mdtask/jobs/mds",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#mds_input").show(), $("#loading_mds").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#mds_input").show(), $("#loading_mds").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    })
}
ko.applyBindings(impi, document.getElementById("intpca"));
var changeTrajectoryDiv_mds = function(e) {
    "upload" == e ? ($("#upload_trajectory_mds").addClass("panel-info"), $("#url_trajectory_mds").removeClass("panel-info"), $("#select_trajectory_mds").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_mds").removeClass("panel-info"), $("#url_trajectory_mds").addClass("panel-info"), $("#select_trajectory_mds").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_mds").removeClass("panel-info"), $("#url_trajectory_mds").removeClass("panel-info"), $("#select_trajectory_mds").addClass("panel-info"))
};
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;

function IMPiViewModel() {
    var r = this;

    function t(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    r.jobname = ko.observable("Job 1"), r.description_nmaa = ko.observable(""), r.cg_pdb_nmaa = ko.observable(), r.wmatrix_nmaa = ko.observable(), r.vtmatrix_nmaa = ko.observable(), r.conf_pdb_nmaa = ko.observable(), r.atom_nmaa = ko.observable("cb"), r.mode_number_nmaa = ko.observable("7"), r.email_notification_nmaa = ko.observable("no"), r.start_job_nmaa = function() {
        if (site.User()) try {
            $("#nmaa_input").hide(), $("#loading_nmaa").show();
            var e = $("form#nmaa-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#nmaa_input").show(), void $("#loading_nmaa").hide();
            o.append("cg_pdb_nmaa", ko.toJSON(r.cg_pdb_nmaa())), o.append("wmatrix_nmaa", ko.toJSON(r.wmatrix_nmaa())), o.append("vtmatrix_nmaa", ko.toJSON(r.vtmatrix_nmaa())), o.append("conf_pdb_nmaa", ko.toJSON(r.conf_pdb_nmaa())), o.append("atom_nmaa", r.atom_nmaa()), o.append("mode_number_nmaa", r.mode_number_nmaa()), o.append("description_nmaa", r.description_nmaa()), o.append("email_notification_nmaa", r.email_notification_nmaa()), $.ajax({
                url: "/api/mdtask/jobs/nmaa",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#nmaa_input").show(), $("#loading_nmaa").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#nmaa_input").show(), $("#loading_nmaa").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }
}

function clearAutoModel() {
    autoModelViewModel.clearAutoModel()
}
ko.applyBindings(impi, document.getElementById("mds"));
impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function r(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description_pca = ko.observable(""), t.topology_pca = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.trajectory_pca = ko.observable(), t.email_notification_pca = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job_pca = function() {
        if (site.User()) try {
            $("#pca_input").hide(), $("#loading_pca").show();
            var e = $("form#pca-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#pca_input").show(), void $("#loading_pca").hide();
            o.append("topology_pca", ko.toJSON(t.topology_pca())), "select" == t.trajectory_option() ? o.append("trajectory_pca", t.selectedOption()) : o.append("trajectory_pca", ko.toJSON(t.trajectory_pca())), o.append("description_pca", t.description_pca()), o.append("email_notification_pca", t.email_notification_pca()), $.ajax({
                url: "/api/mdtask/jobs/pca",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#pca_input").show(), $("#loading_pca").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#pca_input").show(), $("#loading_pca").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_pca = function() {
        if (site.User()) try {
            $("#pca_input").hide(), $("#loading_pca").show();
            var e = $("form#pca-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#pca_input").show(), void $("#loading_pca").hide();
            o.append("topology_pca", "sample_job"), o.append("description_pca", t.description_pca()), o.append("email_notification_pca", t.email_notification_pca()), $.ajax({
                url: "/api/mdtask/jobs/pca",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#pca_input").show(), $("#loading_pca").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#pca_input").show(), $("#loading_pca").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    })
}
ko.applyBindings(impi, document.getElementById("nmaa"));
var changeTrajectoryDiv_pca = function(e) {
    "upload" == e ? ($("#upload_trajectory_pca").addClass("panel-info"), $("#url_trajectory_pca").removeClass("panel-info"), $("#select_trajectory_pca").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_pca").removeClass("panel-info"), $("#url_trajectory_pca").addClass("panel-info"), $("#select_trajectory_pca").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_pca").removeClass("panel-info"), $("#url_trajectory_pca").removeClass("panel-info"), $("#select_trajectory_pca").addClass("panel-info"))
};
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function r(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description_prs = ko.observable(""), t.initial_prs = ko.observable(), t.final_prs = ko.observable(), t.topology_prs = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.trajectory_prs = ko.observable(), t.step_prs = ko.observable("100"), t.perturb_prs = ko.observable("100"), t.email_notification_prs = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job_prs = function() {
        if (site.User()) try {
            $("#prs_input").hide(), $("#loading_prs").show();
            var e = $("form#prs-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#prs_input").show(), void $("#loading_prs").hide();
            o.append("initial_prs", ko.toJSON(t.initial_prs())), o.append("final_prs", ko.toJSON(t.final_prs())), o.append("topology_prs", ko.toJSON(t.topology_prs())), "select" == t.trajectory_option() ? o.append("trajectory_prs", t.selectedOption()) : o.append("trajectory_prs", ko.toJSON(t.trajectory_prs())), o.append("step_prs", t.step_prs()), o.append("perturb_prs", t.perturb_prs()), o.append("description_prs", t.description_prs()), o.append("email_notification_prs", t.email_notification_prs()), $.ajax({
                url: "/api/mdtask/jobs/prs",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#prs_input").show(), $("#loading_prs").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#prs_input").show(), $("#loading_prs").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_prs = function() {
        if (site.User()) try {
            $("#prs_input").hide(), $("#loading_prs").show();
            var e = $("form#prs-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#prs_input").show(), void $("#loading_prs").hide();
            o.append("topology_prs", "sample_job"), o.append("step_prs", t.step_prs()), o.append("perturb_prs", t.perturb_prs()), o.append("description_prs", t.description_prs()), o.append("email_notification_prs", t.email_notification_prs()), $.ajax({
                url: "/api/mdtask/jobs/prs",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#prs_input").show(), $("#loading_prs").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#prs_input").show(), $("#loading_prs").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    })
}
ko.applyBindings(impi, document.getElementById("pca"));
var changeTrajectoryDiv_prs = function(e) {
    "upload" == e ? ($("#upload_trajectory_prs").addClass("panel-info"), $("#url_trajectory_prs").removeClass("panel-info"), $("#select_trajectory_prs").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_prs").removeClass("panel-info"), $("#url_trajectory_prs").addClass("panel-info"), $("#select_trajectory_prs").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_prs").removeClass("panel-info"), $("#url_trajectory_prs").removeClass("panel-info"), $("#select_trajectory_prs").addClass("panel-info"))
};
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;

function IMPiViewModel() {
    var r = this;

    function t(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }

    function a(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    r.jobname = ko.observable("Job 1"), r.description_rch = ko.observable(""), r.network_rch = ko.observable(), r.email_notification_rch = ko.observable("no"), r.start_job_rch = function() {
        if (site.User()) try {
            $("#rch_input").hide(), $("#loading_rch").show();
            var e = $("form#rch-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#rch_input").show(), void $("#loading_rch").hide();
            if (!a(r.network_rch()) || null == r.network_rch()) return $("#error_heading").html("Input Error"), $("#error_content").text("Please provide at least one network file"), $("#errorModal").modal("show"), $("#rch_input").show(), void $("#loading_rch").hide();
            o.append("network_rch", ko.toJSON(r.network_rch())), o.append("description_rch", r.description_rch()), o.append("email_notification_rch", r.email_notification_rch()), $.ajax({
                url: "/api/mdtask/jobs/rch",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#rch_input").show(), $("#loading_rch").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#rch_input").show(), $("#loading_rch").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }
}

function clearAutoModel() {
    autoModelViewModel.clearAutoModel()
}
ko.applyBindings(impi, document.getElementById("prs"));
impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function r(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }

    function a(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }

    function n(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }

    function i(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description_rcm = ko.observable(""), t.topology_rcm = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.traj_url_rcm = ko.observable(), t.trajectory_rcm = ko.observable(), t.residue_rcm = ko.observable(), t.chain_rcm = ko.observable("A"), t.email_notification_rcm = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job_rcm = function() {
        if (site.User()) try {
            $("#rcm_input").hide(), $("#loading_rcm").show();
            var e = $("form#rcm-form");
            "yes" == t.email_notification_rcm() && !0;
            var o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#rcm_input").show(), void $("#loading_rcm").hide();
            if (!a(t.topology_rcm())) return $("#error_heading").html("Input Error"), $("#error_content").text("Please provide a topology"), $("#errorModal").modal("show"), $("#rcm_input").show(), void $("#loading_rcm").hide();
            if (!n(t.trajectory_rcm())) return $("#error_heading").html("Input Error"), $("#error_content").text("Please provide a trajectory"), $("#errorModal").modal("show"), $("#rcm_input").show(), void $("#loading_rcm").hide();
            if (!i(t.residue_rcm()) || null == t.residue_rcm()) return $("#error_heading").html("Input Error"), $("#error_content").text("Residue is required"), $("#errorModal").modal("show"), $("#rcm_input").show(), void $("#loading_rcm").hide();
            o.append("topology_rcm", ko.toJSON(t.topology_rcm())), "upload" == t.trajectory_option() ? o.append("trajectory_rcm", ko.toJSON(t.trajectory_rcm())) : "url" == t.trajectory_option() ? o.append("trajectory_rcm", t.traj_url_rcm()) : o.append("trajectory_rcm", t.selectedOption()), o.append("residue_rcm", t.residue_rcm()), o.append("chain_rcm", t.chain_rcm()), o.append("description_rcm", t.description_rcm()), o.append("email_notification_rcm", t.email_notification_rcm()), $.ajax({
                url: "/api/mdtask/jobs/rcm",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#rcm_input").show(), $("#loading_rcm").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#rcm_input").show(), $("#loading_rcm").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_rcm = function() {
        if (site.User()) try {
            $("#rcm_input").hide(), $("#loading_rcm").show();
            var e = $("form#rcm-form");
            "yes" == t.email_notification_rcm() && !0;
            var o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#rcm_input").show(), void $("#loading_rcm").hide();
            o.append("topology_rcm", "sample_job"), o.append("chain_rcm", t.chain_rcm()), o.append("description_rcm", t.description_rcm()), o.append("email_notification_rcm", t.email_notification_rcm()), $.ajax({
                url: "/api/mdtask/jobs/rcm",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#rcm_input").show(), $("#loading_rcm").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#rcm_input").show(), $("#loading_rcm").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    })
}
ko.applyBindings(impi, document.getElementById("rch"));
var changeTrajectoryDiv = function(e) {
    "upload" == e ? ($("#upload_trajectory_rcm").addClass("panel-info"), $("#url_trajectory_rcm").removeClass("panel-info"), $("#select_trajectory_rcm").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_rcm").removeClass("panel-info"), $("#url_trajectory_rcm").addClass("panel-info"), $("#select_trajectory_rcm").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_rcm").removeClass("panel-info"), $("#url_trajectory_rcm").removeClass("panel-info"), $("#select_trajectory_rcm").addClass("panel-info"))
};

function clearAutoModel() {
    autoModelViewModel.clearAutoModel()
}
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;

function IMPiViewModel() {
    var r = this;

    function t(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    r.jobname = ko.observable("Job 1"), r.description_traj = ko.observable(""), r.ref_traj = ko.observable(), r.alt_traj = ko.observable(), r.email_notification_traj = ko.observable("no"), r.start_job_traj = function() {
        if (site.User()) try {
            $("#traj_input").hide(), $("#loading_traj").show();
            var e = $("form#traj-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", r.jobname()), !t(r.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#traj_input").show(), void $("#loading_traj").hide();
            o.append("ref_traj", ko.toJSON(r.ref_traj())), o.append("alt_traj", ko.toJSON(r.alt_traj())), o.append("description_traj", r.description_traj()), o.append("email_notification_traj", r.email_notification_traj()), $.ajax({
                url: "/api/mdtask/jobs/trajectory",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#traj_input").show(), $("#loading_traj").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#traj_input").show(), $("#loading_traj").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            r.model()
        }
    }
}
ko.applyBindings(impi, document.getElementById("rcm"));
impi = new IMPiViewModel;

function IMPiViewModel() {
    var t = this;

    function r(e) {
        return /^[a-z0-9 _.-]+$/i.test(e)
    }
    t.jobname = ko.observable("Job 1"), t.description_tsne = ko.observable(""), t.topology_tsne = ko.observable(), t.trajectory_option = ko.observable("upload"), t.trajectories = ko.observableArray([]), t.trajectory_tsne = ko.observable(), t.email_notification_tsne = ko.observable("no"), t.selectedOption = ko.observable(), t.selectedText = ko.computed(function() {
        return t.selectedOption()
    }), t.disable_upload = ko.observable(!1), t.disable_url = ko.observable(!0), t.disable_select = ko.observable(!0), t.start_job_tsne = function() {
        if (site.User()) try {
            $("#tsne_input").hide(), $("#loading_tsne").show();
            var e = $("form#tsne-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#tsne_input").show(), void $("#loading_tsne").hide();
            o.append("topology_tsne", ko.toJSON(t.topology_tsne())), "select" == t.trajectory_option() ? o.append("trajectory_tsne", t.selectedOption()) : o.append("trajectory_tsne", ko.toJSON(t.trajectory_tsne())), o.append("description_tsne", t.description_tsne()), o.append("email_notification_tsne", t.email_notification_tsne()), $.ajax({
                url: "/api/mdtask/jobs/tsne",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#tsne_input").show(), $("#loading_tsne").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#tsne_input").show(), $("#loading_tsne").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.start_example_tsne = function() {
        if (site.User()) try {
            $("#tsne_input").hide(), $("#loading_tsne").show();
            var e = $("form#tsne-form"),
                o = new FormData(e[0]);
            if (o.append("jobname", t.jobname()), !r(t.jobname())) return $("#error_heading").html("Input Error"), $("#error_content").text("Job name contains incorrect characters"), $("#errorModal").modal("show"), $("#tsne_input").show(), void $("#loading_tsne").hide();
            o.append("topology_tsne", "sample_job"), o.append("description_tsne", t.description_tsne()), o.append("email_notification_tsne", t.email_notification_tsne()), $.ajax({
                url: "/api/mdtask/jobs/tsne",
                type: "POST",
                data: o,
                success: function(e) {
                    job.getJobs(), window.location = "/#jobs/" + e
                },
                error: function(e) {
                    $("#error_heading").html("Error running MD-TASK"), 400 == e.status ? $("#error_content").text(e.responseText) : $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again."), $("#errorModal").modal("show"), $("#tsne_input").show(), $("#loading_tsne").hide()
                },
                cache: !1,
                contentType: !1,
                processData: !1
            })
        } catch (e) {
            $("#error_heading").html("Error running MD-TASK"), $("#error_content").text(e), $("#errorModal").modal("show"), $("#tsne_input").show(), $("#loading_tsne").hide()
        } else $("#helpModal").modal("show"), auth_callback = function() {
            t.model()
        }
    }, t.trajectory_option.subscribe(function() {
        "upload" == t.trajectory_option() ? (t.disable_upload(!1), t.disable_url(!0), t.disable_select(!0)) : "url" == t.trajectory_option() ? (t.disable_upload(!0), t.disable_url(!1), t.disable_select(!0)) : ($.ajax({
            url: "/api/datastore/trajectories/",
            type: "POST",
            success: function(e) {
                var r = [];
                $.each(e, function(e, o) {
                    r.push(o)
                }), t.trajectories(r)
            },
            error: function(e) {
                $("#error_heading").html("Error loading trajectories")
            },
            cache: !1,
            contentType: !1,
            processData: !1
        }), t.disable_upload(!0), t.disable_url(!0), t.disable_select(!1))
    })
}
ko.applyBindings(impi, document.getElementById("trajectory"));
var changeTrajectoryDiv_tsne = function(e) {
    "upload" == e ? ($("#upload_trajectory_tsne").addClass("panel-info"), $("#url_trajectory_tsne").removeClass("panel-info"), $("#select_trajectory_tsne").removeClass("panel-info")) : "url" == e ? ($("#upload_trajectory_tsne").removeClass("panel-info"), $("#url_trajectory_tsne").addClass("panel-info"), $("#select_trajectory_tsne").removeClass("panel-info")) : "select" == e && ($("#upload_trajectory_tsne").removeClass("panel-info"), $("#url_trajectory_tsne").removeClass("panel-info"), $("#select_trajectory_tsne").addClass("panel-info"))
};
$(".selectable_div").click(function() {
    $(this).find("input:radio")[0].click()
});
impi = new IMPiViewModel;
ko.applyBindings(impi, document.getElementById("tsne"));