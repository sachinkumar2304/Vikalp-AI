public class remove_spaces {
    public static void main(String [] args){
        String name = " Sachin is genius";
        String removed  = "";
        for(int i=0; i<name.length(); i++){
            if(name.charAt(i) == ' '){
                continue;
            }else{
                removed += name.charAt(i);
            }
        }
        System.out.print(removed);
    }
    
}
