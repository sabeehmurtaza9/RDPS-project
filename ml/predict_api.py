from flask import Flask, request, jsonify
import pandas as pd
import joblib
from sklearn.impute import SimpleImputer

app = Flask(__name__)

# Load the trained model and scaler
model = joblib.load('ransomware_detection_model.joblib')
scaler = joblib.load('scaler.joblib')

# The feature names used during training
required_columns = [
    'Machine', 'SizeOfOptionalHeader', 'Characteristics', 'MajorLinkerVersion', 
    'MinorLinkerVersion', 'SizeOfCode', 'SizeOfInitializedData', 'SizeOfUninitializedData',
    'AddressOfEntryPoint', 'BaseOfCode', 'BaseOfData', 'ImageBase', 'SectionAlignment',
    'FileAlignment', 'MajorOperatingSystemVersion', 'MinorOperatingSystemVersion', 
    'MajorImageVersion', 'MinorImageVersion', 'MajorSubsystemVersion', 'MinorSubsystemVersion',
    'SizeOfImage', 'SizeOfHeaders', 'CheckSum', 'Subsystem', 'DllCharacteristics',
    'SizeOfStackReserve', 'SizeOfStackCommit', 'SizeOfHeapReserve', 'SizeOfHeapCommit',
    'LoaderFlags', 'NumberOfRvaAndSizes', 'SectionsNb', 'SectionsMeanEntropy', 
    'SectionsMinEntropy', 'SectionsMaxEntropy', 'SectionsMeanRawsize', 'SectionsMinRawsize',
    'SectionMaxRawsize', 'SectionsMeanVirtualsize', 'SectionsMinVirtualsize', 
    'SectionMaxVirtualsize', 'ImportsNbDLL', 'ImportsNb', 'ImportsNbOrdinal', 'ExportNb',
    'ResourcesNb', 'ResourcesMeanEntropy', 'ResourcesMinEntropy', 'ResourcesMaxEntropy',
    'ResourcesMeanSize', 'ResourcesMinSize', 'ResourcesMaxSize', 'LoadConfigurationSize',
    'VersionInformationSize'
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Extract JSON data from the request
        data = request.get_json()

        # Ensure that the input data matches the required columns (remove 'legitimate' column)
        input_data = {column: data.get(column) for column in required_columns if column != 'legitimate'}
        
        df = pd.DataFrame([input_data])

        # Check if any columns are missing
        missing_cols = set(required_columns) - set(df.columns)
        
        # If there are missing columns, add them with NaN values
        for col in missing_cols:
            df[col] = None

        # Impute missing values with the column mean
        imputer = SimpleImputer(strategy='mean')
        df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

        # Scale the data
        data_scaled = scaler.transform(df_imputed)

        # Make the prediction
        prediction = model.predict(data_scaled)[0]

        # Return the result as "Malicious" or "Legitimate"
        result = "Malicious" if prediction == 1 else "Legitimate"
        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=5000)
