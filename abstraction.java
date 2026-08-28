
abstract class student{
    abstract void class1();
    void dress(){
        System.out.println("Blue shirt and black pant");
    }
}

class max extends student{
    @Override
    void class1(){
        System.out.println("graduation");
    }

}

class min extends student{
    @Override
    void class1(){
        System.out.println("UnderGraduation");
    }
}



public class abstraction {
    public static void main(String[] args) {
        max m = new max();
        m.class1();
        m.dress();

        min m1 = new min();
        m1.class1();
        m1.dress();
    }
}
