public class count_words1 {
    public static void main(String[] args) {
        String text = "Sachin Kumar Pal";
        int count = 0;
        for(int i=0; i<text.length(); i++){
            if( i==0 || text.charAt(i-1) == ' '){
                count++;
            }
        }
        System.out.println(count);
    }
}
