from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from api.predict import predict_from_model
from api.detect import extract_pe_metadata

load_dotenv()

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return "Server is running. Use /predict endpoint to make predictions."

@app.route('/predict', methods=['POST'])
def predict():
    ret = { "success": False }
    try:
        data = request.get_json()
        ret = predict_from_model(data)
    except Exception as e:
        ret['success'] = False
        ret['error'] = str(e)
    finally:
        return jsonify(ret)

@app.route('/detect', methods=['POST'])
def detect():
    ret = { "success": False }
    try:
        file_path = request.json.get('file_path')
        if not file_path:
            raise ValueError("file_path query parameter is required")
        ret = extract_pe_metadata(file_path)
        print(ret)
    except Exception as e:
        ret['error'] = str(e)
    return jsonify(ret)

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(port=port)
