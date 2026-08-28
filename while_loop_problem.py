attempt = 0
while True:
    answer = input("Do you agree: (yes/no): ")
    if answer.lower() == "yes":
        print("Glad we are on the same page.")
        break
    attempt += 1
    if attempt == 3:
        print(f"{attempt} strikes and you are out!")
        break


