public class frequency{
    public static void main(String[] args) {
        String name = "jaya";
        for(int i = 0; i<name.length(); i++){
            boolean isrepeated = false;
            for(int k=0; k<i; k++){
                if(name.charAt(i) == name.charAt(k)){
                    isrepeated = true;
                    break;
                }
            }if(isrepeated){
                continue;
            }

            int count =0;
            for(int j=0; j<name.length(); j++){
                if(name.charAt(i) == name.charAt(j)){
                    count++;
                }
            }
            System.out.println(name.charAt(i)+" = "+ count);
        }
    }
}