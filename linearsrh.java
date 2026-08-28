public class linearsrh {
    public static void main(String [] args){
        int arr[] ={4,9,2,7,1};
        int i=0;
        int target = 7;
        for(i=0; i<arr.length; i++){
            if(arr[i]==target){
                System.out.println("Element found at index: "+i);
                break;
            }
        }
    }
}
