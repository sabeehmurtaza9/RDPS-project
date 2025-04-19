import pandas as pd

# Load the dataset
df = pd.read_csv('./datasets/ransomware-dataset_csv.csv')

# Step 1: Drop specified columns
columns_to_drop = ['MajorLinkerVersion', 'MinorLinkerVersion']
df = df.drop(columns=columns_to_drop, errors='ignore')

# Step 2: Clean dataset (handle missing values)
df = df.dropna()  # Remove rows with missing values

# Step 3: Remove invalid values
# Ensure the target column 'legitimate' only contains 0 or 1
df = df[df['legitimate'].isin([0, 1])]

# Remove invalid numeric values (non-negative constraints for relevant columns)
numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
for col in numeric_cols:
    if df[col].min() < 0:  # Check if column should be non-negative
        df = df[df[col] >= 0]  # Remove rows with negative values

# Step 4: Remove duplicate data
# Remove rows where all features except 'Name' and 'md5' are identical
df = df.drop_duplicates(subset=df.columns.difference(['Name', 'md5']))

# Optionally: Remove full duplicates (including 'Name' and 'md5')
df = df.drop_duplicates()

# Save cleaned dataset (optional)
df.to_csv('./datasets/cleaned_ransomware_dataset.csv', index=False)