import matplotlib.pyplot as plt
import seaborn as sns
import os

conf_matrix = [[8097, 174], [57, 8202]]

plt.figure(figsize=(6, 5))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Oranges',
            xticklabels=['Pred: Legitimate', 'Pred: Ransomware'],
            yticklabels=['Actual: Legitimate', 'Actual: Ransomware'])
plt.title("Confusion Matrix")
plt.ylabel("Actual Label")
plt.xlabel("Predicted Label")
plt.tight_layout()

path = os.path.join(os.path.dirname(__file__), "../out/confusion_matrix.jpg")
plt.savefig(path, format='jpg', dpi=300)
