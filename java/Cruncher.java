class Cruncher{
        void crunch(int i){System.out.println("int version");}
            void crunch(String s){System.out.println("String version");}
                 public static void main(String args[]){
                             Cruncher crun=new Cruncher();
                                     char ch='p';
                                             crun.crunch(ch);
                                                  }
                    }
