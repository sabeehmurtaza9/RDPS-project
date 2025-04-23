import os
import joblib
from sklearn.impute import SimpleImputer
import pandas as pd

# Load the trained model and scaler
# model_path = os.path.join(os.path.dirname(__file__), "../models/RandomForestModel.joblib")
model_path = os.path.join(os.path.dirname(__file__), "../models/LogisticRegressionModel.joblib")
scaler_path = os.path.join(os.path.dirname(__file__), "../models/scaler.joblib")
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

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
    'SectionMaxVirtualsize'
]

def predict (data):
    ret = dict()
    try:
        missing = [col for col in required_columns if col not in data]
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(missing)}")
        
        df = pd.DataFrame([{col: data[col] for col in required_columns}])
        data_scaled = scaler.transform(df)
        prediction = model.predict(data_scaled)[0]
        proba = model.predict_proba(data_scaled)[0]
        print(f"Legitimate: {proba[0]:.2f}, Malicious: {proba[1]:.2f}")
        ret['success'] = True
        ret['data'] = {
            "malicious": True if prediction == 1 else False,
            "malicious_proba": {
                "malicious": proba[1],
                "legitimate": proba[0]
            },
        }

    except Exception as e:
        ret['success'] = False
        ret['error'] = str(e)
    
    return ret