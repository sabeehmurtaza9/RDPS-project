import pandas as pd
import joblib
import os
from sklearn.preprocessing import StandardScaler

# Load the saved model and scaler
model_path = os.path.join(os.path.dirname(__file__), "../models/RandomForestModel.joblib")
scaler_path = os.path.join(os.path.dirname(__file__), "../models/scaler.joblib")
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

columns = [
    "SectionsMeanEntropy",
    "SectionsMinEntropy",
    "SectionsMaxEntropy",
    "ResourcesMeanEntropy",
    "ResourcesMinEntropy",
    "ResourcesMaxEntropy",
    "legitimate",
]

# Load original dataset for reference
dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/ransomware.csv")
original_data = pd.read_csv(dataset_path, usecols=columns)
original_features = original_data.drop(['legitimate'], axis=1, errors='ignore').columns

# Sample data for prediction
sample_data = pd.DataFrame([{
  "SectionsMeanEntropy": 4.741730951606168,
  "SectionsMinEntropy": 1.3437433003808203,
  "SectionsMaxEntropy": 6.553433967169684,
  "ResourcesMeanEntropy": 4.988699797237637,
  "ResourcesMinEntropy": 2.713837730226897,
  "ResourcesMaxEntropy": 6.473885332454082,
}])  # Ensure data matches expected structure

# Align columns to match training data
aligned_data = pd.DataFrame(0, index=sample_data.index, columns=original_features)
for col in sample_data.columns:
    if col in aligned_data.columns:
        aligned_data[col] = sample_data[col]

# Scale the aligned data
sample_data_scaled = scaler.transform(aligned_data)

# Predict
prediction = model.predict(sample_data_scaled)
print("Prediction:", "Malicious" if prediction[0] == 1 else "Legitimate")
