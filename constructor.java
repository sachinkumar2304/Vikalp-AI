
class car{
    String name;
    int price;
    double length;


void print(){
    System.out.println(name+" "+price+" "+length);

}

car(){  //default constructor

}

//paramaterised constructor

car(String s, int i, double d){
    name = s;
    price = i;
    length = d;

}
}

//method overloading 
/*public static int max(int x, int y){
    return Math.max(x, y);
}
public static int max(int x, int y, int z){
    return Math.max(x, Math.max(y , z));
}*/


public class constructor{
    public static void main(String[] args) {
        //System.out.println(max(3,4,5));


        car c1 = new car("Honda",1200000,4.3);
        c1.print();
        car c2 = new car("Alto", 2000000, 3.3);
        c2.print();
        car c3 = new car();
        c3.name = "Jupyter";
        System.out.println(c3.name);
        //c3.print();

    }
}