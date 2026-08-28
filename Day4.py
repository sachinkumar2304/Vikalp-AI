my_tuple = (10,20,40,50)

print(my_tuple)  #ordered #allow duplicates

print(my_tuple[1])
'''
my_tuple[3] = 30 #immutable
print(my_tuple)
'''

my_set = {10,20,40,30,10}
#unordered , and not allow duplicates and no indexing
print(my_set)

#mutable 
my_set.remove(20)
print(my_set)

a={20,10,40,50,80}

a.add(90)
a.update([6])
a.discard(40)
print(a)