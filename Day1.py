'''
age=int(input("Enter your age:"))
print("Age:",age)
print(type(age))
#print(len(age))
height=float(input("Your height:"))
print("height:",height)
print(type(height))
#print(len(height))
name=input("Enter your name:")
print("name:",name)
print(type(name))
print(len(name))
h=input("are you student:? (yes/no) :").lower()=="yes"
print(h)
print(type(h))
#print(len(h))
a=None
print(a)
print(type(a))
#print(len(a))
'''

'''
#replace

number="+49 (176) 123-4567"
print(number.replace("+","").replace(" ","").replace("(","").replace(")","").replace("-",""))


#formatted

age=22
name="sachin"
is_student=False

print(f"My name is {name} my age is {age} i am not a student {is_student}")
print(f"{{This is me}}")
'''
#split
'''
csv_file = "2026,march,19,sachin,student"
print(csv_file.split(","))

#multiplication

print("ha"*4)
print("=" * 30)

#extraction 

a="hello"
print(a[0:3])
print(a[0])
print("ha"*3)
print(a[-1])

date="2026-09-21"
print(date[5:7])
print(date[0:4])

name=" MCA "
subject = "Python ".rstrip()
print(name.strip(),subject)


subject1 = " Python "
print(len(subject1))
print(len(subject1.strip()))

num_of_spaces = len(subject1) - len(subject1.strip())
print("Number of spaces:",num_of_spaces)
clean_data = len(subject1) == len(subject1.strip())
print("Is my data clean:",clean_data)

#clean this data

#"968-Maria, ( D@T@ Engineer );; 27y  "
data = "968-Maria, ( D@T@ Engineer );; 27y  "

print(data.strip())
print(data.replace("968-", "name: ").replace(",", " |").replace("(", "role:").replace("D@T@", "Data").replace(")", "|").replace(";;"," age:").replace("27y","27"))

first_name ="sachin"
last_name= "kumar"
print(f"My name is {first_name} {last_name}")



#startwith,endwith,find,in

number="+49 123-123345"
print(number.startswith("+49"))
print(number.endswith("345"))
print("-" in number)

phone1 = "+91-9322245395"
phone2 = "+41-123-4231"
phone3 = "001-123-42342"

print(phone1.find("-"))
print(phone1[phone1.find("-")+1:].replace("-",""))
print(phone2[phone2.find("-")+1:].replace("-",""))
print(phone3[phone3.find("-")+1:].replace("-",""))

'''
#IsAplha

country="India1"
number="1234556."
print(country.isalpha())
print(number.isnumeric())