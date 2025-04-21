import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib
import os

# Resolve the dataset path relative to the current directory
dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/ransomware.csv")
data = pd.read_csv(dataset_path)

# Clean column names (remove leading/trailing spaces)
data.columns = data.columns.str.strip()

# Handle missing values (if any)
data.fillna(0, inplace=True)

# Feature selection
X = data.drop(['Name', 'md5', 'legitimate'], axis=1)  # Features
y = data['legitimate']  # Target label

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the Logistic Regression model
model = LogisticRegression(max_iter=1500, solver='saga')
model.fit(X_train_scaled, y_train)

# Predictions
y_pred = model.predict(X_test_scaled)

# Performance Metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)

# Display results
print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
print(f"F1 Score: {f1:.4f}")
print("\nConfusion Matrix:")
print(conf_matrix)

# Save the trained model and scaler
output_model_dir = os.path.join(os.path.dirname(__file__), "../output/logistic_regression_model.joblib")
output_scaler_dir = os.path.join(os.path.dirname(__file__), "../output/logistic_regression_scaler.joblib")
joblib.dump(model, output_model_dir)
joblib.dump(scaler, output_scaler_dir)

print("\nModel and scaler saved successfully!")
