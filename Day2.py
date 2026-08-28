
import math
import random
'''
x = random.randint(1,100)
y=x % 2
print("The number is an even number" if y==0 else "The number is an odd number",x)
#print(y)
'''

#check if the user name is not empty and age is greater than or equal to 18 

#user_name=input("Enter your name: ")
#age = int(input("Enter your age: "))

#print(user_name != '' and age >=18)

#check if the password is atleast 8 character long and does not contains spaces
#password = "12344-2ss"
#print(len(password) >= 8 and ' ' not in password)

#check is users email is not empty contains @ and ends with .com

#email="spal67073@gmail.com"
#print(email != '' and '@' in email and email.endswith('.com'))

#check is the username is a string and is not none and is longer than 5 characters

#username="sachin"
#print(isinstance(username, str) and username is not None and len(username) >5)


#check if the user is either an admin or a moderator , and either they are not banned or they have verified email 

is_admin = True
is_moderator = True 
is_banned =False
has_verified_email = True  

print(is_admin or is_moderator and (not is_banned or has_verified_email))