document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.querySelector('.auth-form');
    const errorMessage = document.getElementById('editError');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(editForm);
        fetch(`/job-edit/${jobId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Job updated successfully!');
                window.location.href = '/admin-dashboard/';
            } else {
                displayTemporaryError(data.error);
            }
        })
        .catch(error => {
            console.error('Error updating job:', error);
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