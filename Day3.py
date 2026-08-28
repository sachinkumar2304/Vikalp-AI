#Iterators
'''
#reversed
letters = ['a','b','c']
print(list(reversed(letters)))
# new way
for l in reversed(letters):
    print(l)
    

#enumerate
letters1 = ['a','b','c']
print(list(enumerate(letters,start = 1)))
#iterate using for loop
for letters , index in enumerate(letters):
    print(letters,index)
    

#Zip
letters2 = ['a','b','c']
numbers = [1,2,3]
print(list(zip(letters2,numbers)))

#using loop
for l , n in zip(letters2,numbers):
    print(l,n)
    


#map

letters4 = ['a','b','c']
print(list(map(str.upper,letters4)))

numbers4 = ['1','2','3']
print(list(map(int,numbers4)))

names = [' sachin','mimmoh ' ,' jayu ']
print(list(map(str.strip,names)))
#for loop
for n in map(str.strip,names):
    print(n)
    

#filter

data = ['a','1','b','c']
print(list(filter(str.isalpha,data)))


#lambda
multiple = lambda x:x*2
print(multiple(2))

add = lambda x,y: x+y
print(add(2,4))

letters = lambda i:i in 'python'
print(letters('n'))

'''
#Task data transformation

prices = ['$12.50',' $23.42','$11.00']

print(list(map(lambda p: float(p.replace('$','')),prices)))
print(list(map(lambda p: float(p.replace('$','')),prices)))

#Challenge

students = [['maria',85],
            ['kumar',90],
            ['max',60]]

print(list(filter(lambda row:row[0].startswith('m'),students)))


domains = ['www.google.com',
           'openai.com',
           'localhost',
           'www.DATAWITHBARAA.COM']



cleaned = [
    d.lower().replace('www.','')
    for d in domains
    if '.' in d
]

print(cleaned)