public class PrintStar {                               
    public PrintStar(int n) {
        for(int i = 0 ; i <n; i++) {
            for(int j = n-i-1; j<n; j++) 
                System.out.print("*");
            System.out.println();  
        }
    }
    public static void main(String[] args){
        PrintStar  ps = new PrintStar(5);  
    }
}
