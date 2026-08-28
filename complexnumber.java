class number{
    int x;
    int y;

    public number(int x, int y) {
        this.x=x;
        this.y=y;
    }

    
    number(){

    }
    void print(){
        if (y>=0) System.out.println(x+"+"+y+"i");
        else System.out.println(x+"-"+(-y)+"i");
    }
    void add(number n){
        x += n.x;
        y += n.y;
    }
    void multiply(number n){
        x = x*n.x - y*n.y;
        y = y*n.y + x*n.x;

    }
}




public class complexnumber {
    public static void main(String[] args) {
        number n = new number(3,-5);
        n.print();
        number n1 = new number(4,6);
        n1.print();
        n.add(n1);
        n.print();
        n.multiply(n1);
        n.print();
    }
}
