# Ransomware Detection & Protection System

> **Masters Project**
> 
> **Student Name:** Sabeeh Mirza
> 
> **Student ID:** 22085589
>
> **Course:** MSc Cyber Security
>
> **Supervisor:** Sydney Ezika

## Useful Links

- For ransomeware files testing: https://github.com/kh4sh3i/Ransomware-Samples

## Commands

- **Start Development Server:** 
    > npm run dev

- **Start Production Server:** 
    > npm run prod

## Dataset Cleaning Process

- **Cleaning Process:**
    - Removed Irrelevant Columns & Kept only these:
        - SectionsMeanEntropy
        - SectionsMinEntropy
        - SectionsMaxEntropy
        - ResourcesMeanEntropy
        - ResourcesMinEntropy
        - ResourcesMaxEntropy
    - Trimmed column names
    - Removed rows with missing values
    - Removed rows with "legitimate" column values not in 0 or 1
    - Removed rows whose values are in negative

- **Stats:**
    - Columns: 57 -> 7
    - Rows: 138,047
    - File Size: 50.7mb -> 11.4mb
    - Row removal reasons: NA value rows
    - Rows Before Balancing:
        - Legitimate Rows: 63,104
        - Ransomware Rows: 41,318
    - Rows After Balancing:
        - Legitimate Rows: 41,318
        - Ransomware Rows: 41,318

# Models Performance Comparison

| Model | Accuracy | Precision | Recall | F1-Score | ROC AUC | CV Accuracy | Train Time (s) | Confusion Matrix |
| -------- | :-------: | :-------: | :-------: | :-------: | :-------: | :-------: | :-------: | ------- |
| Random Forest | 0.986025 | 0.979226 | 0.993098 | 0.986114 | 0.997750 | 0.985483 | 12.096566 | [[8097, 174], [57, 8202]] |
| Logistic Regression | 0.830913 | 0.804164 | 0.874561 | 0.837886 | 0.929293 | 0.840249 | 0.052966 | [[6512, 1759], [1036, 7223]] |
| SVM | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [] |