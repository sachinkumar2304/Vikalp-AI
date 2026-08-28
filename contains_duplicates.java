public class contains_duplicates {
    public static void main(String [] args){
        int arr [] = {1,2,3,4,2,5};
        //boolean isDuplicate = false;
        for(int i=0; i<arr.length; i++){
            for(int j=i+1; j<arr.length; j++){
                if(arr[i] == arr[j]){
                    //isDuplicate = true;
                    System.out.println(true);
                    return;

                }
            }
            
        }
        System.out.println(false);
    }
}
