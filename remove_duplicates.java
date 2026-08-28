public class remove_duplicates {
    public static void main(String [] args){
        int arr[] = {4,9,2,4,7,1,4,9};
        for(int i=0; i<arr.length; i++){
            boolean isduplicate = false;
            for(int j=i+1; j<arr.length; j++){
                if(arr[i]==arr[j]){
                    isduplicate = true;
                    break;
                }
            }
            if(!isduplicate){
                System.out.println(arr[i]);
            }

        }
    }
}
