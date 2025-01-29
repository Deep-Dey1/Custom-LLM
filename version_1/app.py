from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from PIL import Image
import io

app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key="YOUR GEMINI'S API KEY")
model = genai.GenerativeModel('gemini-1.5-flash')  # For image + text prompts

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get user input
        prompt = request.form.get('prompt')
        image = request.files.get('image')

        # If an image is uploaded, process it with Gemini
        if image:
            # Convert the image file to a PIL Image
            image_data = image.read()
            pil_image = Image.open(io.BytesIO(image_data))

            # Generate content using the Gemini API
            response = model.generate_content([prompt, pil_image])
        else:
            # If no image, use text-only model
            text_model = genai.GenerativeModel('gemini-pro')
            response = text_model.generate_content(prompt)

        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)