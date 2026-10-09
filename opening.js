document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openBtn');
    const envelopeContainer = document.getElementById('envelopeContainer');

    const handleOpen = () => {
        // Add a class to body for page transition
        document.body.classList.add('fade-out');
        
        // Wait for animation to finish before navigating to the next page
        setTimeout(() => {
            console.log('Ready to navigate to the next page!');
            window.location.href = 'mail.html'; 
        }, 400);
    };

    openBtn.addEventListener('click', handleOpen);
    envelopeContainer.addEventListener('click', handleOpen);
});
