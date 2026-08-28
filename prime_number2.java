import java.util.*;
public class prime_number2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Enter the number: ");
        int num = sc.nextInt();
        //5
        if(num<=1){
            System.out.println("Not a prime number");
        }else{
        boolean isprime = true;
            for(int i=2; i<num; i++){
                if(num % i == 0 && num != i){
                    isprime = false;
                    break;
                }
            
        }
        if(isprime){
            System.out.println("Prime number");
        }else{
            System.out.println("Not a prime number");
        }
    }
    }
}

