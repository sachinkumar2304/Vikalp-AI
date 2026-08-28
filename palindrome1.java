public class palindrome1{
    public static void main(String[] args) {
        String name = "nitin";
        boolean ispalindrome = true;
        int i =0;
        int j = name.length()-1;
        while(i<j){
            if(name.charAt(i)!=name.charAt(j)){
                ispalindrome = false;
                break;
            }
            i++;
            j--;
            }
        if(ispalindrome){
            System.out.println("It is palindrome");
        }else{
            System.out.println("Not a palindrome");
        }
        }
}
