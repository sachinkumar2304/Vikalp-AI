
import java.util.Scanner;

public class factorial2{
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the number: ");
        int num = sc.nextInt();
        int factorial = 1;
        for(int i=num; i>0; i--){
            factorial = factorial*i;
        }
        System.out.println(factorial);

    }
}