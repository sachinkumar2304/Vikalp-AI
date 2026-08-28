public class firstunique {
    public static void main(String[] args) {
        String name = "aabbfssl";
        
        for(int i=0; i<name.length(); i++){
            int count=0;
            for(int j=0; j<name.length(); j++){
                if(name.charAt(i)==name.charAt(j)){
                    count++;
                }
            }
            if(count == 1){
                System.out.println(name.charAt(i));
                break;
            }
            
        }
    }
}
