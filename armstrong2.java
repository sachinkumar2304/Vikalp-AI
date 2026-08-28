import java.util.Scanner;

public class armstrong2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the number: ");
        int num = sc.nextInt();
        int original = num;
        int next = 0;
        while(num>0){
            int last = num % 10;
            next = next  + last * last * last;
            num = num / 10;
        }
        if(original == next){
            System.out.println("Armstrong number");
        }else{
            System.out.println("Not an armstrong number");
        }
    }
}
