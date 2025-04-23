import pandas as pd
import os
dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/ransomware.csv")
data = pd.read_csv(dataset_path)
print(data.info())
dataset_cleaned_path = os.path.join(os.path.dirname(__file__), "../datasets/cleaned.csv")
data_cleaned = pd.read_csv(dataset_cleaned_path)
print(data_cleaned.info())