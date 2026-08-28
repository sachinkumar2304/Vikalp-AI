public class movezeroes1 {
    public static void main(String[] args) {
       int []arr={3,4,0,6,0,2,0};
       int newarr =0;
       for(int i = 0; i<arr.length; i++){
            if(arr[i]!=0){
                arr[newarr] = arr[i];
                newarr++;
            }
        }
        for(int k=newarr; k<arr.length; k++){
            arr[k]=0;
        }
        for(int i=0; i<arr.length; i++){
            System.out.println(arr[i]+" ");
        }

    }
    
}
