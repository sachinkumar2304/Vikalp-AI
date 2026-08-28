public class first_unique_char {
    public static void main(String [] args){
        int [] arr = {1,2,3,4,1,2,3,4,5,6,6};
        int count = 0;
        for(int i=0; i<arr.length; i++){
            for(int j=0; j<arr.length; j++){    
                if(arr[i] == arr[j]){
                    count++;
                }
            }
            if(count == 1){
                System.out.println(arr[i]);
                return;
            }
        count = 0;
        }
        
    }
}
