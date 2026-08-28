
import java.util.Scanner;

public class find_Nth_term {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the number: ");
        int num = sc.nextInt();
       //System.out.println("Enter the target number: ");
       // int target = sc.nextInt();

        int first = 0;
        int second = 1;
        for(int i=0; i<num; i++){
            int next = first+second;
            first = second;
            second = next;
        }
        System.out.println(first);
    }
}
