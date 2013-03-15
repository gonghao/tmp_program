import java.io.*;

class Objectclass{
    int sv, tv;
    int temp[] = new int [5];
    int sum(){
        int i, summ = 0;
        for (i=0; i<temp.length; i++) {
           summ+=i;
        }
       return summ;
    }

    int max(){
        return (sv>tv)?sv:tv;
    }

    Objectclass(int s, int t, int array[]){
        sv=s;
        tv=t;
        for (int i=0; i<array.length; i++) {
            temp[i]=array[i];
        }
    }

    public static void main(String args[]){
        int array[] = {3, 4, 5, 6, 7};
        Objectclass O=new Objectclass(1,2, array);
        System.out.println(O.sum());
        System.out.println(O.max());
    }
}
