import java.awt.*;
public class X extends Frame {
    public static void main(String[] args) {
        X x=new X();
          x.pack();

          x.setVisible(true);
      }
       public X(){
            setLayout(new GridLayout(2,2));
           Panel p1=new Panel();add(p1);
                   Button b1=new Button("One");p1.add(b1);
                       Panel p2=new Panel();add(p2);
                           Button b2=new Button("Two");p2.add(b2);
                               Button b3=new Button("Three");p2.add(b3);
                                   Button b4=new Button("Four");add(b4);
       }
}
