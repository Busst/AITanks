import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Test {

    public static void main(String[] args) {
        Net ann = new Net();
        //System.out.println(ann.toString());
        List<Double> data = new ArrayList<>();
        List<Double> expected = new ArrayList<>();
        expected.add(0d);
        data.add(1d);data.add(1d);
        ann.feedForward(data);
        System.out.println("****************************************");
        System.out.println(ann.toString());
        ann.backpropagate(expected);
        ann.feedForward(data);
        /*
        data = new ArrayList<>();
        data.add(0d);data.add(0d);
        ann.feedForward(data);
        */
        System.out.println("****************************************");
        for (int i =0; i < 5000; i++) {
            expected = new ArrayList<>();
            expected.add(1d);
            data = new ArrayList<>();
            data.add(1d);data.add(0d);
            ann.feedForward(data);
            ann.backpropagate(expected);

            expected = new ArrayList<>();
            expected.add(0d);
            data = new ArrayList<>();
            data.add(1d);data.add(1d);
            ann.feedForward(data);
            ann.backpropagate(expected);

            expected = new ArrayList<>();
            expected.add(1d);
            data = new ArrayList<>();
            data.add(0d);data.add(1d);
            ann.feedForward(data);
            ann.backpropagate(expected);

            expected = new ArrayList<>();
            expected.add(0d);
            data = new ArrayList<>();
            data.add(0d);data.add(0d);
            ann.feedForward(data);
            ann.backpropagate(expected);
        }

        System.out.println(ann.toString());

        Scanner in = new Scanner(System.in);
        String line = "";
        while (true) {
            line = in.nextLine();
            if (line.equals("quit")) break;
            String[] sp = line.split(" ");
            data = new ArrayList<>();
            for (int i = 0; i < sp.length; i++) {
                data.add(Double.parseDouble(sp[i]));
            }
            ann.feedForward(data);
            System.out.println(ann.toString());
        }

        in.close();
    }
}
