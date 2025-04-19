import pandas as pd

# Load the dataset
df = pd.read_csv('./datasets/ransomware-dataset_csv.csv')
original_count = len(df)

# Initialize a DataFrame to track dropped rows and reasons
dropped_rows = pd.DataFrame(columns=['row_index', 'reason'])

# --- Step 1: Drop specified columns ---
columns_to_drop = ['MajorLinkerVersion', 'MinorLinkerVersion']
df = df.drop(columns=columns_to_drop, errors='ignore')

# --- Step 2: Remove rows with missing values ---
missing_mask = df.isnull().any(axis=1)
missing_indices = df[missing_mask].index
dropped_rows = pd.concat([
    dropped_rows,
    pd.DataFrame({'row_index': missing_indices, 'reason': 'Missing values'})
])
df = df.dropna()

# --- Step 3: Remove invalid 'legitimate' values ---
invalid_legit_mask = ~df['legitimate'].isin([0, 1])
invalid_legit_indices = df[invalid_legit_mask].index
dropped_rows = pd.concat([
    dropped_rows,
    pd.DataFrame({'row_index': invalid_legit_indices, 'reason': 'Invalid legitimate value'})
])
df = df[df['legitimate'].isin([0, 1])]

# --- Step 4: Remove rows with negative values in numeric columns ---
numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
negative_masks = {}

for col in numeric_cols:
    if (df[col] < 0).any():  # Check if column has negative values
        negative_mask = df[col] < 0
        negative_indices = df[negative_mask].index
        dropped_rows = pd.concat([
            dropped_rows,
            pd.DataFrame({'row_index': negative_indices, 'reason': f'Negative value in {col}'})
        ])
        negative_masks[col] = negative_mask

# Handle case where no negative masks exist
if negative_masks:
    combined_negative_mask = pd.concat(
        [negative_masks[col] for col in negative_masks], 
        axis=1
    ).any(axis=1)
else:
    combined_negative_mask = pd.Series(False, index=df.index)  # No rows to drop

df = df[~combined_negative_mask]

# --- Step 5: Remove duplicates ---
# Track duplicates (keep="first" marks duplicates except the first occurrence)
duplicate_mask = df.duplicated(subset=df.columns.difference(['Name', 'md5']), keep='first')
duplicate_indices = df[duplicate_mask].index
dropped_rows = pd.concat([
    dropped_rows,
    pd.DataFrame({'row_index': duplicate_indices, 'reason': 'Duplicate row'})
])
df = df.drop_duplicates(subset=df.columns.difference(['Name', 'md5']), keep='first')

# --- Finalize ---
# Remove duplicate entries in dropped_rows (if a row was flagged for multiple reasons)
dropped_rows = dropped_rows.drop_duplicates(subset=['row_index'], keep='first')

# Add original data for inspection
dropped_data = pd.read_csv('./datasets/ransomware-dataset_csv.csv').loc[dropped_rows['row_index']]
dropped_data['drop_reason'] = dropped_rows['reason'].values

print(f"Original rows: {original_count}")
print(f"Remaining rows: {len(df)}")
print(f"Dropped rows: {len(dropped_data)}")
print("\nDropped rows summary:")
print(dropped_data['drop_reason'].value_counts())

# Save cleaned data and dropped rows
df.to_csv('./datasets/cleaned_ransomware_dataset.csv', index=False)
dropped_data.to_csv('./datasets/dropped_rows_with_reasons.csv', index=False)