import java.awt.*;
   public class Example extends Frame{
             final static int n=4;
                   final static String city[]={"成都","上海","北京","重庆"};
                         final static Checkbox c[]=new Checkbox [4];
                               public static void main(String[]args){
                                           Example e=new Example();
                                                   e.setSize(400,80);
                                                           e.setTitle("我喜爱的城市");
                                                                   e.setLayout(new FlowLayout());
                                                                           e.add(new Label("请选择城市："));
                                                                                   for(int i=0;i<n;i++){
                                                                                                 c[i]=new Checkbox(city[i]);
                                                                                                           e.add(c[i]);
                                                                                                                   }
                                                                                           e.setVisible(true);
                                                                                                 }
                                   }
