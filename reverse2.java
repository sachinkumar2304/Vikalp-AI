class reverse2{
    public static void main(String [] args){
        String text = "sachin";
        for(int i=text.length()-1; i>=0; i--){
            System.out.print(text.charAt(i));
        }
    }
}