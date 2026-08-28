a = {30,40,50,60,80}
b = {10,12,15,17,60}

#mathematical operation
#print(a.union(b))

#print(a.intersection(b))


#print(b.difference(a))

#print(a.symmetric_difference(b))
# here a is a part of b 
#print(a.issubset(b))
#here b is main set and a is part of it 
#print(b.issuperset(a))

#return true if both set share no item 
#print(a.isdisjoint(b))

#Disctionary

'''my_dict = {
    'a':10,
    'b':20,
    'c':30
}

print(my_dict)#ordered
#unique
#Values allow duplicate
print(my_dict['a'])#not indexed it is keyed

my_dict['a'] = 90
print(my_dict) #mutable

'''
'''
user = {'id':1 , 'age':22 , 'city':'berlin'}

print(user['age'])

#returns the value safely gives none if missing or your default value

print(user.get("name","unknown"))

#test if the key is inside the dictionary
#check
print('age' in user)
print('name' not in user)

#returns all the keys of dictionary
print(user.keys())

#returns list of tuples
print(user.items())

#Looping
for key,values in user.items():
    print(key,values)
    

#add, remove, update
user['name'] = 'John' #add
print(user) 

#update - add new key and update existing ones -- use for both update and add 

user.update({'age':20, 'name':'sachin', 'location':'Ambarnath'})
print(user)

#use to remove items and give default if item not in dictionary
user.pop('age')
print(user)
a = user.pop('salary','unknown')
print(a)
'''

#Task 1
user = {'id':1,'name':'John','age':30,'city':'India'}
new_dict = {}
#print(user.fromkeys((user),None))
for key,values in user.items():
    if type(values) == str:
        new_dict[key]=values.upper()
print(new_dict)