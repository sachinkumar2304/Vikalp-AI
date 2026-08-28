
'''
case_rule = "lower"
def clean_text(name):
    cleaned = name.strip()
    if case_rule == "lower":
        cleaned = cleaned.lower()
    print(cleaned)
    
    
clean_text("  MariA ")

def write_log(message):
    with open(r"C:\Users\spal6\app.log","a") as file:
        file.write(message+"\n")

#write_log("Hello")
#write_log("You will be placed in BNP Paribhas with 7 LPA Salary soon")
'''

