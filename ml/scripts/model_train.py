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
from imblearn.over_sampling import SMOTE
from sklearn.metrics import classification_report
from sklearn.utils import resample

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["KMP_DUPLICATE_LIB_OK"] = "True"

dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/cleaned.csv")
data = pd.read_csv(dataset_path)

df_majority = data[data.legitimate == 0]
df_minority = data[data.legitimate == 1]

df_majority_downsampled = resample(
    df_majority,
    replace=False,                         # sample without replacement
    n_samples=len(df_minority),           # to match minority class
    random_state=42
)

data_balanced = pd.concat([df_majority_downsampled, df_minority])

data_balanced = data_balanced.sample(frac=1, random_state=42)

X = data_balanced.drop(['legitimate'], axis=1)
y = data_balanced['legitimate']

print(data['legitimate'].value_counts())
print(data_balanced['legitimate'].value_counts())

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

smote = SMOTE(random_state=42)
X_train, y_train = smote.fit_resample(X_train, y_train)

scaler = StandardScaler()
X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=X_train.columns)
X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=X_test.columns)

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

    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1] if hasattr(model, 'predict_proba') else None

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba) if y_proba is not None else "N/A"
    cv_score = cross_val_score(model, X_train_scaled, y_train, cv=5).mean()
    conf_matrix = confusion_matrix(y_test, y_pred)
    print(f"\nClassification Report for {name}:\n", classification_report(y_test, y_pred))
    
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
    
    ransom_sample = X_train[y_train == 1].iloc[0:1]
    ransom_sample_scaled = pd.DataFrame(scaler.transform(ransom_sample), columns=X_train.columns)

    ransom_pred = model.predict_proba(ransom_sample_scaled)
    predicted_class = model.predict(ransom_sample_scaled)
    print(f"\nPredicted probabilities for ransomware sample:\n{ransom_pred}")
    print(f"Predicted class: {'Legitimate' if predicted_class[0] == 0 else 'Ransomware'}")

results_df = pd.DataFrame(results)
print("\nModel Performance Comparison:\n")
print(results_df.sort_values(by='Accuracy', ascending=False).to_string(index=False))

best_model = max(results, key=lambda x: x["Accuracy"])
print(f"\nBest Model: {best_model['Model']} with Accuracy: {best_model['Accuracy']:.4f}")

models_scaler_dir = os.path.join(os.path.dirname(__file__), "../models/scaler.joblib")
joblib.dump(scaler, models_scaler_dir)

print("\nModel and scaler saved successfully!")
