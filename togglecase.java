public class togglecase {
    public static void main(String [] args){
        String name = "Sachin Kumar";
        String toggled = "";
        for(int i=0; i<name.length(); i++){
            if(Character.isUpperCase(name.charAt(i)) == true){
                toggled += Character.toLowerCase(name.charAt(i));

            }else{
                toggled += Character.toUpperCase(name.charAt(i));
            }
        }
        System.out.print(toggled);
    }
}