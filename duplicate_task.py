file_list=[
    'report.csv',
    'data.xlsx',
    'summary.docx',
    'report.csv',
    'data.csv'
]

for file in file_list:
    if file_list.count(file) > 1:
        print(f"Duplicate file found: {file}")
        break
else:
    print("All files are unique.")