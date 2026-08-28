public class palindrome_number2 {
    public static void main(String[] args) {
        int num = 121;
        int original = num;
        int reverse = 0;
        while(num>0){
            int last = num % 10;
            reverse = reverse *10 +last;
            num = num/10;
        }
        if(original == reverse){
            System.out.println("It is a palindrome");
        }else{
            System.out.println("It is not a palindrome");
        }
    }
}
