class palindrome{
    public static void main(String [] args){
        String name = "nitin";
        int i = 0;
        int j = name.length()-1;
        boolean isPalindrome = true;
        while(i<j){
            if(name.charAt(i) != name.charAt(j)){
                isPalindrome = false;
                break;

            }
            i++;
            j--;

        }
        System.out.println(isPalindrome);
    }
}