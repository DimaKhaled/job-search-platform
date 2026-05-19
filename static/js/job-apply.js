document.addEventListener('DOMContentLoaded', () => {
    const applyForm = document.querySelector('.apply-form');
    const errorMessage = document.getElementById('applyError');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(applyForm);
        fetch(`/job-apply/${jobId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Application submitted successfully!');
                window.location.href = '/user-dashboard/';
            } else {
                displayTemporaryError(data.error);
            }
        })
        .catch(error => {
            console.error('Error applying for job:', error);
            displayTemporaryError('An error occurred. Please try again.');
        });
    });

    function displayTemporaryError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';
        }, 5000);
    }

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