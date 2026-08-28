'''
Name = input("Enter your name: ")
Age = int(input("Enter your age: "))
Height = float(input("Enter your height: "))

print("Your name is ",Name)
print("Your Age is ", Age)
print("Your height is ",Height)


number = int(input("Enter any number: "))

if(number%2 == 0):
    print("The number is even")
else:
    print("Odd number")

password = input("Enter your password: ")

if not len(password)>8:
    print("Password must be 8 characters long")
elif ' ' in password:
    print("There should not be space in password")
else: print("Password is correct")


email = input("Enter your email address: ")

if '.' not in email or '@' not in email or ' ' in email or email == '':
    print("invalid email")
else:
    print("valid email")
    


text = " Sachin KUmAr "

print(text.strip().lower())


te xt = "PythonProgramming"
print(text[:6])
print(text[6:])

phone = "+91-9322245395"
print(phone.find('-'))
print(phone[4:])


#
# name: Maria | role: Data Engineer | age: 27
data = "968-Maria, ( D@T@ Engineer );; 27y"

print(data.replace('968','name').replace('-',': ').replace(',',' |').replace('(','role:').replace('D@T@','Data').replace(')','| ').replace(';;','age:').replace('27y','27'))


text = "Sachin Kumar"
vowels = "aeiouAEIOU"
count = 0
for t in text:
    if t in  vowels:
        count += 1
print(count)


text = "Sachin123Kumar45"
count = 0
for t in text:
    if t.isdigit():
        count +=1
        
print(count)


text = "banana"
frequency = {}
for t in text:
    count = 0
    if t in frequency:
        continue;
    else:
        count +=1
print(count)
'''

user = {
    "id": 1,
    "name": "John",
    "age": 30,
    "city": "India"
}

new_dict = {}
for key, value in user.items():
    if type(value) == str:
        
        new_dict[key]=value.upper()
        
print(new_dict)