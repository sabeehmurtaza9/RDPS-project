import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score
import joblib
import os
import time

# Resolve the dataset path relative to the current directory
# dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/cleaned.csv")
dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/ransomware.csv")
data = pd.read_csv(dataset_path)

# Feature selection
X = data.drop(['Name', 'md5', 'legitimate'], axis=1)  # Features
y = data['legitimate']  # Target label

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

models = {
    "Logistic Regression": LogisticRegression(),
    "Random Forest": RandomForestClassifier(),
    "SVM": SVC(probability=True)
}

results = []

for name, model in models.items():
    print(f"Training {name}...")
    start = time.time()
    model.fit(X_train_scaled, y_train)
    end = time.time()

    # Predictions
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1] if hasattr(model, 'predict_proba') else None

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba) if y_proba is not None else "N/A"
    cv_score = cross_val_score(model, X_train_scaled, y_train, cv=5).mean()
    conf_matrix = confusion_matrix(y_test, y_pred)
    
    results.append({
        "Model": name,
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1-Score": f1,
        "ROC AUC": roc_auc,
        "CV Accuracy": cv_score,
        "Train Time (s)": end - start,
        "Confusion Matrix": conf_matrix
    })

    output_model_dir = os.path.join(os.path.dirname(__file__), "../models/" + name.replace(" ", "") + "Model.joblib")
    joblib.dump(model, output_model_dir)

# 7. Show Results
results_df = pd.DataFrame(results)
print("\nModel Performance Comparison:\n")
print(results_df.sort_values(by='Accuracy', ascending=False).to_string(index=False))

# 8. Select best model (highest accuracy)
best_model = max(results, key=lambda x: x["Accuracy"])
print(f"\nBest Model: {best_model['Model']} with Accuracy: {best_model['Accuracy']:.4f}")

# Save the trained model and scaler
models_scaler_dir = os.path.join(os.path.dirname(__file__), "../models/scaler.joblib")
joblib.dump(scaler, models_scaler_dir)

print("\nModel and scaler saved successfully!")
