document.addEventListener('DOMContentLoaded', () => {
    const appliedJobsTableBody = document.querySelector('.jobs-table tbody');

    function loadApplications() {
        fetch('/user-dashboard/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            appliedJobsTableBody.innerHTML = '';
            if (data.applications.length === 0) {
                appliedJobsTableBody.innerHTML = `
                    <tr>
                        <td colspan="4">You have not applied to any jobs yet.</td>
                    </tr>
                `;
            } else {
                data.applications.forEach(app => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-label="Job Title">${app.job.title}</td>
                        <td data-label="Company">${app.job.company}</td>
                        <td data-label="Status">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</td>
                        <td data-label="Details">
                            <a href="/job-details-user/${app.job.id}/">View</a>
                        </td>
                    `;
                    appliedJobsTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading applications:', error));
    }

    loadApplications();

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