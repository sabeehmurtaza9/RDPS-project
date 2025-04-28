import pandas as pd
import joblib
import os

model_path = os.path.join(os.path.dirname(__file__), "../models/RandomForestModel.joblib")
scaler_path = os.path.join(os.path.dirname(__file__), "../models/scaler.joblib")
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/cleaned.csv")
original_data = pd.read_csv(dataset_path)
original_features = original_data.drop(['legitimate'], axis=1, errors='ignore').columns

sample_data = pd.DataFrame([{
  "SectionsMeanEntropy": 4.741730951606168,
  "SectionsMinEntropy": 1.3437433003808203,
  "SectionsMaxEntropy": 6.553433967169684,
  "ResourcesMeanEntropy": 4.988699797237637,
  "ResourcesMinEntropy": 2.713837730226897,
  "ResourcesMaxEntropy": 6.473885332454082,
}])

sample_data_scaled = pd.DataFrame(scaler.transform(sample_data), columns=sample_data.columns)

prediction = model.predict(sample_data_scaled)
print("Prediction:", "Malicious" if prediction[0] == 1 else "Legitimate")
