text = "   Python Data Engineering   "
print(text.strip())

text = "Python@@Data@@Engineering"
print(text.replace('@@',' '))

email = "   Sachin@Gmail.Com   "
print(email.strip().lower())

text = "Python,SQL,PostgreSQL,FastAPI"
print(text.split(','))

text = "Python123Data456Engineering"
count = 0
for t in text:
    if(t.isdigit()):
        count+=1
print(count)

text = "Python Data Engineering"
vowels = 'aeiouAEIOU'
count = 0
for t in text:
    if(t in vowels):
        count+=1
        
print(count)

text = "data engineering with python"
new = []

words = text.split()
for word in words:
    new.append(word.capitalize())
print(' '.join(new))


data = ["  Sachin ", " Rahul  ", "  Priya"]

new_list = []


for d in data:
    new_list.append(d.strip())
print(' '.join(new_list))


data = ["100", "250", "50", "300"]
total = 0
for d in data:
    total += int(d)
print(total)


data = ["100", "200", "invalid", "300", "500"]

total = 0

for d in data:
    if(d.isdigit()):
        total += int(d)
print(total)
    
data = [10, 25, 40, 7, 18, 55]
new = []
for d in data:
    if d>20:
        new.append(d)
print(new)

data = {
    "Sachin": 85,
    "Rahul": 42,
    "Priya": 91,
    "Aman": 67
}

new_dict = {}
for key,values in data.items():
    if values > 60:
        new_dict[key]=values
print(new_dict)

data = {
    "name": "sachin",
    "city": "mumbai",
    "role": "data engineer"
}
new_dict={}

for key, values in data.items():
    new_dict[key] = values.upper()
print(new_dict)

data = ["Sachin", "", "Rahul", None, "Priya", ""]
new = []
for d in data:
    if d != ""  and d is not None:
        new.append(d)
print(new)


data = ["  Sachin ", "Rahul", "  Priya  ", "", None, "Aman  "]
new1 = []

for d in data:
    if d!="" and d is not None:
        new1.append(d.strip())
print(new1)

data = ["100", "250", "abc", "450", "", None, "700"]

new = []
for d in data:
    if d is not None and d.isdigit():
        new.append(int(d))
print(new)

data = ["Sachin", "Rahul", "Sachin", "Priya", "Rahul", "Aman"]

new = []
for d in data:
    if d not in new:
        new.append(d)
print(new)



def clean_data(name):
    return name.strip().capitalize()
    
print(clean_data(" sachin "))

def clean_age(age):
    age = age.strip()
    if age.isdigit():
        return int(age)
    else:
        return None
print(clean_age(" 23"))


def clean_list(data):
    new = []
    for d in data:
        if d is not None:
            d=d.strip()
            if d.isdigit():
                new.append(int(d))
        
    return new
print(clean_list([" 100 ", "250", "abc", " 450 ", None]))


