public class character_frequency {
    public static void main(String [] args){
        String name = "Sacahin";
        int count = 0;
        for (int i = 0; i<name.length(); i++){
            if(name.indexOf(name.charAt(i)) != i){
                    continue;
                }
            for(int j=0; j<name.length(); j++){
                
                if(name.charAt(i) == name.charAt(j)){
                    count++;
                
                }
            }
            System.out.println(name.charAt(i) + ":" + (count));
            count = 0;
        }

    }
}
