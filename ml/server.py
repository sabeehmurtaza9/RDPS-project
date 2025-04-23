from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from scripts.model_predict import predict as predict_fn

load_dotenv()

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return "Server is running. Use /predict endpoint to make predictions."

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        ret = predict_fn(data)
        return jsonify(ret)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(port=port)
