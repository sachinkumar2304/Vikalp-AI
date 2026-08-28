/*import java.util.Stack;

class reverse_string{
    public static void main(String [] args){
        String name = "Sachin";
        Stack<Character> stack = new Stack<>();
        for(int i=0; i<name.length(); i++){
            stack.push(name.charAt(i));
        }
        while(!stack.isEmpty()){
            System.out.print(stack.pop());
        }
    }
}
    */

//second way

class reverse_string{
    public static void main(String [] args){
        String name = "sachin";
        for(int i=name.length()-1; i>=0; i--){
            System.out.print(name.charAt(i));
        }
    }
}