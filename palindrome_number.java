public class palindrome_number {
    public static void main(String[] args) {
        int n = 121;
        int original = n;
        int reverse = 0;
        while(n!=0){
            int last = n % 10;
            reverse = reverse * 10 + last;
            n = n/10;
        }
        if(original != reverse){
            System.out.println("Not a palindrome");
        }
        else{
            System.out.println("Palindrome");
        }
    }
}
