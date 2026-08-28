def clean_data(data):
    new = []
    for d in data:
        if d is not None and d != "":
            d = d.strip()
            if d.isdigit():
                new.append(int(d))
            
    return new





print(clean_data([" 100 ", "250", "abc", "", None, " 450 ", "700"]))


employees = {
    "Sachin": 45000,
    "Rahul": 62000,
    "Priya": 55000,
    "Aman": 30000
}


new_dict={}
for key,value in employees.items():
    if value>50000:
        new_dict[key] = value
print(new_dict)





def clean(name):
    return name.strip().title()
    
    
print(clean(" sachin kumar "))


#Q1 — Basic try/except

data = ["100", "250", "abc", "450", "xyz", "700"]

total = 0

for d in data:
    try:
        total += int(d)
    except ValueError:
        pass
print(total)


#Cleaning + Exception Handling

data = [" 100 ", "250", "abc", "", None, "450 ", "xyz", "700"]

new_list = []

for d in data:
    if d is not None and d!="":
        d = d.strip()
        try:
            new_list.append(int(d))
        except ValueError:
            pass

print(new_list)

def clean(age):
    if age is not None:
        age=age.strip()
        if age != "":
            try:
                return int(age)
            except ValueError:
                return None

print(clean(" 22 "))





def clean_number(data):
    new_list = []
    for d in data:
        if d is not None:
            d = d.strip()
            if d != "":
                try:
                    new_list.append(int(d))
                except ValueError:
                    pass
    return new_list
    
    
    

print(clean_number(["100", " 250 ", "abc", None, "", "450", "xyz"]))
            

#dictionary filtering          
employees = {
    "Sachin": 45000,
    "Rahul": 62000,
    "Priya": 55000,
    "Aman": 30000,
    "Neha": 75000
}

new_dict={}
for key,value in employees.items():
    if value >= 55000:
        new_dict[key]=value
print(new_dict)



#list of dictionaries

customers = [
    {"name": " Sachin ", "age": "23"},
    {"name": " Rahul", "age": "abc"},
    {"name": " Priya ", "age": "25"},
    {"name": None, "age": "30"},
    {"name": " Aman ", "age": ""},
    {"name": " Neha ", "age": "28"}
]

new_list = []

for customer in customers:
    name = customer["name"]
    age = customer["age"]

    if name != "" and name is not None:
        name = name.strip()

        if age != "" and age.isdigit():
            age = age.strip()
            age = int(age)

            new_list.append({
                "name": name,
                "age": age
            })
print(new_list)


#Remove Duplicate Customers
customers = [
    {"name": "Sachin", "city": "Mumbai"},
    {"name": "Rahul", "city": "Delhi"},
    {"name": "Sachin", "city": "Mumbai"},
    {"name": "Priya", "city": "Pune"},
    {"name": "Rahul", "city": "Delhi"},
    {"name": "Aman", "city": "Mumbai"}
]

new_list=[]

for customer in customers:
    name = customer["name"]
    city = customer["city"]
    if customer not in new_list:
        new_list.append(customer)
    
print(new_list)


#missing values + default value

customers = [
    {"name": "Sachin", "city": "Mumbai"},
    {"name": "Rahul", "city": None},
    {"name": "Priya", "city": "Pune"},
    {"name": "Aman", "city": ""},
    {"name": "Neha", "city": None}
]

new_list=[]

for customer in customers:
    name = customer["name"]
    city = customer["city"]
    if name!="" and name is not None:
        name=name.strip()
    if city == "" or city is None:
        city = "unknown"
    else:
        city=city.strip()
    new_list.append({
        "name":name,
        "city":city
    })
print(new_list)
        