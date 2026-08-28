public class secondlargest1 {
    public static void main(String[] args) {
        int []arr = {2,4,6,8,3,5,7};
        int largest = -1;
        int secondlargest = -1;
        for(int i = 0; i<arr.length; i++){
            if(arr[i] > largest){
                secondlargest = largest;
                largest = arr[i];
                
            }
            else if(arr[i] > secondlargest && secondlargest!=largest){
                secondlargest = arr[i];
                
            }
        }
        System.out.println(secondlargest);

    }
    
}
