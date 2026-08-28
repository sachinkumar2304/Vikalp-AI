
import java.util.Scanner;

public class fibonacci2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("ENter the number: ");
        int num = sc.nextInt();
        int first = 0;
        int second = 1;
        for(int i=0; i<num; i++){
            System.out.println(first);
            int next = first + second;
            first = second;
            second = next;
        }
        
    }
}

