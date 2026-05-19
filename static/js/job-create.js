document.addEventListener('DOMContentLoaded', () => {
        const jobForm = document.querySelector('.auth-form');
        const errorMessage = document.getElementById('jobError');

        function displayTemporaryError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
            setTimeout(() => {
                errorMessage.style.display = 'none';
                errorMessage.textContent = '';
            }, 5000);
        }

        jobForm.addEventListener('submit', (e) => {

            const formData = new FormData(jobForm);
            fetch('{% url "jobs:job_create" %}', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    displayTemporaryError(data.error);
                } 
            })
            .catch(error => {
                console.error('Error creating job:', error);
                displayTemporaryError('An error occurred. Please try again.');
            });
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
