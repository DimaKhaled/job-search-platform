document.addEventListener('DOMContentLoaded', () => {
    const jobDetailsDiv = document.querySelector('.job-details');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    fetch(`/job-details/${jobId}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.job) {
            jobDetailsDiv.innerHTML = `
                <h2>${data.job.title}</h2>
                <p><strong>Company:</strong> ${data.job.company}</p>
                <p><strong>Salary:</strong> $${data.job.salary.toLocaleString()}</p>
                <p><strong>Experience:</strong> ${data.job.experience} years</p>
                <p><strong>Status:</strong> ${data.job.status.charAt(0).toUpperCase() + data.job.status.slice(1)}</p>
                <p><strong>Description:</strong> ${data.job.description}</p>
            `;
        } else {
            jobDetailsDiv.innerHTML = '<p>Job not found.</p>';
        }
    })
    .catch(error => console.error('Error loading job details:', error));

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