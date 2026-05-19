document.addEventListener('DOMContentLoaded', () => {
    const jobsTableBody = document.querySelector('.jobs-table tbody');

    function loadJobs() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q')?.toLowerCase() || '';
        const experienceFilter = parseInt(urlParams.get('experience')) || null;

        fetch(`/available-jobs/?q=${searchQuery}&experience=${experienceFilter || ''}`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            jobsTableBody.innerHTML = '';
            if (data.jobs.length === 0) {
                jobsTableBody.innerHTML = `
                    <tr>
                        <td colspan="5">No available jobs match your criteria.</td>
                    </tr>
                `;
            } else {
                data.jobs.forEach(job => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-label="Title">${job.title}</td>
                        <td data-label="Company">${job.company}</td>
                        <td data-label="Salary">$${job.salary.toLocaleString()}</td>
                        <td data-label="Experience">${job.experience} years</td>
                        <td data-label="Details">
                            <a href="/job-details/${job.id}/">View</a>
                        </td>
                    `;
                    jobsTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading jobs:', error));
    }

    loadJobs();

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