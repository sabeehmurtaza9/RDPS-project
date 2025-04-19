import pandas as pd
import joblib
import json
from sklearn.preprocessing import StandardScaler

# Load the saved model and scaler
model = joblib.load('ransomware_detection_model.joblib')
scaler = joblib.load('scaler.joblib')

# Load original dataset for reference
original_data = pd.read_csv("ransomware-dataset.csv", delimiter='|')
original_features = original_data.drop(['Name', 'md5', 'legitimate'], axis=1, errors='ignore').columns

# Sample data for prediction
sample_data = pd.DataFrame([{
    "Machine": 332,
    "SizeOfOptionalHeader": 224,
    "Characteristics": 271,
    "MajorLinkerVersion": 2,
    "MinorLinkerVersion": 25,
    "SizeOfCode": 4096,
    "SizeOfInitializedData": 8192,
    "SizeOfUninitializedData": 0,
    "AddressOfEntryPoint": 4096,
    "BaseOfCode": 4096,
    "BaseOfData": 8192,
    "ImageBase": 4194304,
    "SectionAlignment": 4096,
    "FileAlignment": 512
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
