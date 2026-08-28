public class count_digit {
    public static void main(String [] args){
        String name = "Sachin1223";
        int count = 0;
        String alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for(int i=0; i<name.length(); i++){
            //if(Character.isDigit(name.charAt(i)) == -1)
            if(alpha.indexOf(name.charAt(i)) == -1){
                count++;
            }
        }
        System.out.println(count);
    }
}
