document.addEventListener("DOMContentLoaded", function () {
        const jobsTableBody = document.querySelector(".jobs-table tbody");
        const deleteModal = document.getElementById("deleteModal");
        const modalJobId = document.getElementById("modalJobId");
        const confirmDeleteButton = document.getElementById("confirmDelete");
        const cancelDeleteButton = document.getElementById("cancelDelete");

        function loadJobs() {
            fetch('/admin-dashboard/', {
                method: 'GET',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                jobsTableBody.innerHTML = '';
                data.jobs.forEach(job => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${job.company}</td>
                        <td>${job.id}</td>
                        <td>${job.title}</td>
                        <td>${job.salary}</td>
                        <td>${job.status}</td>
                        <td>${job.created_by}</td>
                        <td>${new Date(job.created_at).toLocaleDateString()}</td>
                        <td>
                            <a href="/job-edit/${job.id}/" class="edit-job">Edit</a> |
                            <a href="#" class="delete-job" data-id="${job.id}">Delete</a>
                        </td>
                    `;
                    jobsTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading jobs:', error));
        }

        loadJobs(); 

        let jobIdToDelete = null;

        jobsTableBody.addEventListener("click", function (event) {
            if (event.target.classList.contains("delete-job")) {
                event.preventDefault();
                jobIdToDelete = event.target.getAttribute("data-id");
                modalJobId.textContent = jobIdToDelete;
                deleteModal.style.display = "flex";
            }
        });

        confirmDeleteButton.addEventListener("click", function () {
            if (jobIdToDelete) {
                fetch(`/job-delete/${jobIdToDelete}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const rowToDelete = document.querySelector(`.delete-job[data-id="${jobIdToDelete}"]`).closest("tr");
                        if (rowToDelete) {
                            rowToDelete.remove(); 
                        }
                        deleteModal.style.display = "none";
                        jobIdToDelete = null;
                        loadJobs(); 
                    } else {
                        alert('Deletion failed: ' + data.error);
                    }
                })
                .catch(error => console.error('Error deleting job:', error));
            }
            deleteModal.style.display = "none";
            jobIdToDelete = null;
        });

        cancelDeleteButton.addEventListener("click", function () {
            deleteModal.style.display = "none";
            jobIdToDelete = null;
        });

        deleteModal.addEventListener("click", function (event) {
            if (event.target === deleteModal) {
                deleteModal.style.display = "none";
                jobIdToDelete = null;
            }
        });

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    });