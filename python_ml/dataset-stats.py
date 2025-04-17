import pandas as pd
data = pd.read_csv("ransomware-dataset.csv", delimiter='|')
print(data.info())