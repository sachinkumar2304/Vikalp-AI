public class maximum {
    public static void main(String [] args){
        int arr[]= {4,9,2,7,1};
        int i = 0;
        boolean isMax = false;
        for ( i=0; i<arr.length; i++){
            isMax = false;
            for(int j=i+1; j<arr.length; j++){
                if(arr[i]<arr[j]){
                    isMax = true;
                    break;

                }
            }
            if(!isMax){
                System.out.println("Maximum number is : "+arr[i]);
            break;
            }
        }
    }
}
