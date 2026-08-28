
//same name different kaam like method name same hai but kaam different hai yha


public class polymorphism {

    public static class Dog{
        void speak(){
            System.out.println("Bhau BHau");
        }

    }
    public static class Cat{
        void speak(){
            System.out.println("Meow Meow");
        }

    }
    public static class Human{
        void speak(){
            System.out.println("Hello");
        }

    }
    public static class Lion{
        void speak(){
            System.out.println("Grrrrrr");
        }

    }
    public static void main(String[] args) {
        Dog d = new Dog();
        Cat c = new Cat();
        Human h = new Human();
        Lion l = new Lion();

        c.speak();
        d.speak();
        h.speak();
        l.speak();
        
    }
    
}
