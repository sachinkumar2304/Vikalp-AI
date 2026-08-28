email = input("Enter your email address: ")
password = input("Enter your password: ")
valid_Password = True
#Must not be empty 
if len(password) == 0:
    print("Password cannot be empty.")
    valid_Password = False
#Must be at least 8 characters long
if len(password) < 8:
    print("Password must be at least 8 characters long.")
    valid_Password = False

#Must contain at least one uppercase letter
if not any(char.isupper() for char in password):
    print("Password must contain at least one uppercase letter.")
    valid_Password = False

#must contain at least one lowercase letter 
if not any(char.islower() for char in password):
    print("Password must contain at least one lowercase letter.")
    valid_Password = False
#must not be same as the email address
if password == email:
    print("Password cannot be the same as the email address.")
    valid_Password = False
#must not contain any spaces
if ' ' in password:
    print("Password must not contain any spaces.")
    valid_Password = False
#Must start or end with as letter or a digit
if  not (password[0].isalnum() and password[-1].isalnum()):
    print("Password must start and end with a letter or a digit.")
    valid_Password = False
if valid_Password:
    print("Password is valid.")