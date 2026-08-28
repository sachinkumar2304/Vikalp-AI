public class movezeroes {
    public static void main(String[] args){
        int arr[] = {0,1,0,3,0,5,0,7};
        int insertpos = 0;
        for(int i = 0; i<arr.length; i++){
            if(arr[i]!=0){
                arr[insertpos] = arr[i];
                insertpos++;

            }
        }
        for(int k=insertpos; k<arr.length; k++){
            arr[k] = 0;
        }
        for(int i=0; i<arr.length; i++){
            System.out.print(arr[i]+" ");
        }
    }
}
