public class count_even_odd {
    public static void main(String [] args){
        int arr[] = {4,9,2,7,1,4,6,5,8};
        int evencounter=0;
        int oddcounter=0;
        for(int i=0; i<arr.length; i++){
            if(arr[i]%2 == 0){
                evencounter++;
            }
            else{
                oddcounter++;
            }
            }
        System.out.println("Total even number in the array is: "+ evencounter);
        System.out.println("Total odd number in the array is: "+ oddcounter);

        }

       
    }
