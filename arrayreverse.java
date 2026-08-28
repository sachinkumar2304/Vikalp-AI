public class arrayreverse {
    public static void main(String [] args){
        int arr[] = {4,9,2,7,1};
        int low = 0;
        int high = arr.length-1;
        while (low<high){
            int temp = arr[low];
            arr[low] = arr[high];
            arr[high] = temp;
            low++;
            high--;
        }
        for(int i=0; i<arr.length; i++){
            System.out.print(arr[i]+" ");
        }
    }
}
