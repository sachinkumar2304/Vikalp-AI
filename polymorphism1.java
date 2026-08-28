
class Animals{
    void speak(){
        System.out.println("Animal Speaks");
    }
}

class Dog extends Animals{
    void speak(){
        System.out.println("Bhau BHau");
    }
}

class Cat extends Animals{
    void speak(){
        System.out.println("Meow Meow");
    }
}
public class polymorphism1 {

    public static void main(String[] args) {
        Animals a = new Animals();

        //runtime polymorphism occurs when a parent class object referers to the child class object 
        a = new Dog();
        a.speak();
        a = new Cat();
        a.speak();
    }
    
}
