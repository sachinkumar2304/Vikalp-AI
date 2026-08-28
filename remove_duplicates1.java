public class remove_duplicates1 {
    public static void main(String[] args) {
        int arr[] = { 2, 4, 2, 6, 4, 8, 6, 10 };
        for (int i = 0; i < arr.length; i++) {
            boolean isduplicate = false;

            for (int k = 0; k < i; k++) {
                if (arr[k] == arr[i]) {
                    isduplicate = true;
                    break;
                }
            }if(!isduplicate){
                System.out.println(arr[i]);
            }
        }
        
    }
}
