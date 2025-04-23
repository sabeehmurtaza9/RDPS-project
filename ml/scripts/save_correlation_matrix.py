import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os

# Load your dataset
dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/cleaned.csv")
df = pd.read_csv(dataset_path)

# Optional: drop non-numeric columns if needed
# df = df.select_dtypes(include=['number'])

# Compute correlation matrix
corr_matrix = df.corr(numeric_only=True)

# Plotting
plt.figure(figsize=(12, 10))
sns.heatmap(corr_matrix, cmap='coolwarm', annot=False, fmt='.2f',
            square=True, cbar_kws={"shrink": .75})
plt.title("Correlation Matrix")
plt.tight_layout()

# Save as JPG
path = os.path.join(os.path.dirname(__file__), "../out/correlation_matrix.jpg")
plt.savefig(path, format='jpg', dpi=300)

# Show plot
plt.show()
