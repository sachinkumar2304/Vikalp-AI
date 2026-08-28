
table = 7
for i in range (1,11):
    print(f"{table} * {i} = {table * i}")
    
    
    
#Patter printing

for i in range(1,7):
    for j in range(1,i+1):
        print("*",end="")
    print()
    
for i in range(1,7):
    for j in range(7,i,-1):
        print("*",end="")
    print()