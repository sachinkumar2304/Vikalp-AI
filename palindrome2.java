public class palindrome2 {
    public static void main(String[] args) {
        String text = "nitin";
        boolean ispalindrome = true;
        int i =0;
        int j=text.length()-1;
        while(i<j){
            if(text.charAt(i)!=text.charAt(j)){
                ispalindrome = false;
                break;
            }
            i++;
            j--;
            
        }if(ispalindrome){
            System.out.println("It is palindrome");

        }else{
            System.out.println("Not a palindrome");
        }
        
    }
}

