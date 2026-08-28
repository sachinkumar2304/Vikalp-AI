public class reverse_number {
    public static void main(String[] args) {
        int n  = 27834;
        int reverse = 0;

        while(n!=0){
            int last = n%10;
            reverse = reverse * 10 + last;
            n = n/10;
        }
        System.out.println(reverse);

    }
}
