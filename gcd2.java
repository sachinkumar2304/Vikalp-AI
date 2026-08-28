
import java.util.Scanner;

public class gcd2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the number: ");
        int num = sc.nextInt();
        System.out.print("Enter the second number: ");
        int num2 = sc.nextInt();
        int gcd = 0;
        for(int i=1; i<num; i++){
            if(num % i == 0 && num2 % i == 0){
                gcd = i;
            }
        }
        System.out.println(gcd);
    }
}
