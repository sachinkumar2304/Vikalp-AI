name = [1,2,4,2,4,0,2]
name1 = [1,2,4,2,4,3,4]
print(max(name))
print(min(name))
print(sum(name))
print(len(name))
print(all(name)) #check if all the elements in the list are true or not like not 0 and '' or null

print(any(name)) # chec if any is true or not

print(name.count(2))
print(name.index(4))# it will return the index of first occurence of 4 in the list

print(name.reverse())

print(1 in name) #check if 1 is present in the list or not
print(2 is name) #check if 2 is the same object as name or not

print (name1 == name)
print (name1 < name)