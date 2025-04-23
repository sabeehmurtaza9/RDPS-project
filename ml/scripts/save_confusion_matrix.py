import matplotlib.pyplot as plt
import seaborn as sns
import os

# Confusion matrix values
conf_matrix = [[18716, 177], [94, 12340]]

# Plotting
plt.figure(figsize=(6, 5))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Oranges',
            xticklabels=['Pred: Legitimate', 'Pred: Ransomware'],
            yticklabels=['Actual: Legitimate', 'Actual: Ransomware'])
plt.title("Confusion Matrix")
plt.ylabel("Actual Label")
plt.xlabel("Predicted Label")
plt.tight_layout()

# Save as JPG
path = os.path.join(os.path.dirname(__file__), "../out/confusion_matrix.jpg")
plt.savefig(path, format='jpg', dpi=300)

# Show plot
plt.show()
