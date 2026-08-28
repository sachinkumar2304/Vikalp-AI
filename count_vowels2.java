public class count_vowels2 {
    public static void main(String[] args) {
        String text = "Sachin kumar";
        String vowels = "aeiouAEIOU";
        int count = 0;
        for(int i=0; i<text.length(); i++){
            if(vowels.indexOf(text.charAt(i)) != -1){
                count++;

            }
        }
        System.out.println(count);
    }
}
