'''def clean_email(email):
    cleaned = email.strip().lower()
    
    username , domain = cleaned.split("@")
    return {"Username": username,
            "Domain": domain}
    
print(clean_email(" Spal67073@gmail.Com "))'''


def write_log(message):
    with open(r"C:\Users\spal6\log1.txt","a") as file:
        file.write(message +"\n")
        
def is_valid_email(email):
    return '@' in email and '.' in email

def clean_email_data(email):
    cleaned = email.strip().lower()
    username , domain = cleaned.split('@')
    return {"username" : username,
            "domain" : domain}


def process_email(email):
    write_log("App started")
    #we receive an email from the user

    #we must check if it is valid 
    is_valid_email(email)
    #if it is not valid , we must log the problem
    if not is_valid_email(email):
        print(f"Email is not valid : {email}")
    else:
        clean_email = clean_email_data(email)
        write_log(f"Processed emain: {clean_email}")

    write_log("App stopped")
    #if it is valid, we clean it and stored structured information
    #and we log what happened

email = input("Enter the email address: ")
process_email(email)