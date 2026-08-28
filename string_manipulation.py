email = input("Enter your email address: ")

if len(email) == 0:
    print("Email cannot be empty")
elif '@' not in email or '.' not in email:
    print("Email must contain '@' and '.'")
elif email.count('@') != 1:
    print("Email cannot have more than one '@' symbol")
elif not email.endswith(('.com','.org','.edu')):
    print("Email must end with a valid domain")
elif len(email) > 254:
    print("Email length should not exceed more than 254")
elif not email[0].isalnum() or not email[-1].isalnum():
    print("Email should not start or ends with a special character")
else:
    print("Email is valid")