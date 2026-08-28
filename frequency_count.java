public class frequency_count {
    public static void main(String [] args){
        int arr [] = {1,2,2,3,4,1,2};
        int count = 0;
        for(int i=0; i<arr.length; i++){
            boolean isCounted = false;
            for(int k=0; k<i; k++){
                if(arr[k] == arr[i]){
                    isCounted = true;
                    break;
                }
            }
            if(isCounted == true){
                continue;
            }
            for(int j=0; j<arr.length; j++){
                if(arr[i] == arr[j]){
                    count ++;
                }
            }
            System.out.println(arr[i] + ":" + count);
            count = 0;
        }
    }
}
