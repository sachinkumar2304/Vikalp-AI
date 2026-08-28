public class armstorng {
    public static void main(String[] args) {
        int num = 153;
        int original = num;
        
        int last = 0;
        int cube = 0;
        while(num!=0){
            last = num % 10;
            cube = cube + last*last*last;
            num = num/10;
        }if(cube == original){
            System.out.println("Armstrong number");
        }
        else{
            System.out.println("Not a armstrong number");
            
        }
    }
}
