class car{
    String name ;
    int price;
    double length;

    void print(){
            System.out.println(name+" "+price+" "+length);
        }
    car(){//default constructor

    }
    car(String n,int p, double l){ //parametrised constructor
        name = n;
        price = p;
        length = l;
    }
    //use this keyword to show that it is from current 
    car(int price,String name, double length){ //parametrised constructor
        
        this.price = price;
        this.name = name;
        this.length = length;
    }

    
}

public class This_keyword {
    public static void main(String[] args) {
        car c1 = new car("Alto",1200000,3.4);
        c1.print();
        car c2 = new car(3000000,"Kia",4.23);
        c2.print();
    }


}
