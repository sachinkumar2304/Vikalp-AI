public class reverse_integer {
    public static void main(String[] args) {
        int num = 56432;
        int reverse = 0;
        while(num>0){
            int last = num % 10;
            reverse = reverse * 10 + last;
            num = num / 10;
        }
        System.out.println(reverse);
    }
}
