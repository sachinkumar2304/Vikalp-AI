

class prime_number{
    public static void main(String[] args) {
        int num[] = {19,39,2,30,28,11,293,12};
        int count = 0;
        for(int i=0; i<num.length; i++){
            boolean isprime = true;
            for(int j=2; j<num[i]; j++){
                if(num[i] % j == 0){
                    isprime = false;
                    break;

                }
            }
            if(isprime){
                count++;
            }
        }
        System.out.println(count);
    }
}