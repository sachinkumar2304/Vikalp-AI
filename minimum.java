public class minimum {
    public static void main(String [] args){
        int arr[]= {4,9,2,7,1};
        int i=0;
        boolean isMin = false;
        for(i=0; i<arr.length; i++){
            isMin = false;
            for(int j=i+1; j<arr.length; j++){
                if(arr[i]>arr[j]){
                    isMin =true;
                    break;
                }
            }
            if(!isMin){
                System.out.println("Minimum number is : "+arr[i]);
                break;
            }
        }
    }

}
