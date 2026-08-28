
class Student{
    String name; //default value null
    private int rno = 39; //default value 0 
    double cgpa; //default value is 0.0
    void print(){
        System.out.println(name+" " +rno+" "+cgpa);
    }
    //to access private we can create another method
    //void p(){
      //  print();
    //}

    //we can use getter to get the values of private and setter to set it different values
    int getrno(){ // it is used to get the things from private class
        return rno;
    }

    void setrno(int x){ //it is use to set the things to private class
        rno = x;
    }
}

public class getset {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "Sachin";
        //s1.rno = 39;  //because it is private we cannot access
        s1.cgpa = 8.24;
        //System.out.println(s1.name+" "+s1.cgpa);
        //s1.p();

        System.out.println(s1.getrno());
        s1.setrno(30);
        System.out.println(s1.getrno());
        s1.print();

        
    }

    
}
