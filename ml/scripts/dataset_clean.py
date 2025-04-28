import pandas as pd
import os

columns = [
    "SectionsMeanEntropy",
    "SectionsMinEntropy",
    "SectionsMaxEntropy",
    "ResourcesMeanEntropy",
    "ResourcesMinEntropy",
    "ResourcesMaxEntropy",
    "legitimate",
]

dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/ransomware.csv")
df = pd.read_csv(dataset_path, usecols=columns)

df.columns = df.columns.str.strip()
df = df.dropna()
df = df[df['legitimate'].isin([0, 1])]

numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
for col in numeric_cols:
    if df[col].min() < 0:
        df = df[df[col] >= 0]

output_cleaned_dir = os.path.join(os.path.dirname(__file__), "../datasets/cleaned.csv")
df.to_csv(output_cleaned_dir, index=False)