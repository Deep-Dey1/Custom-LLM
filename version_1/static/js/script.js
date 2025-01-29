document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const prompt = document.getElementById('prompt').value;
    const image = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('prompt', prompt);
    if (image) {
        formData.append('image', image);
    }

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        // Display the response in the chat box
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML += `<p><strong>You:</strong> ${prompt}</p>`;
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${data.response}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
document.getElementById('image').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100px';
            document.getElementById('chat-box').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});