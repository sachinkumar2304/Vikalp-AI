public class count_digit1 {
    public static void main(String[] args) {
        String text = "Sachin123Kumar45";
        int count = 0;
        for(int i=0; i<text.length(); i++){
            if(Character.isDigit(text.charAt(i))){
                count++;
            }
        }
        System.out.println(count);
    }
}
