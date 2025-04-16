"use strict";
var KTAppCalendar = function() {
    var e, t, n, a, o, r, i, l, u, v, f, p, y, D, k, _, g, S, h, T, Y, w, L, E, M = {
        id: "",
        eventName: "",
        startDate: "",
        endDate: ""
    };
    const API_URL = BACKEND_API_URL; // Ensure this matches the backend route

    const handleAjaxError = (jqXHR) => {
        if (jqXHR.status === 401 && jqXHR.responseJSON?.redirect) {
            Swal.fire({
                text: jqXHR.responseJSON?.msg || "An error occurred. Please try again.",
                icon: "error",
                confirmButtonText: "Ok, got it!"
            }).then(() => {
                window.location.href = jqXHR.responseJSON.redirect; // Redirect to sign-in page
            });
        } else {
            Swal.fire({
                text: jqXHR.responseJSON?.msg || "An error occurred. Please try again.",
                icon: "error",
                confirmButtonText: "Ok, got it!"
            });
        }
    };

    const fetchEvents = () => {
        $.ajax({
            url: API_URL,
            method: "GET",
            xhrFields: { withCredentials: true }, // Include credentials for authentication
            success: function(data) {
                e.removeAllEvents(); // Clear existing events
                data.forEach(event => {
                    e.addEvent({
                        id: event.id,
                        title: event.title,
                        start: event.start,
                        end: event.end
                    });
                });
                // Add class "d-none" to elements with the class "fc-event-time" containing "7a"
                document.querySelectorAll(".fc-event-time").forEach(element => {
                    element.classList.add("d-none");
                });
            },
            error: handleAjaxError
        });
    };

    const saveEvent = (eventData) => {
        $.ajax({
            url: API_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(eventData),
            xhrFields: { withCredentials: true }, // Include credentials for authentication
            success: function() {
                fetchEvents(); // Refresh events
                Swal.fire({
                    text: "Event added successfully!",
                    icon: "success",
                    confirmButtonText: "Ok, got it!"
                });
            },
            error: handleAjaxError
        });
    };

    const updateEvent = (eventData) => {
        $.ajax({
            url: `${API_URL}/${eventData.id}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(eventData),
            xhrFields: { withCredentials: true }, // Include credentials for authentication
            success: function() {
                fetchEvents(); // Refresh events
                Swal.fire({
                    text: "Event updated successfully!",
                    icon: "success",
                    confirmButtonText: "Ok, got it!"
                });
            },
            error: handleAjaxError
        });
    };

    const deleteEvent = (eventId) => {
        $.ajax({
            url: `${API_URL}/${eventId}`,
            method: "DELETE",
            xhrFields: { withCredentials: true }, // Include credentials for authentication
            success: function() {
                fetchEvents(); // Refresh events
                Swal.fire({
                    text: "Event deleted successfully!",
                    icon: "success",
                    confirmButtonText: "Ok, got it!"
                });
            },
            error: handleAjaxError
        });
    };

    const formatDate = (dateString) => {
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const date = new Date(dateString);
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${monthName} ${year}`;
    };

    const initCalendar = () => {
        const calendarElement = document.getElementById("kt_calendar_app");
        e = new FullCalendar.Calendar(calendarElement, {
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
            },
            initialDate: new Date(),
            navLinks: true,
            selectable: true,
            selectMirror: true,
            select: function(info) {
                // Show modal for adding event
                M.startDate = info.startStr;
                M.endDate = info.endStr;
                showAddEventModal();
            },
            eventClick: function(info) {
                // Show modal for viewing event details
                showEventDetailsModal(info.event);
            },
            editable: true,
            dayMaxEvents: true,
            events: [], // Events will be fetched dynamically
            eventDisplay: "block", // Ensure all events are displayed with a full background
        });
        e.render();
        fetchEvents(); // Load events on initialization

        // Handle "Add Event" button click
        document.querySelector('[data-kt-calendar="add"]').addEventListener("click", () => {
            M.startDate = new Date().toISOString().split("T")[0]; // Default to today's date
            M.endDate = M.startDate; // Default to the same date
            showAddEventModal();
        });
    };

    const showAddEventModal = () => {
        const modal = new bootstrap.Modal(document.getElementById("kt_modal_add_event"));
        const form = document.getElementById("kt_modal_add_event_form");
        form.reset(); // Clear the form
        form.querySelector('[name="calendar_event_start_date"]').value = M.startDate;
        form.querySelector('[name="calendar_event_end_date"]').value = M.endDate;

        // Set modal title to "Add Event"
        document.querySelector('[data-kt-calendar="title"]').innerText = "Add Event";

        // Initialize datepickers
        flatpickr(form.querySelector('[name="calendar_event_start_date"]'), { dateFormat: "Y-m-d" });
        flatpickr(form.querySelector('[name="calendar_event_end_date"]'), { dateFormat: "Y-m-d" });

        // Handle modal close button
        document.getElementById("kt_modal_add_event_close").onclick = function() {
            modal.hide();
        };

        // Handle modal cancel button
        document.getElementById("kt_modal_add_event_cancel").onclick = function() {
            modal.hide();
        };

        document.getElementById("kt_modal_add_event_submit").onclick = function() {
            const title = form.querySelector('[name="calendar_event_name"]').value;
            const startDate = form.querySelector('[name="calendar_event_start_date"]').value;
            const endDate = form.querySelector('[name="calendar_event_end_date"]').value;

            if (!title) {
                Swal.fire({
                    text: "Event name is required.",
                    icon: "warning",
                    confirmButtonText: "Ok, got it!"
                });
                return;
            }

            if (new Date(startDate) > new Date(endDate)) {
                Swal.fire({
                    text: "Start date cannot be after end date.",
                    icon: "warning",
                    confirmButtonText: "Ok, got it!"
                });
                return;
            }

            const eventData = {
                title: title,
                start: startDate,
                end: endDate // Allow same start and end dates
            };
            saveEvent(eventData);
            modal.hide();
        };

        modal.show();
    };

    const showEventDetailsModal = (event) => {
        
        const modal = new bootstrap.Modal(document.getElementById("kt_modal_view_event"));
        document.querySelector('[data-kt-calendar="event_name"]').innerText = event.title;
        document.querySelector('[data-kt-calendar="event_start_date"]').innerText = formatDate(event.start.toISOString());
        document.querySelector('[data-kt-calendar="event_end_date"]').innerText = event.end ? formatDate(event.end.toISOString()) : formatDate(event.start.toISOString());

        // Handle Edit Button
        document.getElementById("kt_modal_view_event_edit").onclick = function() {
            modal.hide();
            showEditEventModal(event);
        };

        // Handle Delete Button
        document.getElementById("kt_modal_view_event_delete").onclick = function() {
            Swal.fire({
                text: "Are you sure you want to delete this event?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteEvent(event.id);
                    modal.hide();
                }
            });
        };
        

        modal.show();
    };

    const showEditEventModal = (event) => {
        const modal = new bootstrap.Modal(document.getElementById("kt_modal_add_event"));
        const form = document.getElementById("kt_modal_add_event_form");
        form.reset(); // Clear the form
        form.querySelector('[name="calendar_event_name"]').value = event.title;
        form.querySelector('[name="calendar_event_start_date"]').value = event.start.toISOString().split("T")[0];
        form.querySelector('[name="calendar_event_end_date"]').value = event.end ? event.end.toISOString().split("T")[0] : "";

        // Update modal title to "Edit Event"
        document.querySelector('[data-kt-calendar="title"]').innerText = "Edit Event";

        // Initialize datepickers
        flatpickr(form.querySelector('[name="calendar_event_start_date"]'), { dateFormat: "Y-m-d" });
        flatpickr(form.querySelector('[name="calendar_event_end_date"]'), { dateFormat: "Y-m-d" });

        // Handle modal close button
        document.getElementById("kt_modal_add_event_close").onclick = function() {
            modal.hide();
        };

        // Handle modal cancel button
        document.getElementById("kt_modal_add_event_cancel").onclick = function() {
            modal.hide();
        };

        document.getElementById("kt_modal_add_event_submit").onclick = function() {
            const title = form.querySelector('[name="calendar_event_name"]').value;
            const startDate = form.querySelector('[name="calendar_event_start_date"]').value;
            const endDate = form.querySelector('[name="calendar_event_end_date"]').value;

            if (!title) {
                Swal.fire({
                    text: "Event name is required.",
                    icon: "warning",
                    confirmButtonText: "Ok, got it!"
                });
                return;
            }

            if (new Date(startDate) > new Date(endDate)) {
                Swal.fire({
                    text: "Start date cannot be after end date.",
                    icon: "warning",
                    confirmButtonText: "Ok, got it!"
                });
                return;
            }

            const eventData = {
                id: event.id,
                title: title,
                start: startDate,
                end: endDate // Allow same start and end dates
            };
            updateEvent(eventData);
            modal.hide();
        };

        modal.show();
    };

    return {
        init: function() {
            initCalendar();
        }
    };
}();
KTUtil.onDOMContentLoaded(function() {
    KTAppCalendar.init();
});