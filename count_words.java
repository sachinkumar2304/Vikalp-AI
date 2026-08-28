public class count_words {
    public static void main(String [] args){
        String name = " Sachin is genius";
        int count = 0;
        for(int i=0; i<name.length(); i++){
            if(name.charAt(i) != ' ' && (i == 0 || name.charAt(i-1) == ' ')){
                count++;
            } 
        }
        System.out.print(count);
    }
}
