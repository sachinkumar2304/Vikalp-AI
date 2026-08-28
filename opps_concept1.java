
import java.util.Scanner;

public class opps_concept1 {


    //class and objects hai ye easy 
    public static class Student{
        String name;
        int rno;
        double cgpa;
        void print(){ //method of class
            System.out.println(name+" "+rno+" "+cgpa);
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        Student s1 = new Student();//object hai class ka
        s1.name = "khushi";
        s1.rno = 39;
        s1.cgpa = 7.50;

        Student s2 = new Student();
        s2.name = "Sachin";
        s2.rno = sc.nextInt();
        s2.cgpa = 8.24;

        //System.out.println(s1.name+ " "+s1.rno+" "+s1.cgpa);
        //s2.rno = 51;
        //System.out.print(s2.rno);

        s1.print();
        s2.print();
    }
}
