public class secondlargest {
    public static void main(String[] args){
        int arr[] = {4,9,2,7,1};
        int i=0;
        int largest = -1;
        int secondlargest = -1;
        for(i=0; i<arr.length; i++){
            if(arr[i]>largest){
                secondlargest = largest;
                largest = arr[i];
            }
            else if(arr[i]>secondlargest && arr[i]!=largest){
                secondlargest = arr[i];
            }
        }
        System.out.println("Second largest element is: " + secondlargest);
    }
}
