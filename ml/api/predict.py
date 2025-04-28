import os
import joblib
import pandas as pd

model_path = os.path.join(os.path.dirname(__file__), "../models/RandomForestModel.joblib")
scaler_path = os.path.join(os.path.dirname(__file__), "../models/scaler.joblib")
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

required_columns = [
    "SectionsMeanEntropy",
    "SectionsMinEntropy",
    "SectionsMaxEntropy",
    "ResourcesMeanEntropy",
    "ResourcesMinEntropy",
    "ResourcesMaxEntropy"
]

def predict_from_model (data):
    ret = dict()
    try:
        missing = [col for col in required_columns if col not in data]
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(missing)}")
        
        df = pd.DataFrame([data], columns=required_columns)

        data_scaled = pd.DataFrame(scaler.transform(df), columns=df.columns)
        prediction = model.predict(data_scaled)[0]
        proba = model.predict_proba(data_scaled)[0]

        ret['success'] = True
        ret['data'] = {
            "malicious": True if prediction == 1 else False,
            "confidence": proba[prediction],
        }
    except Exception as e:
        ret['success'] = False
        ret['error'] = str(e)
    return ret