public class count_vowels {
    public static void main(String [] args){
        String name = "Sachin";
        int count = 0;
        String vowels =  "aeiouAEIOU";
        for(int i =0; i<name.length(); i++){
            if(vowels.indexOf(name.charAt(i)) != -1){
                count++;
            }
        }
        System.out.println(count);
    }
}