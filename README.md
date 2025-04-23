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
    - Removed Irrelevant Columns:
        - ImportsNbDLL
        - ImportsNb
        - ImportsNbOrdinal
        - ExportNb
        - ResourcesNb
        - ResourcesMeanEntropy
        - ResourcesMinEntropy
        - ResourcesMaxEntropy
        - ResourcesMeanSize
        - ResourcesMinSize
        - ResourcesMaxSize
        - LoadConfigurationSize
        - VersionInformationSiz
    - Trimmed column names
    - Removed rows with missing values
    - Removed rows with "legitimate" column values not in 0 or 1
    - Removed rows whose values are in negative
    - Removed rows which are duplicates excluding columns (Name, md5)
    - Removed rows which are duplicates including all columns

- **Stats:**
    - Columns: 57 -> 44
    - Rows: 138,047 -> 104,422
    - File Size: 50.7mb -> 30.2mb
    - Row removal reasons: Duplicate rows