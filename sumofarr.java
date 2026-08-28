public class sumofarr {
    public static void main(String [] args){
        int arr[] = {4,9,2,7,1};
        int sum=0;
        for(int i=0; i<arr.length; i++){
            sum = sum+arr[i];
        }
        System.out.println("Sum of array is:" +sum);
    }
}
